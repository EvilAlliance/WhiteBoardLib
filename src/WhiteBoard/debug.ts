import { Point } from './GeoSpace/Point';
import { Path } from './Object/Path';
import { CanvasParseColor, Color } from './Utils/Color';

export function drawDot(ctx: CanvasRenderingContext2D, p: Point, color: Color) {
    ctx.save();
    ctx.strokeStyle = CanvasParseColor(color);
    ctx.fillStyle = CanvasParseColor(color);
    ctx.beginPath();
    ctx.arc(p.x, p.y, 1, 0, 2 * Math.PI);
    ctx.fill();
    ctx.restore();
}

export function trailDots(ctx: CanvasRenderingContext2D, path: Path, color: Color) {
    const p = path.Path;
    ctx.save();
    ctx.strokeStyle = CanvasParseColor(color);
    ctx.fillStyle = CanvasParseColor(color);
    for (const dot of p) {
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, 1, 0 * Math.PI, 1.5 * Math.PI);
        ctx.stroke();
        ctx.fill();
    }
    ctx.restore();
}
