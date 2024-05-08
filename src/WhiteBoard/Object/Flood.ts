import { ORIGIN, Point } from "../GeoSpace/Point";
import { Vector } from "../GeoSpace/Vector";
import { BaseObject } from "./BaseObject";
import { BoundingBox } from "./BoundingBox";

export type FloodWorker = {
    imageData: ImageData,
    translateX: number,
    translateY: number,
    width: number,
    height: number
}

export class Flood extends BaseObject {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    trans: Point = ORIGIN.copy();

    constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, translate: Point) {
        super();
        if (canvas.width == 0 || canvas.height == 0) {
            console.error('canvas with width or height 0', arguments);
            return;
        }
        this.canvas = canvas;
        this.ctx = ctx;
        this.trans = translate;
    }

    _drawObject(ctx: CanvasRenderingContext2D): void {
        ctx.drawImage(this.canvas, this.trans.x, this.trans.y);
    }

    _getBoundingBox(): BoundingBox {
        const x = this.trans.x + this.canvas.width;
        const y = this.trans.y + this.canvas.height;
        return new BoundingBox(
            new Point(this.trans.x, this.trans.y),
            new Point(x, this.trans.y),
            new Point(this.trans.x, y),
            new Point(x, y),
        );
    }

    copy(): Flood {
        return new Flood(this.canvas, this.ctx, this.trans);
    }

    translate(v: Vector): void {
        this.dirty = true;
        v.translatePoint(this.trans);
    }
}
