import { Canvas, CanvasClear, CanvasRender } from '../Canvas';
import { Point } from '../GeoSpace/Point';
import { BaseObject } from '../Object/BaseObject';
import { Path } from '../Object/Path';
import { BaseBrush } from './BaseBrush';

export class Eraser extends BaseBrush<WeakMap<BaseObject, Path>>{
    tolerance: number = 5;
    lineCap: CanvasLineCap = 'round';

    constructor(obj: Partial<Eraser> = {}) {
        super();
        Object.assign(this, obj);
    }

    //@ts-ignore
    mouseDown(canvas: Canvas<this>): WeakMap<BaseObject, Path> {
        return new WeakMap<BaseObject, Path>();
    }

    mouseMove(canvas: Canvas<this>, e: MouseEvent, obj: WeakMap<BaseObject, Path>): void {
        EraserMouseMove(canvas, e, obj);
    }

    //@ts-ignore
    mouseUp(canvas: Canvas<this>, e: MouseEvent, obj: WeakMap<BaseObject, Path>): void {

    }
}

export function EraserMouseMove(canvas: Canvas<Eraser>, e: MouseEvent, obj: WeakMap<BaseObject, Path>) {
    const mousePoint = new Point(e.offsetX, e.offsetY);
    for (const object of canvas.Objects) {
        if (!object.render) return;
        if (object.Object.pointInRange(object.Object, mousePoint, canvas.cursor.width, canvas.cursor.tolerance)) {
            const path = obj.get(object.Object);
            if (!path) {
                const p = new Path({
                    ctxTransformation: object.Object.ctxTransformation,
                    ctxSetting: {
                        strokeWidth: canvas.cursor.width,
                        lineCap: canvas.cursor.lineCap,
                        globalCompositeOperation: 'destination-out',
                    },
                    Path: [mousePoint],
                });

                object.Object.erased.push(p);

                obj.set(object.Object, p);
            } else {
                path.Path.push(mousePoint);
            }
            CanvasClear(canvas);
            CanvasRender(canvas);
        } else {
            obj.delete(object.Object);
        }
    }
}
