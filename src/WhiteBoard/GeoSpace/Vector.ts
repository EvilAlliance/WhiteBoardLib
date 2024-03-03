import { ORIGIN, Point } from "./Point";

export class Vector {
    public mod: number;
    public phase: number;

    constructor(initial: Point, final: Point) {
        const x = final.x - initial.x;
        const y = final.y - initial.y;

        this.mod = Math.hypot(x, y);

        let correction = 0;

        if (Math.sign(x) === -1) {
            if (Math.sign(x) === -1) {
                correction = -Math.PI;
            } else {
                correction = Math.PI;
            }
        }

        this.phase = Math.atan(y / x) + correction;
    }

    getX(): number {
        return this.mod * Math.cos(this.phase);
    }

    getY(): number {
        return this.mod * Math.sin(this.phase);
    }

    translatePoint(p: Point): this {
        const x = this.getX();
        const y = this.getY();

        p.x += x;
        p.y += y;

        return this;
    }

    copy(): Vector {
        return new Vector(ORIGIN, new Point(this.getX(), this.getY()));
    }
}

export const NORMAL = {
    x: new Vector(ORIGIN, new Point(1, 0)),
    y: new Vector(ORIGIN, new Point(0, 1)),
    xI: new Vector(ORIGIN, new Point(-1, 0)),
    yI: new Vector(ORIGIN, new Point(0, -1)),
}
