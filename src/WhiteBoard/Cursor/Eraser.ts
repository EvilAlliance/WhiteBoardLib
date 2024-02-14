import { Canvas, CanvasClear, CanvasRender } from '../Canvas';
import { arrIdentical } from '../CommonMethod';
import { Point } from '../GeoSpace/Point';
import { BaseObject, BaseObjectCanvasData, CtxSetting } from '../Object/BaseObject';
import { CanvasObjectContainer } from '../Object/CanvasObjectContainer';
import { Path } from '../Object/Path';
import { BaseBrush } from './BaseBrush';
import { EraserAllObjectCeaseExist } from './EraserAll';

export class Eraser extends BaseBrush<WeakMap<BaseObject, Path>>{
    tolerance: number = 5;
    lineCap: CanvasLineCap = 'round';
    activeWorker: WeakMap<CanvasObjectContainer, Worker> = new WeakMap();

    constructor(obj: Partial<Eraser> = {}) {
        super();
        Object.assign(this, obj);
    }

    mouseDown(canvas: Canvas<this>): WeakMap<BaseObject, Path> {
        return new WeakMap<BaseObject, Path>();
    }

    mouseMove(canvas: Canvas<this>, e: MouseEvent, obj: WeakMap<BaseObject, Path>): void {
        EraserMouseMove(canvas, e, obj);
    }

    mouseUp(canvas: Canvas<this>, e: MouseEvent, obj: WeakMap<BaseObject, Path>): void {
        for (const object of canvas.Objects) {
            if (obj.delete(object.Object)) {
                canvas.cursor.activeWorker.set(object, EraserAllObjectCeaseExist(canvas, object));
            }
        }
    }
}

export function EraserMouseMove(canvas: Canvas<Eraser>, e: MouseEvent, obj: WeakMap<BaseObject, Path>) {
    const mousePoint = new Point(e.offsetX, e.offsetY);
    for (const object of canvas.Objects) {
        if (!object.render) return;
        if (object.Object.pointInRange(object.Object, mousePoint, canvas.cursor.width, canvas.cursor.tolerance)) {
            canvas.cursor.activeWorker.delete(object);
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
                obj.set(object.Object, p);

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
                canvas.cursor.activeWorker.set(object, EraserAllObjectCeaseExist(canvas, object));
            }
        }
    }
}

