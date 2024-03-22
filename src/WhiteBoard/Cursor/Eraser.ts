import { Canvas } from '../Canvas';
import { Point } from '../GeoSpace/Point';
import { BaseObject } from '../Object/BaseObject';
import { CtxSetting } from '../Object/CtxSetting';
import { Path } from '../Object/Path';
import { BaseBrush } from './BaseBrush';

export class Eraser extends BaseBrush<WeakMap<BaseObject, Path>> {
    tolerance: number = 5;
    lineCap: CanvasLineCap = 'round';

    constructor(obj: Partial<Eraser> = {}) {
        super();
        Object.assign(this, obj);
    }

    mouseDown(_: Canvas<this>): WeakMap<BaseObject, Path> {
        return new WeakMap<BaseObject, Path>();
    }

    mouseMove(canvas: Canvas<this>, e: MouseEvent, obj: WeakMap<BaseObject, Path>): void {
        const mousePoint = new Point(e.offsetX, e.offsetY);
        for (const object of canvas.Objects) {
            if (!object.render) return;
            if (object.Object.pointInRange(mousePoint, this.diameter / 2)) {
                const path = obj.get(object.Object);
                if (!path) {
                    //const beforeData = BaseObjectCanvasData(object.Object);
                    const p = new Path({
                        ctxSetting: new CtxSetting({
                            strokeWidth: this.diameter,
                            lineCap: this.lineCap,
                            globalCompositeOperation: 'destination-out',
                            strokeColor: 'Black',
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
                    path.addPoint(mousePoint);
                    //const afterData = BaseObjectCanvasData(object.Object);
                    /*
                    if (arrIdentical(beforeData, afterData)) {
                        console.log('removed')
                        path.Path.pop();
                        obj.delete(object.Object);
                    }
                    */
                }
                canvas.clear();
                canvas.render();
            } else {
                if (obj.delete(object.Object)) {
                    //EraserAllObjectCeaseExist(canvas, object);
                }
            }
        }
    }

    mouseUp(canvas: Canvas<this>, _: MouseEvent, obj: WeakMap<BaseObject, Path>): void {
        for (const object of canvas.Objects) {
            if (obj.delete(object.Object)) {
                //EraserAllObjectCeaseExist(canvas, object);
            }
        }
    }
}
