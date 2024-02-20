import { Point } from '../GeoSpace/Point';
import { Vector } from '../GeoSpace/Vector';
import { BoundingBox } from './BoundingBox';
import { Path } from './Path';



export abstract class BaseObject {
    erased: Path[] = [];
    abstract render(ctx: CanvasRenderingContext2D): void;
    abstract pointInside(point: Point): boolean;
    abstract getBoundingBox(): BoundingBox;
    pointInRange(mousePoint: Point, range: number, tolerance: number): Point | null {
        let count = 0;
        while (range > 0) {
            let i = 3;
            while (range * Math.sin(Math.PI / i) > tolerance) {
                i += 1;
            }
            count += i;

            const ang = 2 * Math.PI / i;
            const vec = new Vector(new Point(0, 0), new Point(range * Math.cos(ang), range * Math.sin(ang)));

            for (let j = 0; j < i; j++) {
                const p = Object.assign({}, mousePoint);
                vec.translatePoint(p);
                if (this.pointInside(p))
                    return p;
                vec.rotate(ang);
            }

            range--;
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
