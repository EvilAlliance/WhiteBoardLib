import { Point } from "../GeoSpace/Point";
import { Vector } from "../GeoSpace/Vector";
import { BaseObject } from "./BaseObject";
import { BoundingBox } from "./BoundingBox";
import { CtxSetting } from "./CtxSetting";

export class SelectionBox extends BaseObject {
    ctxSetting: CtxSetting = new CtxSetting({
        strokeWidth: 2,
        strokeColor: 'rgba(173, 216, 230, 0.8)',
    });
    object: BaseObject[];
    constructor(objs: BaseObject[]) {
        super();
        this.object = objs;
    }

    _getBoundingBox(): BoundingBox {
        const p = this.object[0].getTranformedBoundigBox().tl;
        const bb = new BoundingBox(p.copy(), p.copy(), p.copy(), p.copy());
        for (let i = 0; i < this.object.length; i++) {
            this.object[i].getTranformedBoundigBox().getValues().forEach((x: Point) => bb.containPoint(x));
        }

        bb.addPadding(this.ctxSetting.strokeWidth / 2);

        return bb;
    }

    copy(): SelectionBox {
        return new SelectionBox(this.object);
    }

    _drawObject(ctx: CanvasRenderingContext2D): void {
        for (const obj of this.object) {
            obj.render(ctx);
        }

        const bb = this.getTranformedBoundigBox();
        bb.addPadding(-this.ctxSetting.strokeWidth / 2);

        ctx.beginPath();

        ctx.moveTo(bb.tl.x, bb.tl.y);
        ctx.lineTo(bb.tr.x, bb.tr.y);
        ctx.lineTo(bb.br.x, bb.br.y);
        ctx.lineTo(bb.bl.x, bb.bl.y);
        ctx.lineTo(bb.tl.x, bb.tl.y);

        ctx.closePath();

        if (this.ctxSetting.fill) ctx.fill();
        if (this.ctxSetting.strokeWidth > 0) ctx.stroke();

        ctx.fillStyle = ctx.strokeStyle;

        const halfW = this.getWidth() / 2;

        ctx.beginPath();

        ctx.fillRect(bb.tl.x + halfW - 5, bb.tl.y + 20, 10, 10)

        ctx.closePath();
    }

    includes(obj: BaseObject): boolean {
        return this.object.includes(obj);
    }

    _translate(v: Vector): void {
        this.dirty = true;

        this.object.forEach(x => x.translate(v));
    }

    scale(x: number, y: number) {
        this.dirty = true;

        this.object.forEach(o => o.scale(x, y));
    }

    isDirty(): boolean {
        if (super.isDirty()) return true;

        return this.object.some(o => o.isDirty());
    }

    getWidth(): number {
        const bb = this.getTranformedBoundigBox();
        return bb.tr.x - bb.tl.x;
    }

    getHeigth(): number {
        const bb = this.getTranformedBoundigBox();
        return bb.bl.y - bb.tl.y;
    }

    insideRotate(p: Point): boolean {
        const bb = this.getTranformedBoundigBox();

        const halfW = this.getWidth();

        const rBB = new BoundingBox(
            new Point(bb.tl.x + halfW - 5, bb.tl.y + 20),
            new Point(bb.tl.x + halfW + 5, bb.tl.y + 20),
            new Point(bb.tl.x + halfW - 5, bb.tl.y + 30),
            new Point(bb.tl.x + halfW + 5, bb.tl.y + 30))

        return rBB.pointInside(p);
    }

    rotate(rad: number) {
        super.rotate(rad);
        this.object.forEach(x => x.rotate(rad));
    }
}

