import { Point } from '../GeoSpace/Point';
import { Vector, VectorMod } from '../GeoSpace/Vector';
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

    pointInRange(obj: typeof this, mousePoint: Point, width: number): boolean {
        return PathPointInRange(obj, mousePoint, width);
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

function PathPointInRange(path: Path, mousePoint: Point, width: number): boolean {
    for (let i = 0; i < path.Path.length; i++) {
        const coord = path.Path[i];
        if (VectorMod(new Vector(coord, mousePoint)) < width / 2) return true;
        if (i < path.Path.length - 1) {
            const dot2 = path.Path[i + 1];
            if (PathMousePointInsideSquareOf2Points(coord, dot2, mousePoint)) {
                if (PathSearchBetween2Points(coord, dot2, mousePoint, width)) return true;
            }
        }
    }
    return false;
}

function PathMousePointInsideSquareOf2Points(p1: Point, p2: Point, mousePoint: Point): boolean {
    const InsideYLimiter = (p1.y >= mousePoint.y && p2.y <= mousePoint.y) || (p2.y >= mousePoint.y && p1.y <= mousePoint.y);
    const InsideXLimiter = (p1.x >= mousePoint.x && p2.x <= mousePoint.x) || (p2.x >= mousePoint.x && p1.x <= mousePoint.x);
    return InsideYLimiter && InsideXLimiter;
}

function PathSearchBetween2Points(p1: Point, p2: Point, mousePoint: Point, width: number): boolean {
    const vec = new Vector(p1, p2);
    vec.x *= 0.5;
    vec.y *= 0.5;

    const pMid = {
        x: p1.x + vec.x,
        y: p1.y + vec.y,
    };

    let low = 0;
    let high = 100;
    while (low < high) {
        const j = Math.ceil((low + high) / 2);
        const quadraticCurveP = quadraticCurvePoint(p1, p2, pMid, j / 100);
        const dist = VectorMod(new Vector(quadraticCurveP, mousePoint));
        if (dist < width / 2) return true;
        const quadraticCurvePMore = quadraticCurvePoint(p1, p2, pMid, (j + 1) / 100);
        const quadraticCurvePLess = quadraticCurvePoint(p1, p2, pMid, (j - 1) / 100);
        const distM = VectorMod(new Vector(quadraticCurvePMore, mousePoint));
        const distL = VectorMod(new Vector(quadraticCurvePLess, mousePoint));
        if (distM < distL) {
            low = j + 1;
        } else {
            high = j - 1;
        }
    }
    return false;
}

function quadraticCurvePoint(origin: Point, end: Point, control: Point, porsentage: number): Point {
    return {
        x: quadraticCurve(origin.x, end.x, control.x, porsentage),
        y: quadraticCurve(origin.y, end.y, control.y, porsentage)
    };
}

function quadraticCurve(origin: number, end: number, control: number, porsentage: number) {
    return Math.pow(1 - porsentage, 2) * origin + 2 * (1 - porsentage) * porsentage * control + Math.pow(porsentage, 2) * end;
}
