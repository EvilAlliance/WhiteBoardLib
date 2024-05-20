import { Canvas } from "../Canvas";
import { Point } from "../GeoSpace/Point";
import { Vector } from "../GeoSpace/Vector";
import { CtxSetting } from "../Object/CtxSetting";
import { Path } from "../Object/Path";
import { BaseBrush } from "./BaseBrush";

export class UndoEraser extends BaseBrush {
    lineCap: CanvasLineCap = 'round';
    undoErasing: boolean = false;
    path?: Path;

    objectCanvas?: HTMLCanvasElement;
    objectCtx?: CanvasRenderingContext2D;

    canvas?: HTMLCanvasElement;
    ctx?: CanvasRenderingContext2D;


    constructor(obj: Partial<UndoEraser>) {
        super();
        Object.assign(this, obj);
    }

    mouseDown(canvas: Canvas<this>, _: MouseEvent): void {
        this.objectCanvas = document.createElement('canvas');
        this.objectCanvas.width = canvas.width;
        this.objectCanvas.height = canvas.height;

        this.objectCtx = this.objectCanvas.getContext('2d') as CanvasRenderingContext2D;

        for (const object of canvas.Objects) {
            this.objectCtx.save();
            object.ctxSetting.setSettingSetContextOption(this.objectCtx);
            object.ctxTransformation.setContextTransformation(this.objectCtx, object.getBoundingBox());
            object._drawObject(this.objectCtx);
            this.objectCtx.restore();
        }

        this.canvas = document.createElement('canvas');
        this.canvas.width = canvas.width;
        this.canvas.height = canvas.height;

        this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;

        this.undoErasing = true;
        this.path = new Path({
            ctxSetting: new CtxSetting({
                strokeWidth: this.diameter,
                strokeColor: 'AquaGrey',
                lineCap: this.lineCap,
                globalCompositeOperation: 'destination-in',
            })
        });
    }

    mouseMove(canvas: Canvas<this>, e: MouseEvent): void {
        if (!this.path || !this.ctx || !this.canvas || !this.objectCtx || !this.objectCanvas) return;
        const p = new Point(e.offsetX, e.offsetY);

        if (this.path.Path.length == 0) {
            this.path.push(p);
        } else {
            const v = new Vector(p, this.path.Path[this.path.Path.length - 1]);
            if (v.mod() >= 3) {
                this.path.push(p);
            }
        }

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.objectCanvas, 0, 0);
        this.path.render(this.ctx);
        canvas.ctx.drawImage(this.canvas, 0, 0);
    }

    mouseUp(canvas: Canvas<this>, _: MouseEvent): void {
        if (!this.path) return;

        this.path.ctxSetting.globalCompositeOperation = 'destination-out';

        this.undoErasing = false;

        for (const object of canvas.Objects) {
            if (object.shouldRender && object.objectShareArea(this.path)) {
                for (const erase of object.erased) {
                    if (erase.objectShareArea(this.path)) {
                        erase.erased.push(this.path)
                    }
                }
            }
        }

        canvas.stopRenderingSingle();

        this.path = undefined;
        this.objectCanvas = undefined;
        this.objectCtx = undefined;
    }
}
