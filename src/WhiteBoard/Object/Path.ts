import { Point } from '../GeoSpace/Point';
import { Vector } from '../GeoSpace/Vector';
import { DeepPartial } from '../Type';
import { BaseObject, BoundingBox } from './BaseObject';

export class Path extends BaseObject {
    public Path: Point[] = [];

    constructor(obj: DeepPartial<Path> = {}) {
        super();
        Object.assign(this, obj);
    }
    draw(ctx: CanvasRenderingContext2D, obj: this): void {
        PathDraw(ctx, obj);
    }
    shouldFill(obj: this): boolean {
        return obj.ctxSetting.fill || obj.Path.length == 1;
    }
    getBoundingBox(obj: this): BoundingBox {
        return PathGetBoundingBox(obj);
    }
}

export function PathDraw(ctx: CanvasRenderingContext2D, path: Path) {
    if (path.Path.length == 0) return;

    if (path.Path.length == 1) {
        const point = path.Path[0];
        ctx.fillStyle = ctx.strokeStyle;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(point.x, point.y, path.ctxSetting.strokeWidth / 2, 0, 2 * Math.PI);
        return;
    }

    ctx.beginPath();
    let p1 = path.Path[0];
    let p2 = path.Path[1];
    ctx.moveTo(p1.x, p1.y);
    for (let i = 1; i < path.Path.length - 1; i++) {
        const vec = new Vector(p1, p2);
        vec.x *= 0.5;
        vec.y *= 0.5;
        const pMid = {
            x: p1.x + vec.x,
            y: p1.y + vec.y,
        };
        ctx.quadraticCurveTo(p1.x, p1.y, pMid.x, pMid.y);
        p1 = path.Path[i];
        p2 = path.Path[i + 1];
    }
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
}

export function PathGetBoundingBox(obj: Path): BoundingBox {
    const tl = { ...obj.Path[0] };
    if (obj.Path.length == 1)
        return { tl, br: tl };
    const br = { ...obj.Path[1] };

    if (tl.y > br.y) {
        const temp = tl.y;
        tl.y = br.y;
        br.y = temp;
    }

    if (tl.x > br.x) {
        const temp = tl.x;
        tl.x = br.x;
        br.x = temp;
    }

    for (let i = 0; i < obj.Path.length; i++) {
        const p = obj.Path[i];

        if (p.x < tl.x) {
            tl.x = p.x;
        } else if (p.x > br.x) {
            br.x = p.x;
        }

        if (p.y < tl.y) {
            tl.y = p.y;
        } else if (p.y > br.y) {
            br.y = p.y;
        }
    }

    return { tl, br };
}
