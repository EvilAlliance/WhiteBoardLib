import { Canvas } from '../Canvas';
import { Point } from '../GeoSpace/Point';
import { Vector } from '../GeoSpace/Vector';
import { BaseObject } from '../Object/BaseObject';
import { CtxSetting } from '../Object/CtxSetting';
import { Path } from '../Object/Path';
import { BaseBrush } from './BaseBrush';

export class Eraser extends BaseBrush {
    tolerance: number = 5;
    lineCap: CanvasLineCap = 'round';
    erasing: boolean = false;
    erasingObjects: Map<BaseObject, Path> = new Map();;
    path?: Path;


    constructor(obj: Partial<Eraser> = {}) {
        super();
        Object.assign(this, obj);
    }

    mouseDown(canvas: Canvas<this>): void {
        this.erasing = true;
        this.path = new Path({
            ctxSetting: new CtxSetting({
                strokeWidth: canvas.cursor.diameter,
                strokeColor: 'Black',
                lineCap: this.lineCap,
                globalCompositeOperation: 'destination-out',
            })
        });
    }

    mouseMove(canvas: Canvas<this>, e: MouseEvent): void {
        if (!this.path) return;
        const p = new Point(e.offsetX, e.offsetY);

        if (this.path.Path.length == 0) {
            this.path.push(p);
        } else {
            const v = new Vector(p, this.path.Path[this.path.Path.length - 1]);
            if (v.mod() >= 3) {
                this.path.push(p);
            }
        }

        for (const object of canvas.Objects) {
            if (!object.render) continue;
            const path = this.erasingObjects.get(object.Object);
            if (path) {
                path.push(p);
            } else if (object.Object.objectShareArea(this.path)) {
                const path = this.path.copy();
                object.Object.erased.push(path);
                this.erasingObjects.set(object.Object, path);
            }
        }

        canvas.clear()
        canvas.render()
    }

    mouseUp(_1: Canvas<this>, _: MouseEvent): void {
        this.erasing = false;
        this.path = undefined;
        this.erasingObjects.clear();
    }
}
