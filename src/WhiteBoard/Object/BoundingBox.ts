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
        const tl = new DOMPointReadOnly(this.tl.x, this.tl.y).matrixTransform(transformationMat);
        const tr = new DOMPointReadOnly(this.tr.x, this.tr.y).matrixTransform(transformationMat);
        const bl = new DOMPointReadOnly(this.bl.x, this.bl.y).matrixTransform(transformationMat);
        const br = new DOMPointReadOnly(this.br.x, this.br.y).matrixTransform(transformationMat);

        this.tl.x = tl.x;
        this.tl.y = tl.y;
        this.tr.x = tr.x;
        this.tr.y = tr.y;
        this.bl.x = bl.x;
        this.bl.y = bl.y;
        this.br.x = br.x;
        this.br.y = br.y;
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
}
