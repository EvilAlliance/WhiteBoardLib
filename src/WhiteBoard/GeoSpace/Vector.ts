import { Point } from './Point';

export class Vector {
    public x: number;
    public y: number;

    constructor(initial: Point, final: Point) {
        this.x = final.x - initial.x;
        this.y = final.y - initial.y;
    }
}

export function VectorMod(Vec: Vector): number {
    return Math.hypot(Vec.x, Vec.y);
}
