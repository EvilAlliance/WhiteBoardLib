import Queue from '../../DataStructures/Queue';
import { Canvas } from '../Canvas';
import { ORIGIN, Point } from '../GeoSpace/Point';
import { Vector } from '../GeoSpace/Vector';
import { BoundingBox } from '../Object/BoundingBox';
import { CanvasObjectContainer } from '../Object/CanvasObjectContainer';
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
        let happpened = false;
        const mousePoint = new Point(e.offsetX, e.offsetY);

        for (const object of canvas.Objects) {
            if (!object.Object.pointInside(mousePoint)) continue;
            if (object.Object.isDirty()) object.Object.createCacheCanvas();

            const ctx = object.Object.cacheContext as CanvasRenderingContext2D;
            const v = new Vector(ORIGIN, new Point(-object.Object.cacheTranselateX, -object.Object.cacheTranselateY));
            const transformedPoint = mousePoint.copy().translate(v).floor();

            const flood = this.floodFill(ctx, transformedPoint);

            if (!flood) continue;

            flood.ctxSetting.globalCompositeOperation = 'destination-out';
            flood.translate.translate(v.rotate(Math.PI));

            object.Object.erased.push(flood);

            happpened = true;
        }

        if (happpened) {
            canvas.clear();
            canvas.render();
        }
    }

    emptyPixel(c: ColorRGBA): boolean {
        return c[3] == 0;
    }

    floodFill(ctx: CanvasRenderingContext2D, p: Point): Flood | null {
        const imageData = ctx.getImageData(0, 0, ctx.canvas.width + 1, ctx.canvas.height + 1);

        if (this.emptyPixel(this.getPixel(imageData, p))) return null;

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
            if (!this.emptyPixel(this.getPixel(newImageData, leftP))) continue;

            leftP.translateX(-1);
            while (leftP.x >= 0 && this.emptyPixel(this.getPixel(newImageData, leftP)) && !this.emptyPixel(this.getPixel(imageData, leftP))) {
                this.setPixel(newImageData, leftP, this.targetColor);
                leftP.translateX(-1);
            }

            leftP.translateX(1);
            boundingBox.containPoint(leftP);

            if (leftP.x < x1) {
                q.enqueue({ x1: leftP.x, x2: x1 - 1, y: y - dy, dy: -dy });
            }

            const rightP = new Point(x1, y);
            while (rightP.x <= x2) {
                while (rightP.x < imageData.width && this.emptyPixel(this.getPixel(newImageData, rightP)) && !this.emptyPixel(this.getPixel(imageData, rightP))) {
                    this.setPixel(newImageData, rightP, this.targetColor);
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
                while (rightP.x < imageData.width && rightP.x <= x2 && this.emptyPixel(this.getPixel(imageData, rightP))) {
                    rightP.translateX(1);
                }

                leftP.x = rightP.x;
            }
        }

        const c = document.createElement('canvas');
        c.width = boundingBox.tr.x - boundingBox.tl.x;
        c.height = boundingBox.bl.y - boundingBox.tl.y;

        const cctx = c.getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D;
        cctx.putImageData(newImageData, -boundingBox.tl.x, -boundingBox.tl.y);

        return new Flood(c, cctx, boundingBox.tl.copy());
    }

    mouseMove(_canvas: Canvas<this>, _e: MouseEvent): void {
    }

    mouseUp(_canvas: Canvas<this>, _e: MouseEvent): void {

    }
}

export function EraserAllEraseObject(canvas: Canvas, object: CanvasObjectContainer) {
    canvas.Objects.splice(canvas.Objects.indexOf(object), 1);
    canvas.clear();
    canvas.render();
}

