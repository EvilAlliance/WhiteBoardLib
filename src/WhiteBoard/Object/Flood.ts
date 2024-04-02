import Queue from "../../DataStructures/Queue";
import { ORIGIN, Point } from "../GeoSpace/Point";
import { NORMAL, Vector } from "../GeoSpace/Vector";
import { BaseObject } from "./BaseObject";
import { BoundingBox } from "./BoundingBox";

export class Flood extends BaseObject {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    translate: Point = ORIGIN.copy();

    constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, translate: Point) {
        super();
        this.canvas = canvas;
        this.ctx = ctx;
        this.translate = translate;
    }

    _drawObject(ctx: CanvasRenderingContext2D): void {
        ctx.drawImage(this.canvas, this.translate.x, this.translate.y);
    }

    pointInside(point: Point): boolean {
        const mat = this.ctxTransformation.GetTransformationMatrix(this.getBoundingBox()).translateSelf(this.translate.x, this.translate.y).invertSelf();
        const p = point.copy().transform(mat);
        return new Uint32Array(this.ctx.getImageData(p.x, p.y, 1, 1).data.buffer)[0] != 0;
    }

    getBoundingBox(): BoundingBox {
        const x = this.translate.x + this.canvas.width;
        const y = this.translate.y + this.canvas.height;
        return new BoundingBox(
            new Point(this.translate.x, this.translate.x),
            new Point(x, this.translate.y),
            new Point(this.translate.y, y),
            new Point(x, y),
        );
    }

    pointDistance(p: Point): number {
        return Number.MAX_SAFE_INTEGER;
    }

    pointInRange(p: Point, range: number): boolean {
        if (this.pointInside(p)) return true;
        const rangeCeil = Math.ceil(range);
        const visited = new Array(rangeCeil + rangeCeil).fill(new Array(rangeCeil + rangeCeil).fill(false));
        console.log(rangeCeil, visited.length, visited[0].length)

        const q = new Queue<Point>();
        const temp = p.copy();

        temp.x = Math.round(temp.x);
        temp.y = Math.round(temp.y);

        q.enqueue(temp);

        while (q.peek()) {
            const p2 = q.deque() as Point;
            if (visited[p2.x - temp.x + rangeCeil][p2.y - temp.y + rangeCeil]) continue;

            visited[p2.x - temp.x + rangeCeil][p2.y - temp.y + rangeCeil] = true;

            const vec = new Vector(p, p2);

            if (vec.mod <= range && this.pointInside(p2)) return true;


            q.enqueue(p2.copy().translate(NORMAL.x));
            q.enqueue(p2.copy().translate(NORMAL.xI));
            q.enqueue(p2.copy().translate(NORMAL.y));
            q.enqueue(p2.copy().translate(NORMAL.yI));
        }

        return false;
    }
}
