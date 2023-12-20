import { Point } from './Point';

export class Vector {
    public x: number;
    public y: number;

    constructor(p1: Point, p2: Point) {
        this.x = p2.x - p1.x;
        this.y = p2.y - p1.y;
    }
}
