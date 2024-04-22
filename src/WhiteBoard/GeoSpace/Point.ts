import { Vector } from './Vector';

export class Point {
    public x: number;
    public y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    translateX(x: number): Point {
        this.x += x;
        return this;
    }

    translateY(y: number): Point {
        this.y += y;
        return this;
    }

    translateXY(x: number, y: number): Point {
        this.x += x;
        this.y += y;
        return this;
    }

    translate(v: Vector): Point {
        this.x += v.x;
        this.y += v.y;

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
