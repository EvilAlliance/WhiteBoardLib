import { Point } from '../GeoSpace/Point';
import { BoundingBox } from './BoundingBox';
import { Path } from './Path';



export abstract class BaseObject {
    erased: Path[] = [];
    abstract render(ctx: CanvasRenderingContext2D): void;
    abstract pointInside(point: Point): boolean;
    abstract getBoundingBox(): BoundingBox;
    abstract pointDistance(p: Point): number;

    distanceBetweenSegmentToPoint(s1: Point, s2: Point, p: Point): number {
        return Math.abs((s2.x - s1.x) * (s1.y - p.y) - (s1.x - p.x) * (s2.y - s1.y)) / Math.hypot(s2.x - s1.x, s2.y - s1.y);
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
