import { Point } from "../GeoSpace/Point";
import { Vector } from "../GeoSpace/Vector";
import { BoundingBox } from "./BoundingBox";
import { Path } from "./Path";



export abstract class BaseObject {
    erased: Path[] = [];
    abstract render(ctx: CanvasRenderingContext2D): void;
    abstract pointInside(point: Point): boolean;
    abstract getBoundingBox(): BoundingBox;
    pointInRange(mousePoint: Point, width: number, tolerance: number): Point | null {
        while (width > 0) {
            let i = 3;
            while (width * Math.sin(Math.PI / i) > tolerance) {
                i += 1;
            }

            const mod = width / 2;
            const ang = 2 * Math.PI / i;
            const vec = new Vector(new Point(0, 0), new Point(mod * Math.sin(ang), mod * Math.cos(ang)));

            const arr = new Array(i);

            for (let j = 0; j < arr.length; j++) {
                const p = Object.assign({}, mousePoint);
                vec.translatePoint(p);
                arr[j] = p;
                vec.rotate(ang);
            }

            for (let j = 0; j < arr.length; j++) {

                if (this.pointInside(arr[j]))
                    return arr[j];
            }

            width--;
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
