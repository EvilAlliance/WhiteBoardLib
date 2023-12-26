import { Canvas } from '../Canvas';
import { Point } from '../GeoSpace/Point';
import { Vector } from '../GeoSpace/Vector';
import { CanvasParseColor, Color } from '../Utils/Color';

export class Path {
    public Path: Point[] = [];
    public color: Color = 'Red';
    public lineCap: CanvasLineCap = 'round';
    public width: number = 1;
    public globalCompositeOperation: GlobalCompositeOperation = 'source-over';

    constructor(obj: Partial<Path> = {}) {
        Object.assign(this, obj);
    }
}

export function PathRender(canvas: Canvas, path: Path) {
    if (path.Path.length == 0) return;
    const ctx = canvas.ctx;
    ctx.save();

    ctx.globalCompositeOperation = path.globalCompositeOperation;

    ctx.lineCap = path.lineCap;
    ctx.lineWidth = path.width;
    ctx.strokeStyle = CanvasParseColor(path.color);

    if (path.Path.length == 1) {
        const point = path.Path[0];
        ctx.fillStyle = ctx.strokeStyle;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(point.x, point.y, path.width / 2, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();
        ctx.restore();
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
