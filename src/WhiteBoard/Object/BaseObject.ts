import { Point } from '../GeoSpace/Point';
import { Vector } from '../GeoSpace/Vector';
import { BoundingBox } from './BoundingBox';
import { Path } from './Path';



export abstract class BaseObject {
    erased: Path[] = [];
    abstract render(ctx: CanvasRenderingContext2D): void;
    abstract pointInside(point: Point): boolean;
    abstract getBoundingBox(): BoundingBox;
    abstract pointDistance(p: Point): number;

    distanceBetweenSegmentToPoint(s1: Point, s2: Point, p: Point): number {
        const dist2 = Math.pow(s1.x - s2.x, 2) + Math.pow(s1.y - s2.y, 2);
        if (dist2 == 0) return Math.hypot(s2.x - p.x, s2.y - p.y);

        let t = ((p.x - s1.x) * (s2.x - s1.x) + (p.y - s1.y) * (s2.y - s1.y)) / dist2;
        t = Math.max(0, Math.min(1, t));

        const projection = new Point(s1.x + t * (s2.x - s1.x), s1.y + t * (s2.y - s1.y));

        return new Vector(projection, p).mod;
    }

    pointInRange(mousePoint: Point, range: number): boolean {
        return this.pointDistance(mousePoint) <= range;
    }

    getCanvasData() {
        const { tl, tr, bl, br } = this.getBoundingBox();

        const canvas = document.createElement('canvas');

        const ctx = canvas.getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D;

        const canvasTL = new Point(
            Math.min(tl.x, tr.x, bl.x, br.x),
            Math.min(tl.y, tr.y, bl.y, br.y)
        );

        const canvasBR = new Point(
            Math.max(tl.x, tr.x, bl.x, br.x),
            Math.max(tl.y, tr.y, bl.y, br.y)
        );

        canvas.width = canvasBR.x - canvasTL.x;
        canvas.height = canvasBR.y - canvasTL.y;

        ctx.translate(-canvasTL.x, -canvasTL.y);

        this.render(ctx);

        return ctx.getImageData(0, 0, canvas.width, canvas.height);
    }
}
