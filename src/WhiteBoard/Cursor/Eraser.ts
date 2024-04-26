import { Canvas } from '../Canvas';
import { Point } from '../GeoSpace/Point';
import { Vector } from '../GeoSpace/Vector';
import { CtxSetting } from '../Object/CtxSetting';
import { Path } from '../Object/Path';
import { BaseBrush } from './BaseBrush';

export class Eraser extends BaseBrush {
    tolerance: number = 5;
    lineCap: CanvasLineCap = 'round';
    erasing: boolean = false;
    path?: Path;


    constructor(obj: Partial<Eraser> = {}) {
        super();
        Object.assign(this, obj);
    }

    mouseDown(canvas: Canvas<this>): void {
        this.erasing = true;
        this.path = new Path({
            ctxSetting: new CtxSetting({
                strokeWidth: this.diameter,
                strokeColor: canvas.bgColor,
                lineCap: this.lineCap,
            })
        });

        canvas.startRenderingSigle(this.path);
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
        canvas.renderSingle();
    }

    mouseUp(canvas: Canvas<this>, _: MouseEvent): void {
        if (!this.path) return;
        this.path.ctxSetting.globalCompositeOperation = 'destination-out';
        this.erasing = false;
        for (const object of canvas.Objects) {
            if (object.Object.objectShareArea(this.path)) {
                object.Object.erased.push(this.path.copy());
            }
        }
        canvas.stopRenderingSigle();
        this.path = undefined;
    }
}
