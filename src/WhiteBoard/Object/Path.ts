import { Point } from '../GeoSpace/Point';
import { Vector } from '../GeoSpace/Vector';
import { BaseObject } from './BaseObject';
import { BoundingBox } from './BoundingBox';

export class Path extends BaseObject {
    Path: Point[] = [];

    constructor(obj: Partial<Path> = {}) {
        super();
        Object.assign(this, obj);
    }

    _drawObject(ctx: CanvasRenderingContext2D): void {
        if (this.Path.length == 0) return;

        if (this.Path.length == 1) {
            const point = this.Path[0];
            ctx.fillStyle = ctx.strokeStyle;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(point.x, point.y, this.ctxSetting.strokeWidth / 2, 0, 2 * Math.PI);
            ctx.fill();
            return;
        }

        ctx.beginPath();
        let p1 = this.Path[0];
        let p2 = this.Path[1];
        ctx.moveTo(p1.x, p1.y);
        for (let i = 1; i < this.Path.length - 1; i++) {
            const vec = new Vector(p1, p2);
            vec.mod *= 0.5;

            const pMid = p1.copy();
            pMid.translate(vec);

            ctx.quadraticCurveTo(p1.x, p1.y, pMid.x, pMid.y);
            p1 = this.Path[i];
            p2 = this.Path[i + 1];
        }
        ctx.lineTo(p2.x, p2.y);

        ctx.stroke();
    }

    pointDistance(_: Point): number {
        console.log('TODO pointDistance Path');
        return 0;
    }

    getBoundingBox(): BoundingBox {
        const tl = new Point(this.Path[0].x, this.Path[0].y);

        if (this.Path.length == 1) {
            return new BoundingBox(
                new Point(tl.x - this.ctxSetting.strokeWidth / 2, tl.y - this.ctxSetting.strokeWidth / 2),
                new Point(tl.x + this.ctxSetting.strokeWidth / 2, tl.y - this.ctxSetting.strokeWidth / 2),
                new Point(tl.x - this.ctxSetting.strokeWidth / 2, tl.y + this.ctxSetting.strokeWidth / 2),
                new Point(tl.x + this.ctxSetting.strokeWidth / 2, tl.y + this.ctxSetting.strokeWidth / 2)
            );
        }
        const br = new Point(this.Path[1].x, this.Path[1].y);

        if (tl.y > br.y) {
            const temp = tl.y;
            tl.y = br.y;
            br.y = temp;
        }

        if (tl.x > br.x) {
            const temp = tl.x;
            tl.x = br.x;
            br.x = temp;
        }

        for (let i = 0; i < this.Path.length; i++) {
            const p = this.Path[i];

            if (p.x < tl.x) {
                tl.x = p.x;
            } else if (p.x > br.x) {
                br.x = p.x;
            }

            if (p.y < tl.y) {
                tl.y = p.y;
            } else if (p.y > br.y) {
                br.y = p.y;
            }
        }

        const bl = new Point(tl.x, br.y);
        const tr = new Point(br.x, tl.y);

        tl.x -= this.ctxSetting.strokeWidth / 2;
        tl.y -= this.ctxSetting.strokeWidth / 2;
        tr.x += this.ctxSetting.strokeWidth / 2;
        tr.y -= this.ctxSetting.strokeWidth / 2;
        bl.x -= this.ctxSetting.strokeWidth / 2;
        bl.y += this.ctxSetting.strokeWidth / 2;
        br.x += this.ctxSetting.strokeWidth / 2;
        br.y += this.ctxSetting.strokeWidth / 2;

        return new BoundingBox(tl, tr, bl, br);
    }

    addPoint(p: Point) {
        this.dirty = true;
        this.Path.push(p);
    }

    copy(): Path {
        return new Path({
            ctxSetting: this.ctxSetting.copy(),
            ctxTransformation: this.ctxTransformation.copy(),
            Path: this.Path.slice(),
        });
    }
}
