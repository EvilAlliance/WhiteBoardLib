import { Canvas } from "../Canvas";
import { ORIGIN, Point } from "../GeoSpace/Point";
import { Flood } from "../Object/Flood";
import { ColorRGBA, ColorRGBToParse } from "../Utils/Color";
import { BaseBrush } from "./BaseBrush";

export class FloodFill extends BaseBrush {
    targetColor: ColorRGBA = [255, 0, 0, 255];
    tolerance: number = 20;

    constructor(obj: Partial<FloodFill>) {
        super();
        Object.assign(this, obj);
    }

    mouseDown(canvas: Canvas<this>, e: MouseEvent): void {
        const mousePoint = new Point(e.offsetX, e.offsetY).floor();


        const cc = document.createElement('canvas');
        const cctx = cc.getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D;

        const f = new Flood(cc, cctx, ORIGIN.copy());
        canvas.addCanvasObject(f);

        const worker = new Worker('./src/WhiteBoard/Cursor/FloodFill.worker.ts', { type: 'module' });

        const w = {
            imageData: canvas.ctx.getImageData(0, 0, canvas.width + 1, canvas.height + 1),
            p: mousePoint.copy(),
            bgColor: ColorRGBToParse(canvas.bgColor),
            targetColor: this.targetColor,
            tolerance: this.tolerance,
        };

        worker.postMessage(w);

        worker.addEventListener('message', (e) => {
            worker.terminate();

            const c = e.data;

            if (!c) return;
            if (c.imageData instanceof ImageData && typeof c.translateX == 'number' && typeof c.translateY == 'number' && typeof c.width == 'number' && typeof c.height == 'number') {

                cc.width = c.width;
                cc.height = c.height;

                cctx.putImageData(c.imageData, -c.translateX, -c.translateY);

                f.translate.x = c.translateX;
                f.translate.y = c.translateY;

                f.dirty = true;
                canvas.render();
            }


        });
    }

    mouseMove(_1: Canvas<this>, _2: MouseEvent, _3: void): void {

    }

    mouseUp(_1: Canvas<this>, _2: MouseEvent, _3: void): void {

    }

}
