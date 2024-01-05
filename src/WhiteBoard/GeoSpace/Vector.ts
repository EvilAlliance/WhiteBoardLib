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

export function VectorAng(vec: Vector): number {
    const x = Math.sign(vec.x) == -1 ? Math.PI : 0;
    return Math.atan(vec.y / vec.x) + x;
}

export function VectorTranslatePoint(vec: Vector, p: Point) {
    p.x += vec.x;
    p.y += vec.y;
}

/**
 * x rad
 * */
export function VectorRotate(vec: Vector, x: number) {
    const mod = VectorMod(vec);
    const ang = VectorAng(vec) + x;
    vec.x = mod * Math.cos(ang);
    vec.y = mod * Math.sin(ang);
}
