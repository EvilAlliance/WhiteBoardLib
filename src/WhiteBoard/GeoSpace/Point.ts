import { Vector } from "./Vector";

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
}
