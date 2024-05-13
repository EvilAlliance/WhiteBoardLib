import { Point } from "../GeoSpace/Point";
import { Vector } from "../GeoSpace/Vector";

export function closestToBase(x: number, y: number, base: number) {
    const xd = Math.abs(x - base);
    const yd = Math.abs(y - base);

    return xd < yd ? x : y;
}


export function closestPointToSegment(s1: Point, s2: Point, p: Point): Point {
    const dist2 = Math.pow(s1.x - s2.x, 2) + Math.pow(s1.y - s2.y, 2);
    if (dist2 == 0) return p.copy();

    let t = ((p.x - s1.x) * (s2.x - s1.x) + (p.y - s1.y) * (s2.y - s1.y)) / dist2;
    t = Math.max(0, Math.min(1, t));

    return new Point(s1.x + t * (s2.x - s1.x), s1.y + t * (s2.y - s1.y));
}

export function distanceBetweenSegmentToPoint(s1: Point, s2: Point, p: Point): number {
    const projection = closestPointToSegment(s1, s2, p);
    return new Vector(projection, p).mod();
}
