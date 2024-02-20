import { Point } from "../GeoSpace/Point";
import { Vector } from "../GeoSpace/Vector";
import { BaseObject } from "./BaseObject";
import { BoundingBox } from "./BoundingBox";
import { CtxSetting } from "./CtxSetting";
import { CtxTransformation } from "./CtxTransformation";

export class Circle extends BaseObject {
    radius: number;
    center: Point;
    ctxSetting: CtxSetting = new CtxSetting();
    ctxTransformation: CtxTransformation = new CtxTransformation();

    constructor(obj: Partial<Circle>) {
        super();
        Object.assign(this, obj);
    }

    pointInside(point: Point): boolean {
        const boundingBox = this.getBoundingBox();
        const transMat = this.ctxTransformation.GetTransformationMatrix(boundingBox);
        transMat.invertSelf();

        const p = new DOMPointReadOnly(point.x, point.y).matrixTransform(transMat);
        const newPoint = new Point(p.x, p.y);

        const distanceVec = new Vector(this.center, newPoint);
        const distance = Math.abs(distanceVec.mod());

        const inside = distance <= this.radius;
        if (this.ctxSetting.fill)
            return inside;

        if (this.ctxSetting.strokeWidth > 0 && inside) {
            return !(distance <= this.radius - this.ctxSetting.strokeWidth);
        }

        return false;
    }

    pointInRange(mousePoint: Point, range: number): Point | null {
        if (this.pointInside(mousePoint)) return mousePoint;

        const boundingBox = this.getBoundingBox();
        const transMat = this.ctxTransformation.GetTransformationMatrix(boundingBox);
        transMat.invertSelf();

        const p = new DOMPointReadOnly(mousePoint.x, mousePoint.y).matrixTransform(transMat);
        const newPoint = new Point(p.x, p.y);


        const distanceVec = new Vector(newPoint, this.center);

        const distance = Math.abs(distanceVec.mod());

        if (this.ctxSetting.fill) {
            const inRange = distance <= this.radius + range;
            if (!inRange) return null;
            const distanceToMove = distance - this.radius + 1;
            const ang = distanceVec.phase();
            const vec = new Vector(new Point(0, 0), new Point(distanceToMove * Math.cos(ang), distanceToMove * Math.sin(ang)));

            newPoint.translate(vec);

            transMat.invertSelf();
            newPoint.transform(transMat);

            return newPoint;
        }

        if (this.ctxSetting.strokeWidth > 0) {
            const inOutSideRange = distance <= this.radius + range;
            const inInSideRange = !(distance <= this.radius - this.ctxSetting.strokeWidth - range);
            if (!(inOutSideRange && inInSideRange)) return null;
            const distanceToMoveOut = distance - this.radius + 1;
            if (distanceToMoveOut > 0) {
                const ang = distanceVec.phase();
                const vec = new Vector(new Point(0, 0), new Point(distanceToMoveOut * Math.cos(ang), distanceToMoveOut * Math.sin(ang)));

                newPoint.translate(vec);

                transMat.invertSelf();
                newPoint.transform(transMat);
                return newPoint;
            }

            if (distanceToMoveOut < 0) {
                const distanceToMoveIn = distance - this.radius + this.ctxSetting.strokeWidth;
                const ang = distanceVec.phase();
                const vec = new Vector(new Point(0, 0), new Point(distanceToMoveIn * Math.cos(ang), distanceToMoveIn * Math.sin(ang)));

                newPoint.translate(vec);

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
