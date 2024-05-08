import { Point } from '../GeoSpace/Point';

export class BoundingBox {
    tl: Point;
    tr: Point;
    bl: Point;
    br: Point;

    constructor(tl: Point, tr: Point, bl: Point, br: Point) {
        this.tl = tl.copy();
        this.tr = tr.copy();
        this.bl = bl.copy();
        this.br = br.copy();
    }

    tranform(transformationMat: DOMMatrix) {
        this.tl.transform(transformationMat);
        this.tr.transform(transformationMat);
        this.bl.transform(transformationMat);
        this.br.transform(transformationMat);

        return this;
    }

    addPadding(x: number) {
        this.tl.x -= x;
        this.tl.y -= x;

        this.tr.x += x;
        this.tr.y -= x;

        this.bl.x -= x;
        this.bl.y += x;

        this.br.x += x;
        this.br.y += x;
    }

    copy(): BoundingBox {
        return new BoundingBox(this.tl.copy(), this.tr.copy(), this.bl.copy(), this.br.copy());
    }

    containPoint(a: Point) {
        if (a.x < this.tl.x)
            this.tl.x = a.x;

        if (a.x < this.bl.x)
            this.bl.x = a.x;

        if (a.x > this.br.x)
            this.br.x = a.x;

        if (a.x > this.tr.x)
            this.tr.x = a.x;

        if (a.y < this.tl.y)
            this.tl.y = a.y;

        if (a.y < this.tr.y)
            this.tr.y = a.y;

        if (a.y > this.br.y)
            this.br.y = a.y;

        if (a.y > this.bl.y)
            this.bl.y = a.y;

    }

    getValues() {
        return [this.tl, this.tr, this.br, this.bl];
    }

    shareArea(bb: BoundingBox): boolean {
        const coord = bb.getValues();
        const thisCoord = this.getValues();
        for (let i = 0; i < coord.length; i++) {
            const point = coord[i];
            const point1 = coord[(i + 1) % coord.length];
            const thisPoint = thisCoord[i];
            if (this.lineIntersectBoundingBox(point, point1) || this.pointInside(point) || bb.pointInside(thisPoint)) return true;
        }

        return false;
    }

    lineIntersectBoundingBox(point: Point, point1: Point): boolean {
        const coord = this.getValues();

        for (let i = 0; i < coord.length; i++) {
            const q1 = coord[i];
            const q2 = coord[(i + 1) % coord.length];

            if (this.lineIntersectLine(point, point1, q1, q2)) return true;
        }
        return false;
    }

    lineIntersectLine(p1: Point, p2: Point, q1: Point, q2: Point): boolean {
        const t = Math.abs(((p1.x - q1.x) * (q1.y - q2.y) - (p1.y - q1.y) * (q1.x - q2.x)) /
            ((p1.x - p2.x) * (q1.y - q2.y) - (p1.y - p2.y) * (q1.x - q2.x)));
        const u = Math.abs(((p1.x - p2.x) * (p1.y - q1.y) - (p1.y - p2.y) * (p1.x - q1.x)) /
            ((p1.x - p2.x) * (q1.y - q2.y) - (p1.y - p2.y) * (q1.x - q2.y)));

        return 0 <= t && t <= 1 && 0 <= u && u <= 1;
    }

    pointInside(p: Point) {
        return this.tl.x <= p.x &&
            this.br.x >= p.x &&
            this.tl.y <= p.y &&
            this.br.y >= p.y;
    }

    normalize() {
        const canvasTL = new Point(
            Math.min(this.tl.x, this.tr.x, this.bl.x, this.br.x),
            Math.min(this.tl.y, this.tr.y, this.bl.y, this.br.y)
        );

        const canvasBR = new Point(
            Math.max(this.tl.x, this.tr.x, this.bl.x, this.br.x),
            Math.max(this.tl.y, this.tr.y, this.bl.y, this.br.y)
        );

        this.tl = canvasTL;
        this.tr = canvasTL.copy().translateX(canvasBR.x - canvasTL.x);

        this.br = canvasBR;
        this.bl = canvasBR.copy().translateX(-canvasBR.x + canvasTL.x);
    }
}
