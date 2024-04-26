import Queue from "../../DataStructures/Queue";
import { Point } from "../GeoSpace/Point";
import { BoundingBox } from "../Object/BoundingBox";
import { FloodWorker } from "../Object/Flood";
import { ColorRGB, ColorRGBA, ColorRGBToLCH } from "../Utils/Color";

self.addEventListener('message', (e: MessageEvent) => {
    const { imageData, p, targetColor, bgColor, tolerance } = e.data;
    if (imageData instanceof ImageData &&
        typeof p.x == 'number' && typeof p.y == 'number' &&
        Array.isArray(bgColor) && bgColor.length == 3 && bgColor.every(x => typeof x == 'number') &&
        Array.isArray(targetColor) && targetColor.length == 4 && targetColor.every(x => typeof x == 'number') &&
        typeof tolerance == 'number'
    ) {
        self.postMessage(floodFill(imageData, new Point(p.x, p.y), targetColor as ColorRGBA, bgColor as ColorRGB, tolerance));
    } else {
        console.error(
            `Type ERROR imageData (${imageData}) should be an instanceof ImageData,
p (${p}) should have property x and y as a number
targetColor should be an array of numbers of length 4
bgColor should be an array of numbers length 3
tolerance should be a number`
        );
    }
    self.postMessage(null);
});

function RGBAtoRGB(bg: ColorRGB, fg: ColorRGBA): ColorRGB {
    const alpha = fg[3] / 255;
    if (alpha === 1) return [fg[0], fg[1], fg[2]];

    return [
        getTintValue(alpha, fg[0], bg[0]),
        getTintValue(alpha, fg[1], bg[1]),
        getTintValue(alpha, fg[2], bg[2])
    ];
}

function getTintValue(alpha: number, tint: number, bgTint: number): number {
    const tmp = Math.floor((1 - alpha) * bgTint + alpha * tint);
    if (tmp > 255) {
        return 255;
    }
    return tmp;
}

function colorMatch(current: ColorRGB, base: ColorRGB): number {
    const c = ColorRGBToLCH(current);
    const b = ColorRGBToLCH(base);
    const result = Math.hypot(c[0] - b[0], (c[1] - b[1]) / (1 + 0.045 * c[1]), (c[2] - b[2]) / (1 + 0.015 * c[1]));

    return result;
}

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

function floodFill(imageData: ImageData, p: Point, targetColor: ColorRGBA, bgColor: ColorRGB, tolerance: number): null | FloodWorker {
    /*
    const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    const newImageData = new ImageData(ctx.canvas.width, ctx.canvas.height);

    // get the color we're filling
    const pixelColorRGBA = this.getPixel(imageData, p);
    const pixelColorRGB = this.RGBAtoRGB(bgColor, pixelColorRGBA);

    // check we are actually filling a different color
    if (this.colorMatch(pixelColorRGB, this.RGBAtoRGB(bgColor, this.targetColor)) > 10) {

        const q = new Queue<Point>();

        const tl = p.copy();
        const br = p.copy();

        q.enqueue(p);

        while (q.peek()) {
            const a = q.dequeue() as Point;

            if (a.x < 0 || a.y < 0 || a.x >= imageData.width || a.y >= imageData.height) continue;
            const currentColor = this.getPixel(imageData, a);
            if (this.colorMatch(this.RGBAtoRGB(bgColor, this.getPixel(newImageData, a)), this.RGBAtoRGB(bgColor, this.targetColor)) && this.colorMatch(this.RGBAtoRGB(bgColor, currentColor), pixelColorRGB) <= this.tolerance) {
                this.setPixel(newImageData, a, this.targetColor);

                q.enqueue(a.copy().translate(NORMAL.x));
                q.enqueue(a.copy().translate(NORMAL.xI));
                q.enqueue(a.copy().translate(NORMAL.y));
                q.enqueue(a.copy().translate(NORMAL.yI));

                if (a.x < tl.x) {
                    tl.x = a.x;
                } else if (a.x > br.x) {
                    br.x = a.x;
                }

                if (a.y < tl.y) {
                    tl.y = a.y;
                } else if (a.y > br.y) {
                    br.y = a.y;
                }
            }
        }


        const point = tl.copy();
        br.x += 1;
        br.y += 1;
        const finalImageData = new ImageData(br.x - tl.x, br.y - tl.y);

        for (point.x = tl.x; point.x < br.x; point.x++) {
            for (point.y = tl.y; point.y < br.y; point.y++) {
                const temp = point.copy();
                temp.x -= tl.x;
                temp.y -= tl.y;
                this.setPixel(finalImageData, temp, this.getPixel(newImageData, point));
            }
        }

        const c = document.createElement('canvas');
        c.width = finalImageData.width;
        c.height = finalImageData.height;

        const cctx = c.getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D;
        cctx.putImageData(finalImageData, 0, 0);

        return new Flood(c, cctx, tl.copy());
    }
    return null;*/

    const pixelColorRGBA = getPixel(imageData, p);

    const baseColorRGB = RGBAtoRGB(bgColor, pixelColorRGBA);

    const targetColorRGB = RGBAtoRGB(bgColor, targetColor)

    if (colorMatch(baseColorRGB, targetColorRGB) < 10) return null;

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
        if (!colorMatch(RGBAtoRGB(bgColor, getPixel(newImageData, leftP)), targetColorRGB)) continue;

        leftP.translateX(-1);
        while (leftP.x >= 0 && colorMatch(RGBAtoRGB(bgColor, getPixel(newImageData, leftP)), targetColorRGB) && colorMatch(RGBAtoRGB(bgColor, getPixel(imageData, leftP)), baseColorRGB) < tolerance) {
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
            while (rightP.x < imageData.width && (colorMatch(RGBAtoRGB(bgColor, getPixel(imageData, rightP)), baseColorRGB) < tolerance)) {
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
            while (rightP.x < imageData.width && rightP.x <= x2 && colorMatch(RGBAtoRGB(bgColor, getPixel(imageData, rightP)), baseColorRGB) >= tolerance) {
                rightP.translateX(1);
            }

            leftP.x = rightP.x;
        }
    }

    return {
        imageData: newImageData,
        translateX: boundingBox.tl.x,
        translateY: boundingBox.tl.y,
        width: boundingBox.tr.x - boundingBox.tl.x,
        height: boundingBox.bl.y - boundingBox.tl.y,
    }
}
