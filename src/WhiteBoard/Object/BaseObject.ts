import { Point } from '../GeoSpace/Point';
import { Vector } from '../GeoSpace/Vector';
import { Observable } from '../Observable';
import { BoundingBox } from './BoundingBox';
import { CtxSetting } from './CtxSetting';
import { CtxTransformation } from './CtxTransformation';
import { Flood } from './Flood';
import { Path } from './Path';

export type BaseObjectEvent = {
    'render:Before': null;
    'render:After': null;
}

export abstract class BaseObject extends Observable<BaseObjectEvent> {
    shouldRender = true;
    erased: (Path | Flood)[] = [];
    cacheCanvas?: HTMLCanvasElement;
    cacheContext?: CanvasRenderingContext2D;
    cacheTranselateX: number = 0;
    cacheTranselateY: number = 0;
    cacheBoundingBox?: BoundingBox;
    dirty: boolean = true;
    ctxSetting: CtxSetting = new CtxSetting();
    ctxTransformation: CtxTransformation = new CtxTransformation();
    abstract _drawObject(ctx: CanvasRenderingContext2D): void;
    abstract _getBoundingBox(): BoundingBox;
    abstract _translate(v: Vector): void;
    abstract copy(): BaseObject;

    getBoundingBox(): BoundingBox {
        if (this.isDirty() || !this.cacheBoundingBox) {
            this.cacheBoundingBox = this._getBoundingBox();
        }
        return this.cacheBoundingBox.copy();
    }

    objectShareArea(o: BaseObject): boolean {
        return this.getTranformedBoundigBox().shareArea(o.getTranformedBoundigBox());
    }

    getCanvas() {
        const { tl, tr, bl, br } = this.getBoundingBox();

        const canvas = document.createElement('canvas');

        const ctx = canvas.getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D;

        const canvasTL = new Point(
            Math.min(tl.x, tr.x, bl.x, br.x),
            Math.min(tl.y, tr.y, bl.y, br.y)
        );

        const canvasBR = new Point(
            Math.max(tl.x, tr.x, bl.x, br.x),
            Math.max(tl.y, tr.y, bl.y, br.y)
        );

        canvas.width = canvasBR.x - canvasTL.x;
        canvas.height = canvasBR.y - canvasTL.y;

        ctx.save();
        ctx.translate(-canvasTL.x, -canvasTL.y);

        this.render(ctx);

        ctx.restore();

        return canvas;
    }

    render(ctx: CanvasRenderingContext2D) {
        if (!this.cacheCanvas || this.isDirty()) this.cacheCanvas = this.createCacheCanvas();

        ctx.save();

        ctx.globalCompositeOperation = this.ctxSetting.globalCompositeOperation;

        ctx.drawImage(this.cacheCanvas, this.cacheTranselateX, this.cacheTranselateY);

        ctx.restore();
    }

    createCacheCanvas() {
        const { tl, tr, bl, br } = this.getTranformedBoundigBox();

        this.dirty = false;
        this.ctxTransformation.dirty = false;
        this.ctxSetting.dirty = false;


        const canvasTL = new Point(
            Math.min(tl.x, tr.x, bl.x, br.x),
            Math.min(tl.y, tr.y, bl.y, br.y)
        );

        const canvasBR = new Point(
            Math.max(tl.x, tr.x, bl.x, br.x),
            Math.max(tl.y, tr.y, bl.y, br.y)
        );

        this.cacheTranselateX = canvasTL.x;
        this.cacheTranselateY = canvasTL.y;

        this.cacheCanvas = document.createElement('canvas');

        this.cacheCanvas.width = Math.max(canvasBR.x - canvasTL.x, 1);
        this.cacheCanvas.height = Math.max(canvasBR.y - canvasTL.y, 1);

        this.cacheContext = this.cacheCanvas.getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D;
        this.cacheContext.save();

        this.cacheContext.translate(-canvasTL.x, -canvasTL.y);

        this.drawObject(this.cacheContext);
        this.cacheContext.restore();

        return this.cacheCanvas;
    }

    drawObject(ctx: CanvasRenderingContext2D) {
        ctx.save();

        this.ctxSetting.setSettingSetContextOption(ctx);
        this.ctxTransformation.setContextTransformation(ctx, this.getBoundingBox());

        if (this.ctxSetting.globalCompositeOperation === 'destination-out' || this.ctxSetting.globalCompositeOperation === 'destination-in') ctx.globalCompositeOperation = 'source-over';

        this._drawObject(ctx);

        ctx.restore();

        for (const eraser of this.erased) {
            eraser.render(ctx);
        }
    }

    getTranformedBoundigBox(): BoundingBox {
        const bb = this.getBoundingBox();
        return bb.tranform(this.ctxTransformation.getTransformationMatrix(bb));
    }

    set<T extends keyof this>(key: Partial<this> | T, value?: this[T] | undefined): this {
        this.dirty = true;
        return super.set(key, value);
    }

    pointInside(p: Point) {
        if (!this.getTranformedBoundigBox().pointInside(p)) return false;

        if (this.isDirty()) this.createCacheCanvas();

        const f = p.copy().floor().translateX(-this.cacheTranselateX).translateY(-this.cacheTranselateY);

        return (this.cacheContext as CanvasRenderingContext2D).getImageData(f.x, f.y, 1, 1).data.some(x => x != 0);
    }

    isDirty(): boolean { return this.ctxSetting.dirty || this.ctxTransformation.dirty || this.dirty || this.erased.some((x) => x.isDirty()) }

    scale(x: number, y: number) {
        const bb = this.getTranformedBoundigBox();
        this.erased.forEach(o => {
            const bb1 = o.getTranformedBoundigBox();

            o.scale(x, y)

            const bb2 = o.getTranformedBoundigBox();

            const v1 = new Vector(bb.tl, bb1.tl);
            const v2 = new Vector(bb.tl, bb2.tl);

            v1.x *= x;
            v1.y *= y;

            v2.x *= -1;
            v2.y *= -1;

            v1.plus(v2);

            o.translate(v1);
        });
        this.ctxTransformation.scale(x, y);
    }

    translate(v: Vector) {
        this.erased.forEach(x => x.translate(v));
        this._translate(v);
    }
}
