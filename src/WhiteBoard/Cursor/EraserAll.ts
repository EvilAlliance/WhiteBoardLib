import { Canvas } from '../Canvas';
import { ORIGIN, Point } from '../GeoSpace/Point';
import { Vector } from '../GeoSpace/Vector';
import { Flood } from '../Object/Flood';
import { ColorRGBA } from '../Utils/Color';
import { FloodFill } from './FloodFill';

export class EraserAll extends FloodFill {
    targetColor: ColorRGBA = [0, 0, 0, 255];
    tolerance: number = 196;
    constructor(eraserAll: Partial<EraserAll> = {}) {
        super(eraserAll);
    }

    mouseDown(canvas: Canvas<this>, e: MouseEvent): undefined {
        const mousePoint = new Point(e.offsetX, e.offsetY);

        for (const object of canvas.Objects) {
            if (!(object.shouldRender && object.pointInside(mousePoint))) continue;
            if (object.isDirty()) object.createCacheCanvas();

            const ctx = object.cacheContext as CanvasRenderingContext2D;
            const v = new Vector(ORIGIN, new Point(-object.cacheTranselateX, -object.cacheTranselateY));
            const transformedPoint = mousePoint.copy().translate(v).floor();

            const worker = new Worker('./src/WhiteBoard/Cursor/EraserAll.worker.ts', { type: 'module' });

            worker.postMessage({
                imageData: ctx.getImageData(0, 0, ctx.canvas.width + 1, ctx.canvas.height + 1),
                p: transformedPoint,
                targetColor: this.targetColor,
            });

            worker.addEventListener('message', (e) => {
                worker.terminate();

                const c = e.data;

                if (!c) return;
                if (c.imageData instanceof ImageData && typeof c.translateX == 'number' && typeof c.translateY == 'number' && typeof c.width == 'number' && typeof c.height == 'number') {
                    const cc = document.createElement('canvas');
                    const cctx = cc.getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D;

                    cc.width = c.width;
                    cc.height = c.height;

                    cctx.putImageData(c.imageData, -c.translateX, -c.translateY);

                    const f = new Flood(cc, cctx, new Point(c.translateX, c.translateY));

                    f.ctxSetting.globalCompositeOperation = 'destination-out';
                    f.trans.translate(v.rotate(Math.PI));

                    object.erased.push(f);

                    canvas.clear();
                    canvas.render();
                }
            });
        }
    }


    mouseMove(_canvas: Canvas<this>, _e: MouseEvent): void {
    }

    mouseUp(_canvas: Canvas<this>, _e: MouseEvent): void {

    }
}
