import Queue from "../../DataStructures/Queue";
import { Canvas } from "../Canvas";
import { Point } from "../GeoSpace/Point";
import { NORMAL } from "../GeoSpace/Vector";
import { Flood } from "../Object/Flood";
import { ColorRGB, ColorRGBA, ColorRGBToLCH, ColorRGBToParse } from "../Utils/Color";
import { BaseBrush } from "./BaseBrush";

export class FloodFill extends BaseBrush {
    targetColor: ColorRGBA = [255, 0, 0, 255];
    tolerance: number = 10;

    constructor(obj: Partial<FloodFill>) {
        super();
        Object.assign(this, obj);
    }

    mouseDown(canvas: Canvas<this>, e: MouseEvent): void {
        const mousePoint = new Point(Math.floor(e.offsetX), Math.floor(e.offsetY));

        const c = this.floodFill(canvas.ctx, mousePoint, ColorRGBToParse(canvas.bgColor));

        if (!c) return;
        canvas.addCanvasObjectRender(c);
    }

    mouseMove(_1: Canvas<this>, _2: MouseEvent, _3: void): void {

    }

    mouseUp(_1: Canvas<this>, _2: MouseEvent, _3: void): void {

    }

    RGBAtoRGB(bg: ColorRGB, fg: ColorRGBA): ColorRGB {
        if (fg[3] === 1) return [fg[0], fg[1], fg[2]];
        return [
            this.getTintValue(fg[3], fg[0], bg[0]),
            this.getTintValue(fg[3], fg[1], bg[1]),
            this.getTintValue(fg[3], fg[2], bg[2])
        ];
    }

    getTintValue(alpha: number, tint: number, bgTint: number): number {
        var tmp = Math.floor((1 - alpha) * bgTint + alpha * tint);
        if (tmp > 255) {
            return 255;
        }
        return tmp;
    }

    colorMatch(current: ColorRGB, base: ColorRGB): number {
        const c = ColorRGBToLCH(current);
        const b = ColorRGBToLCH(base);

        return Math.hypot(c[0] - b[0], (c[1] - b[1]) / (1 + 0.045 * c[1]), (c[2] - b[2]) / (1 + 0.015 * c[1]));
    }

    getPixel(imageData: ImageData, p: Point): ColorRGBA {
        if (p.x < 0 || p.y < 0 || p.x >= imageData.width || p.y >= imageData.height) {
            return [-1, -1, -1, -1];
        } else {
            const offset = (p.y * imageData.width + p.x) * 4;
            return [imageData.data[offset], imageData.data[offset + 1], imageData.data[offset + 2], imageData.data[offset + 3]];
        }
    }

    setPixel(imageData: ImageData, p: Point, c: ColorRGBA) {
        const offset = (p.y * imageData.width + p.x) * 4;
        imageData.data[offset + 0] = c[0];
        imageData.data[offset + 1] = c[1];
        imageData.data[offset + 2] = c[2];
        imageData.data[offset + 3] = c[3];
    }

    floodFill(ctx: CanvasRenderingContext2D, p: Point, bgColor: ColorRGB): Flood | null {
        const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
        const newImageData = new ImageData(ctx.canvas.width, ctx.canvas.height);

        // flags for if we visited a pixel already
        const visited = new Uint8Array(imageData.width * imageData.height);

        // get the color we're filling
        const pixelColor = this.getPixel(imageData, p);

        // check we are actually filling a different color
        if (this.colorMatch(this.RGBAtoRGB(bgColor, pixelColor), this.RGBAtoRGB(bgColor, this.targetColor)) > this.tolerance) {

            const q = new Queue<Point>();

            const tl = p.copy();
            const br = p.copy();

            q.enqueue(p);

            while (q.peek()) {
                const a = q.deque() as Point;

                const currentColor = this.getPixel(imageData, a);
                if (!visited[a.y * imageData.width + a.x] &&
                    this.colorMatch(this.RGBAtoRGB(bgColor, currentColor), this.RGBAtoRGB(bgColor, pixelColor)) <= this.tolerance) {
                    this.setPixel(newImageData, a, this.targetColor);

                    visited[a.y * imageData.width + a.x] = 1;  // mark we were here already
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

            console.log('pepe')
            return new Flood(c, cctx, tl.copy());
        }
        return null;
    }


}
