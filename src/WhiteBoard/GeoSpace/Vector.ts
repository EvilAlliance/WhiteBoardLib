import { ORIGIN, Point } from './Point';

export class Vector {
    x: number;
    y: number;


    constructor(initial: Point, final: Point) {
        this.x = final.x - initial.x;
        this.y = final.y - initial.y;
    }

    mod(): number {
        return Math.hypot(this.x, this.y);
    }

    phase(): number {
        let x = 0;

        const x0 = this.x == 0;

        if (Math.sign(this.x) === -1 || x0) {
            if (Math.sign(this.y) === -1) {
                x = -Math.PI;
            } else {
                x = Math.PI;
            }
        }
        if (x0) return x;

        return Math.atan(this.y / this.x) + x;
    }

    rotate(x: number) {
        const mod = this.mod();
        const ang = this.phase() + x;
        this.x = mod * Math.cos(ang);
        this.y = mod * Math.sin(ang);

        return this
    }

    translatePoint(p: Point): this {
        p.x += this.x;
        p.y += this.y;

        return this;
    }

    copy(): Vector {
        return new Vector(ORIGIN, new Point(this.x, this.y));
    }

    plus(v: Vector) {
        this.x += v.x;
        this.y += v.y;

        return this;
    }
}

export const NORMAL = {
    x: new Vector(ORIGIN, new Point(1, 0)),
    y: new Vector(ORIGIN, new Point(0, 1)),
    xI: new Vector(ORIGIN, new Point(-1, 0)),
    yI: new Vector(ORIGIN, new Point(0, -1)),
};
