import { ORIGIN, Point } from "../GeoSpace/Point";
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
    translate: Point = ORIGIN.copy();

    constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, translate: Point) {
        super();
        if (canvas.width == 0 || canvas.height == 0) {
            console.error('canvas with width or height 0', arguments);
            return;
        }
        this.canvas = canvas;
        this.ctx = ctx;
        this.translate = translate;
    }

    _drawObject(ctx: CanvasRenderingContext2D): void {
        ctx.drawImage(this.canvas, this.translate.x, this.translate.y);
    }

    _getBoundingBox(): BoundingBox {
        const x = this.translate.x + this.canvas.width;
        const y = this.translate.y + this.canvas.height;
        return new BoundingBox(
            new Point(this.translate.x, this.translate.y),
            new Point(x, this.translate.y),
            new Point(this.translate.x, y),
            new Point(x, y),
        );
    }

    copy(): Flood {
        return new Flood(this.canvas, this.ctx, this.translate);
    }
}
