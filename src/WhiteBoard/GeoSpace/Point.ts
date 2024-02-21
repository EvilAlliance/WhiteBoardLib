import { Vector } from './Vector';

export class Point {
    public x: number;
    public y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    translate(v: Vector): void {
        this.x += v.x;
        this.y += v.y;
    }

    transform(transMat: DOMMatrix): void {
        const p = new DOMPointReadOnly(this.x, this.y).matrixTransform(transMat);
        this.x = p.x;
        this.y = p.y;
    }
}
