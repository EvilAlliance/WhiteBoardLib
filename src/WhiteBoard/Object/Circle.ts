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

    _getBoundingBox(): BoundingBox {
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

    translate(v: Vector): void {
        this.dirty = true;
        this.center.translate(v);
    }
}
