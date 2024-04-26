import CommonMethod from '../CommonMethod';
import { Point } from '../GeoSpace/Point';
import { Vector } from '../GeoSpace/Vector';
import { BoundingBox } from './BoundingBox';
import { CtxSetting } from './CtxSetting';
import { CtxTransformation } from './CtxTransformation';
import { Flood } from './Flood';
import { Path } from './Path';

export abstract class BaseObject extends CommonMethod {
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
    abstract copy(): BaseObject;

    getBoundingBox(): BoundingBox {
        if (this.isDirty() || !this.cacheBoundingBox) {
            this.cacheBoundingBox = this._getBoundingBox();
        }
        return this.cacheBoundingBox;
    }

    distanceBetweenSegmentToPoint(s1: Point, s2: Point, p: Point): number {
        const dist2 = Math.pow(s1.x - s2.x, 2) + Math.pow(s1.y - s2.y, 2);
        if (dist2 == 0) return Math.hypot(s2.x - p.x, s2.y - p.y);

        let t = ((p.x - s1.x) * (s2.x - s1.x) + (p.y - s1.y) * (s2.y - s1.y)) / dist2;
        t = Math.max(0, Math.min(1, t));

        const projection = new Point(s1.x + t * (s2.x - s1.x), s1.y + t * (s2.y - s1.y));

        return new Vector(projection, p).mod();
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

        this.cacheCanvas.width = canvasBR.x - canvasTL.x;
        this.cacheCanvas.height = canvasBR.y - canvasTL.y;

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

        if (this.ctxSetting.globalCompositeOperation === 'destination-out') ctx.globalCompositeOperation = 'source-over';

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
        return this.getTranformedBoundigBox().pointInside(p);
    }

    isDirty(): boolean { return this.ctxSetting.dirty || this.ctxTransformation.dirty || this.dirty || this.erased.some((x) => x.isDirty()) }
}
