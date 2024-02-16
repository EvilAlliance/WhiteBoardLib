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
    ctxTranformation: CtxTransformation = new CtxTransformation();

    constructor(obj: Partial<Rect>) {
        super();
        Object.assign(this, obj);
    }

    render(ctx: CanvasRenderingContext2D): void {
        this.ctxSetting.setSettingSetContextOption(ctx);
        this.ctxTranformation.setContextTransformation(ctx, this.getBoundingBox());

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

        if (this.ctxSetting.fillColor) ctx.fill();
        if (this.ctxSetting.strokeWidth > 0) ctx.stroke();
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
        const transMat = this.ctxTranformation.GetTransformationMatrix(boundingBox);
        transMat.invertSelf();

        const pointC = new Point(point.x, point.y);

        if (this.ctxSetting.fillColor)
            return boundingBox.tl.x <= pointC.x &&
                boundingBox.bl.x <= pointC.x &&
                boundingBox.tr.x >= pointC.x &&
                boundingBox.br.x >= pointC.x &&
                boundingBox.tl.y <= pointC.y &&
                boundingBox.tr.y <= pointC.y &&
                boundingBox.bl.y >= pointC.y &&
                boundingBox.br.y >= pointC.y;
        if (this.ctxSetting.strokeWidth > 0)
            console.log("TODO: Point in only stroke");
    }
}
