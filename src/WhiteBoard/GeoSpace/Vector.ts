import { Point } from './Point';

export class Vector {
    public x: number;
    public y: number;

    constructor(initial: Point, final: Point) {
        this.x = final.x - initial.x;
        this.y = final.y - initial.y;
    }
    mod(): number {
        return Math.hypot(this.x, this.y);
    }

    // Creo que en rad
    phase(): number {
        const x = Math.sign(this.x) == -1 ? Math.PI : 0;
        return Math.atan(this.y / this.x) + x;
    }

    translatePoint(p: Point): void {
        p.x += this.x;
        p.y += this.y;
    }

    // x in rad
    rotate(x: number) {
        const mod = this.mod();
        const ang = this.phase() + x;
        this.x = mod * Math.cos(ang);
        this.y = mod * Math.sin(ang);
    }
}

