import { Point } from '../GeoSpace/Point';
import { Vector } from '../GeoSpace/Vector';
import { BaseObject } from './BaseObject';
import { BoundingBox } from './BoundingBox';
import { CtxSetting } from './CtxSetting';
import { CtxTransformation } from './CtxTransformation';

export class Path extends BaseObject {
    Path: Point[] = [];
    ctxSetting: CtxSetting = new CtxSetting();
    ctxTransformation: CtxTransformation = new CtxTransformation();

    constructor(obj: Partial<Path> = {}) {
        super();
        Object.assign(this, obj);
    }

    render(ctx: CanvasRenderingContext2D): void {
        if (this.Path.length == 0) return;

        ctx.save();

        this.ctxSetting.setSettingSetContextOption(ctx);
        this.ctxTransformation.setContextTransformation(ctx, this.getBoundingBox());

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
            vec.x *= 0.5;
            vec.y *= 0.5;
            const pMid = {
                x: p1.x + vec.x,
                y: p1.y + vec.y,
            };
            ctx.quadraticCurveTo(p1.x, p1.y, pMid.x, pMid.y);
            p1 = this.Path[i];
            p2 = this.Path[i + 1];
        }
        ctx.lineTo(p2.x, p2.y);

        ctx.stroke();

        ctx.restore();

        for (const eraser of this.erased) {
            eraser.render(ctx);
        }
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

    pointInside(point: Point): boolean {
        return !!this.pointInRange(point, this.ctxSetting.strokeWidth / 2);
    }

    // ignores everithing exept the stroke;
    pointInRange(p: Point, range: number): Point | null {
        const boundingBox = this.getBoundingBox();
        const transMat = this.ctxTransformation.GetTransformationMatrix(boundingBox);
        transMat.invertSelf();

        const point = new DOMPointReadOnly(p.x, p.y).matrixTransform(transMat);
        const mousePoint = new Point(point.x, point.y);


        for (let i = 0; i < this.Path.length; i++) {
            const coord = this.Path[i];
            if (new Vector(coord, mousePoint).mod() < range + this.ctxSetting.strokeWidth) return coord;
            if (i < this.Path.length - 1) {
                const coord2 = this.Path[i + 1];
                if (this.mousePointInsideSquareOf2Points(coord, coord2, mousePoint)) {
                    return this.searchBetween2Points(coord, coord2, mousePoint, range);
                }
            }
        }
        return null;
    }

    mousePointInsideSquareOf2Points(p1: Point, p2: Point, mousePoint: Point) {
        const InsideYLimiter = (p1.y >= mousePoint.y && p2.y <= mousePoint.y) || (p2.y >= mousePoint.y && p1.y <= mousePoint.y);
        const InsideXLimiter = (p1.x >= mousePoint.x && p2.x <= mousePoint.x) || (p2.x >= mousePoint.x && p1.x <= mousePoint.x);
        return InsideYLimiter && InsideXLimiter;
    }

    searchBetween2Points(p1: Point, p2: Point, mousePoint: Point, range: number): Point | null {
        const vec = new Vector(p1, p2);
        vec.x *= 0.5;
        vec.y *= 0.5;

        const pMid = new Point(p1.x + vec.x, p1.y + vec.y);

        let low = 0;
        let high = 100;

        while (low < high) {
            const j = Math.ceil((low + high) / 2);
            const quadraticCurveP = this.quadraticCurvePoint(p1, p2, pMid, j / 100);
            const dist = new Vector(quadraticCurveP, mousePoint).mod();
            if (dist < range + this.ctxSetting.strokeWidth) return quadraticCurveP;
            const quadraticCurvePMore = this.quadraticCurvePoint(p1, p2, pMid, (j + 1) / 100);
            const quadraticCurvePLess = this.quadraticCurvePoint(p1, p2, pMid, (j - 1) / 100);
            const distM = new Vector(quadraticCurvePMore, mousePoint).mod();
            const distL = new Vector(quadraticCurvePLess, mousePoint).mod();
            if (distM < distL) {
                low = j + 1;
            } else {
                high = j - 1;
            }
        }
        return null;
    }

    quadraticCurvePoint(origin: Point, end: Point, control: Point, porsentage: number): Point {
        return new Point(
            this.quadraticCurve(origin.x, end.x, control.x, porsentage),
            this.quadraticCurve(origin.y, end.y, control.y, porsentage)
        );
    }

    quadraticCurve(origin: number, end: number, control: number, porsentage: number) {
        return Math.pow(1 - porsentage, 2) * origin + 2 * (1 - porsentage) * porsentage * control + Math.pow(porsentage, 2) * end;
    }
}
