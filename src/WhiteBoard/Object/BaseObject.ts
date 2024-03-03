import Stack from '../../DataStructures/Stack';
import { Point } from '../GeoSpace/Point';
import { NORMAL, Vector } from '../GeoSpace/Vector';
import { BoundingBox } from './BoundingBox';
import { Path } from './Path';



export abstract class BaseObject {
    erased: Path[] = [];
    abstract render(ctx: CanvasRenderingContext2D): void;
    abstract pointInside(point: Point): boolean;
    abstract getBoundingBox(): BoundingBox;
    abstract pointDistance(p: Point): number;

    pointInRange(mousePoint: Point, range: number): Point | null {
        const stack = new Stack<Point>(mousePoint.copy());
        let distance = Number.POSITIVE_INFINITY;

        while (stack.peek()) {
            const p = stack.pop() as Point;

            const currentDistance = this.pointDistance(p);

            if (currentDistance > range || new Vector(mousePoint, p).mod > range || currentDistance >= distance) continue;
            if (currentDistance == 0) return p;

            distance = currentDistance;

            stack.push(p.copy().translate(NORMAL.x));
            stack.push(p.copy().translate(NORMAL.xI));
            stack.push(p.copy().translate(NORMAL.y));
            stack.push(p.copy().translate(NORMAL.yI));
        }

        return null;
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
