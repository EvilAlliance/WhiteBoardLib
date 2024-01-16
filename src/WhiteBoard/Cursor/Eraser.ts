import { Canvas, CanvasClear, CanvasRender } from '../Canvas';
import { arrIdentical } from '../CommonMethod';
import { Point } from '../GeoSpace/Point';
import { BaseObject, BaseObjectCanvasData, CtxSetting } from '../Object/BaseObject';
import { Path } from '../Object/Path';
import { BaseBrush } from './BaseBrush';
import { EraserAllEraseObject } from './EraserAll';

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
        for (const object of canvas.Objects) {
            console.log(object.Object.erased);
            if (obj.delete(object.Object)) {
                if (BaseObjectCanvasData(object.Object).every((x) => x == 0)) EraserAllEraseObject(canvas, object);
            }
        }
    }
}

export function EraserMouseMove(canvas: Canvas<Eraser>, e: MouseEvent, obj: WeakMap<BaseObject, Path>) {
    const mousePoint = new Point(e.offsetX, e.offsetY);
    for (const object of canvas.Objects) {
        if (!object.render) return;
        if (object.Object.pointInRange(object.Object, mousePoint, canvas.cursor.width, canvas.cursor.tolerance)) {
            const path = obj.get(object.Object);
            if (!path) {
                //const beforeData = BaseObjectCanvasData(object.Object);
                const p = new Path({
                    ctxSetting: new CtxSetting({
                        strokeWidth: canvas.cursor.width,
                        lineCap: canvas.cursor.lineCap,
                        globalCompositeOperation: 'destination-out',
                    }),
                    Path: [mousePoint],
                });

                object.Object.erased.push(p);

                //const afterData = BaseObjectCanvasData(object.Object);

                /*
                if (!arrIdentical(beforeData, afterData)) {
                    obj.set(object.Object, p);
                } else {
                    object.Object.erased.pop();
                }
                */
            } else {
                //const beforeData = BaseObjectCanvasData(object.Object);
                path.Path.push(mousePoint);
                //const afterData = BaseObjectCanvasData(object.Object);
                /*
                if (arrIdentical(beforeData, afterData)) {
                    console.log('removed')
                    path.Path.pop();
                    obj.delete(object.Object);
                }
                */
            }
            CanvasClear(canvas);
            CanvasRender(canvas);
        } else {
            if (obj.delete(object.Object)) {
                if (BaseObjectCanvasData(object.Object).every((x) => x == 0)) EraserAllEraseObject(canvas, object);
            }
        }
    }
}
