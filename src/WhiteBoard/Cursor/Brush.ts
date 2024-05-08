import { Canvas } from '../Canvas';
import { Point } from '../GeoSpace/Point';
import { Vector } from '../GeoSpace/Vector';
import { CtxSetting } from '../Object/CtxSetting';
import { Path } from '../Object/Path';
import { Color } from '../Utils/Color';
import { trailDots } from '../debug';
import { BaseBrush } from './BaseBrush';

export class Brush extends BaseBrush {
    lineCap: CanvasLineCap = 'round';
    color: Color = 'Red';
    globalCompositeOperation: GlobalCompositeOperation = 'source-over';
    path?: Path;

    constructor(brush: Partial<Brush> = {}) {
        super();
        Object.assign(this, brush);
    }

    mouseDown(canvas: Canvas<this>) {
        this.path = new Path({
            ctxSetting: new CtxSetting({
                strokeWidth: canvas.cursor.diameter,
                strokeColor: canvas.cursor.color,
                lineCap: canvas.cursor.lineCap,
                globalCompositeOperation: canvas.cursor.globalCompositeOperation,
            })
        });

        canvas.startRenderingSingle(this.path);
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

    //simplify path prototype not used 
    mouseUp(canvas: Canvas<this>, _: MouseEvent): void {
        if (!this.path) return;

        console.log(this.path);
        canvas.addCanvasObject(this.path);
        canvas.stopRenderingSingle();

        this.path = undefined;
    }
}

