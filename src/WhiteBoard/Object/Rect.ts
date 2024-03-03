import { BaseObject } from './BaseObject';
import { ORIGIN, Point } from '../GeoSpace/Point';
import { BoundingBox } from './BoundingBox';
import { CtxSetting } from './CtxSetting';
import { CtxTransformation } from './CtxTransformation';
import { Vector } from '../GeoSpace/Vector';
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

        const insideOuterBoudingBox = boundingBox.tl.x <= p.x &&
            boundingBox.br.x >= p.x &&
            boundingBox.tl.y <= p.y &&
            boundingBox.br.y >= p.y;

        if (this.ctxSetting.fill)
            return insideOuterBoudingBox;

        if (this.ctxSetting.strokeWidth > 0 && insideOuterBoudingBox) {
            boundingBox.addPadding(-this.ctxSetting.strokeWidth);

            const insideInnerBoundingBox = boundingBox.tl.x < p.x &&
                boundingBox.br.x > p.x &&
                boundingBox.tl.y < p.y &&
                boundingBox.br.y > p.y;

            return !insideInnerBoundingBox;
        }

        return false;
    }

    pointDistance(point: Point): number {
        if (this.pointInside(point)) return 0;

        const boundingBox = this.getBoundingBox();
        const transMat = this.ctxTransformation.GetTransformationMatrix(boundingBox);
        transMat.invertSelf();

        const p = new DOMPointReadOnly(point.x, point.y).matrixTransform(transMat);

        const distanceX = this.left - p.x;
        const distanceY = this.top - p.y;

        const xGreater0 = distanceX > 0;
        const yGreater0 = distanceY > 0;

        const correctionDistanceX = distanceX + this.width;
        const correctionDistanceY = distanceY + this.width;

        if (correctionDistanceX < 0 && yGreater0) return new Vector(ORIGIN, new Point(correctionDistanceX, distanceY)).mod;
        if (xGreater0 && correctionDistanceY < 0) return new Vector(ORIGIN, new Point(distanceX, correctionDistanceY)).mod;
        if (!xGreater0 && yGreater0) return new Vector(ORIGIN, new Point(0, distanceY)).mod;
        if (xGreater0 && !yGreater0) return new Vector(ORIGIN, new Point(distanceX, 0)).mod;
        if (xGreater0 && yGreater0) return new Vector(ORIGIN, new Point(distanceX, distanceY)).mod;

        const distanceXDown = this.width + distanceX;
        const distanceYDown = this.height + distanceY;

        const xLesserDown0 = distanceXDown < 0;
        const yLesserDown0 = distanceYDown < 0;

        if (!xLesserDown0 && yLesserDown0) return new Vector(ORIGIN, new Point(0, distanceYDown)).mod;
        if (xLesserDown0 && !yLesserDown0) return new Vector(ORIGIN, new Point(distanceXDown, 0)).mod;
        if (xLesserDown0 && yLesserDown0) return new Vector(ORIGIN, new Point(distanceXDown, distanceYDown)).mod;

        if (this.ctxSetting.fill) return 0;

        if (this.ctxSetting.strokeWidth <= 0) return 0;

        const distanceXStroke = distanceX + this.ctxSetting.strokeWidth;
        const distanceYStroke = distanceY + this.ctxSetting.strokeWidth;

        const distanceXStrokeDown = distanceXDown - this.ctxSetting.strokeWidth;
        const distanceYStrokeDown = distanceYDown - this.ctxSetting.strokeWidth;

        const xLess = Math.abs(distanceXStrokeDown) < Math.abs(distanceXStroke) ? distanceXStrokeDown : distanceXStroke;
        const yLess = Math.abs(distanceYStrokeDown) < Math.abs(distanceYStroke) ? distanceYStrokeDown : distanceYStroke;

        const xLessery = Math.abs(xLess) < Math.abs(yLess);

        return new Vector(ORIGIN, new Point(xLessery ? xLess : 0, xLessery ? 0 : yLess)).mod;
    }
}
