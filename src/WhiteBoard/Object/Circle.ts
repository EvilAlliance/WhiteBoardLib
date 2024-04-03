import { Point } from '../GeoSpace/Point';
import { Vector } from '../GeoSpace/Vector';
import { BaseObject } from './BaseObject';
import { BoundingBox } from './BoundingBox';

export class Circle extends BaseObject {
    radius: number;
    center: Point;

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

    pointDistance(p: Point): number {
        const boundingBox = this.getBoundingBox();
        const transMat = this.ctxTransformation.GetTransformationMatrix(boundingBox);
        transMat.invertSelf();

        const newPoint = p.copy();
        newPoint.transform(transMat);

        const vec = new Vector(this.center, newPoint);
        const distance = vec.mod - this.radius;

        if (distance > 0 || this.ctxSetting.fill) return Math.max(distance, 0);

        if (distance + this.ctxSetting.strokeWidth > this.radius + this.ctxSetting.strokeWidth) return 0;

        return 0;
    }

    getBoundingBox(): BoundingBox {
        const tl = new Point(this.center.x - this.radius, this.center.y - this.radius);
        const tr = new Point(this.center.x + this.radius, this.center.y - this.radius);
        const bl = new Point(this.center.x - this.radius, this.center.y + this.radius);
        const br = new Point(this.center.x + this.radius, this.center.y + this.radius);

        return new BoundingBox(tl, tr, bl, br);
    }

    _drawObject(ctx: CanvasRenderingContext2D): void {
        let { radius } = this;

        radius -= this.ctxSetting.strokeWidth / 2;

        ctx.beginPath();

        ctx.arc(this.center.x, this.center.y, radius, 0, 2 * Math.PI);

        if (this.ctxSetting.fill) ctx.fill();
        if (this.ctxSetting.strokeWidth > 0) ctx.stroke();
    }

    copy(): Circle {
        return new Circle({
            ctxTransformation: this.ctxTransformation.copy(),
            ctxSetting: this.ctxSetting.copy(),
            center: this.center.copy(),
            radius: this.radius,
        })
    }
}
