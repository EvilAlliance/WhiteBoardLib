import { BaseObject } from './BaseObject';
import { Point } from '../GeoSpace/Point';
import { BoundingBox } from './BoundingBox';
import { CtxSetting } from './CtxSetting';
import { CtxTransformation } from './CtxTransformation';
//const kRect = 1 - 0.5522847498;

export class Rect extends BaseObject {
    public width: number = 0;
    public height: number = 0;
    public top: number = 0;
    public left: number = 0;
    ctxSetting: CtxSetting = new CtxSetting();
    ctxTransformation: CtxTransformation = new CtxTransformation();

    constructor(obj: Partial<Rect>) {
        super();
        Object.assign(this, obj);
    }

    render(ctx: CanvasRenderingContext2D): void {
        ctx.save();

        this.ctxSetting.setSettingSetContextOption(ctx);
        this.ctxTransformation.setContextTransformation(ctx, this.getBoundingBox());

        let { top, left, height, width } = this;

        top += this.ctxSetting.strokeWidth / 2;
        left += this.ctxSetting.strokeWidth / 2;

        width -= this.ctxSetting.strokeWidth;
        height -= this.ctxSetting.strokeWidth;

        ctx.beginPath();

        ctx.moveTo(left, top);

        ctx.lineTo(left + width, top);
        ctx.lineTo(left + width, top + height);
        ctx.lineTo(left, top + height);
        ctx.lineTo(left, top);

        ctx.closePath();

        if (this.ctxSetting.fill) ctx.fill();
        if (this.ctxSetting.strokeWidth > 0) ctx.stroke();

        ctx.restore();

        for (const eraser of this.erased) {
            eraser.render(ctx);
        }
    }

    getBoundingBox(): BoundingBox {
        return new BoundingBox(
            new Point(this.left, this.top),
            new Point(this.left + this.width, this.top),
            new Point(this.left, this.top + this.height),
            new Point(this.left + this.width, this.top + this.height)
        );
    }

    pointInside(point: Point): boolean {
        const boundingBox = this.getBoundingBox();
        const transMat = this.ctxTransformation.GetTransformationMatrix(boundingBox);
        transMat.invertSelf();

        const p = new DOMPointReadOnly(point.x, point.y).matrixTransform(transMat);

        if (this.ctxSetting.fillColor)
        if (this.ctxSetting.fill)
            return boundingBox.tl.x <= p.x &&
                boundingBox.bl.x <= p.x &&
                boundingBox.tr.x >= p.x &&
                boundingBox.br.x >= p.x &&
                boundingBox.tl.y <= p.y &&
                boundingBox.tr.y <= p.y &&
                boundingBox.bl.y >= p.y &&
                boundingBox.br.y >= p.y;
        if (this.ctxSetting.strokeWidth > 0)
            console.log("TODO: Point in only stroke");
    }
}
