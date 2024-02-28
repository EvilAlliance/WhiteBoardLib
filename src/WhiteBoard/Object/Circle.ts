import { Point } from '../GeoSpace/Point';
import { Vector } from '../GeoSpace/Vector';
import { BaseObject } from './BaseObject';
import { BoundingBox } from './BoundingBox';
import { CtxSetting } from './CtxSetting';
import { CtxTransformation } from './CtxTransformation';

export class Circle extends BaseObject {
    radius: number;
    center: Point;
    ctxSetting: CtxSetting = new CtxSetting();
    ctxTransformation: CtxTransformation = new CtxTransformation();

    constructor(obj: Partial<Circle>) {
        super();
        Object.assign(this, obj);
    }

    /*
     * Point wont be edited;
     * */
    pointInside(point: Point): boolean {
        const boundingBox = this.getBoundingBox();
        const transMat = this.ctxTransformation.GetTransformationMatrix(boundingBox);
        transMat.invertSelf();

        const newPoint = point.copy();
        newPoint.transform(transMat);

        const distanceVec = new Vector(this.center, newPoint);

        const inside = distanceVec.mod <= this.radius;
        if (this.ctxSetting.fill)
            return inside;

        if (this.ctxSetting.strokeWidth > 0 && inside) {
            return !(distanceVec.mod < this.radius - this.ctxSetting.strokeWidth);
        }

        return false;
    }

    pointInRange(mousePoint: Point, range: number): Point | null {
        if (this.pointInside(mousePoint)) return mousePoint.copy();

        const boundingBox = this.getBoundingBox();
        const transMat = this.ctxTransformation.GetTransformationMatrix(boundingBox);
        transMat.invertSelf();

        const p = new DOMPointReadOnly(mousePoint.x, mousePoint.y).matrixTransform(transMat);
        const newPoint = new Point(p.x, p.y);


        const distanceVec = new Vector(newPoint, this.center);

        if (this.ctxSetting.fill) {
            const inRange = distanceVec.mod < this.radius + range;
            if (!inRange) return null;
            distanceVec.mod -= this.radius + 1;

            newPoint.translate(distanceVec);

            transMat.invertSelf();
            newPoint.transform(transMat);

            return newPoint;
        }

        if (this.ctxSetting.strokeWidth > 0) {
            const inOutSideRange = distanceVec.mod <= this.radius + range;
            const inInSideRange = !(distanceVec.mod <= this.radius - this.ctxSetting.strokeWidth - range);
            if (!(inOutSideRange && inInSideRange)) return null;
            distanceVec.mod -= this.radius + 1;
            if (distanceVec.mod > 0) {
                newPoint.translate(distanceVec);

                transMat.invertSelf();
                newPoint.transform(transMat);
                return newPoint;
            }

            if (distanceVec.mod < 0) {
                distanceVec.mod -= this.radius + this.ctxSetting.strokeWidth;

                newPoint.translate(distanceVec);

                transMat.invertSelf();
                newPoint.transform(transMat);
                return newPoint;
            }
        }

        return null;
    }

    getBoundingBox(): BoundingBox {
        const tl = new Point(this.center.x - this.radius, this.center.y - this.radius);
        const tr = new Point(this.center.x + this.radius, this.center.y - this.radius);
        const bl = new Point(this.center.x - this.radius, this.center.y + this.radius);
        const br = new Point(this.center.x + this.radius, this.center.y + this.radius);

        return new BoundingBox(tl, tr, bl, br);
    }

    render(ctx: CanvasRenderingContext2D): void {
        ctx.save();

        this.ctxSetting.setSettingSetContextOption(ctx);
        this.ctxTransformation.setContextTransformation(ctx, this.getBoundingBox());

        let { radius } = this;

        radius -= this.ctxSetting.strokeWidth / 2;

        ctx.beginPath();

        ctx.arc(this.center.x, this.center.y, radius, 0, 2 * Math.PI);

        if (this.ctxSetting.fill) ctx.fill();
        if (this.ctxSetting.strokeWidth > 0) ctx.stroke();

        ctx.restore();

        for (const eraser of this.erased) {
            eraser.render(ctx);
        }
    }
}
