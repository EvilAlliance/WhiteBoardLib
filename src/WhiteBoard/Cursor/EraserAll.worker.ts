import Queue from "../../DataStructures/Queue";
import { Point } from "../GeoSpace/Point";
import { BoundingBox } from "../Object/BoundingBox";
import { FloodWorker } from "../Object/Flood";
import { ColorRGBA } from "../Utils/Color";

self.addEventListener('message', (e: MessageEvent) => {
    const { imageData, p, targetColor } = e.data;
    if (imageData instanceof ImageData &&
        typeof p.x == 'number' && typeof p.y == 'number' &&
        Array.isArray(targetColor) && targetColor.length == 4 && targetColor.every(x => typeof x == 'number')
    ) {
        self.postMessage(floodFill(imageData, new Point(p.x, p.y), targetColor as ColorRGBA));
    } else {
        console.error(
            `Type ERROR ctx (${imageData}) should be an instanceof ImageData,
p (${p}) should be an instanceof Point
targetColor should be an array of numbers of length 4`
        );
    }
    self.postMessage(null);
});

function getPixel(imageData: ImageData, p: Point): ColorRGBA {
    if (p.x < 0 || p.y < 0 || p.x >= imageData.width || p.y >= imageData.height) {
        return [-1, -1, -1, -1];
    } else {
        const offset = (p.y * imageData.width + p.x) * 4;
        return [imageData.data[offset], imageData.data[offset + 1], imageData.data[offset + 2], imageData.data[offset + 3]];
    }
}

function setPixel(imageData: ImageData, p: Point, c: ColorRGBA) {
    const offset = (p.y * imageData.width + p.x) * 4;
    imageData.data[offset + 0] = c[0];
    imageData.data[offset + 1] = c[1];
    imageData.data[offset + 2] = c[2];
    imageData.data[offset + 3] = c[3];
}

function emptyPixel(c: ColorRGBA): boolean {
    return c[3] == 0;
}

function floodFill(imageData: ImageData, p: Point, targetColor: ColorRGBA): FloodWorker | null {
    if (emptyPixel(getPixel(imageData, p))) return null;

    const boundingBox = new BoundingBox(p.copy(), p.copy(), p.copy(), p.copy());

    const newImageData = new ImageData(imageData.width, imageData.height);

    type Coord = {
        x1: number,
        x2: number,
        y: number,
        dy: number,
    };

    const q = new Queue<Coord>();

    q.enqueue({ x1: p.x, x2: p.x, y: p.y, dy: 1 });
    q.enqueue({ x1: p.x, x2: p.x, y: p.y, dy: - 1 });
    while (q.peek()) {
        const { x1, x2, y, dy } = q.dequeue() as Coord;
        if (y < 0 || y >= imageData.height) continue;

        const leftP = new Point(x1, y)
        if (!emptyPixel(getPixel(newImageData, leftP))) continue;

        leftP.translateX(-1);
        while (leftP.x >= 0 && emptyPixel(getPixel(newImageData, leftP)) && !emptyPixel(getPixel(imageData, leftP))) {
            setPixel(newImageData, leftP, targetColor);
            leftP.translateX(-1);
        }

        leftP.translateX(1);
        boundingBox.containPoint(leftP);

        if (leftP.x < x1) {
            q.enqueue({ x1: leftP.x, x2: x1 - 1, y: y - dy, dy: -dy });
        }

        const rightP = new Point(x1, y);
        while (rightP.x <= x2) {
            while (rightP.x < imageData.width && emptyPixel(getPixel(newImageData, rightP)) && !emptyPixel(getPixel(imageData, rightP))) {
                setPixel(newImageData, rightP, targetColor);
                rightP.translateX(1);
            }
            boundingBox.containPoint(rightP);

            const newX = rightP.x - 1;

            if (rightP.x > leftP.x) {
                q.enqueue({ x1: leftP.x, x2: newX, y: y + dy, dy: dy });
            }
            if (newX > x2) {
                q.enqueue({ x1: x2 + 1, x2: newX, y: y - dy, dy: -dy });
            }

            rightP.translateX(1);
            while (rightP.x < imageData.width && rightP.x <= x2 && emptyPixel(getPixel(imageData, rightP))) {
                rightP.translateX(1);
            }

            leftP.x = rightP.x;
        }
    }
    const width = boundingBox.tr.x - boundingBox.tl.x;
    const height = boundingBox.bl.y - boundingBox.tl.y;

    if (width == 0 || height == 0) return null;

    return {
        imageData: newImageData,
        translateX: boundingBox.tl.x,
        translateY: boundingBox.tl.y,
        width,
        height
    }
}
