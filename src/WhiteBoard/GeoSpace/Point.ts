import { Vector } from './Vector';

export class Point {
    public x: number;
    public y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    translate(v: Vector): Point {
        this.x += v.getX();
        this.y += v.getY();

        return this;
    }

    transform(transMat: DOMMatrix): Point {
        const p = new DOMPointReadOnly(this.x, this.y).matrixTransform(transMat);
        this.x = p.x;
        this.y = p.y;

        return this;
    }

    copy(): Point {
        return new Point(this.x, this.y);
    }
}

export const ORIGIN = new Point(0, 0);
