import { BaseObject } from './BaseObject';
import { Point } from '../GeoSpace/Point';
import { BoundingBox } from './BoundingBox';
//const kRect = 1 - 0.5522847498;

export class Rect extends BaseObject {
    public width: number = 0;
    public height: number = 0;
    public top: number = 0;
    public left: number = 0;
    constructor(obj: Partial<Rect>) {
        super();
        Object.assign(this, obj);
    }

    _drawObject(ctx: CanvasRenderingContext2D): void {
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

        const p = point.copy().transform(transMat);

        const boundingBoxVal = boundingBox.getValues();

        let min = Number.MAX_SAFE_INTEGER;

        for (let i = 0; i < boundingBoxVal.length; i++) {
            min = Math.min(min, this.distanceBetweenSegmentToPoint(boundingBoxVal[i], boundingBoxVal[(i + 1) % boundingBoxVal.length], p));
        }

        if (this.ctxSetting.fill) return min;

        boundingBox.addPadding(-this.ctxSetting.strokeWidth);
        for (let i = 0; i < boundingBoxVal.length; i++) {
            min = Math.min(min, this.distanceBetweenSegmentToPoint(boundingBoxVal[i], boundingBoxVal[(i + 1) % boundingBoxVal.length], p));
        }

        return min;
    }
}
