import { ORIGIN } from "../Constantes/Used";
import { Point } from "./Point";

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

    translatePoint(p: Point): void {
        const x = this.getX();
        const y = this.getY();

        p.x += x;
        p.y += y;
    }

    copy(): Vector {
        return new Vector(ORIGIN, new Point(this.getX(), this.getY()));
    }
}
