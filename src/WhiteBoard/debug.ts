import { Canvas } from './Canvas';
import { Point } from './GeoSpace/Point';
import { Path } from './Object/Path';
import { CanvasParseColor, Color } from './Utils/Color';

export function drawDot(canvas: Canvas, p: Point, color: Color) {
    const { ctx } = canvas;
    ctx.save();
    ctx.strokeStyle = CanvasParseColor(color);
    ctx.fillStyle = CanvasParseColor(color);
    ctx.beginPath();
    ctx.arc(p.x, p.y, 1, 0 * Math.PI, 1.5 * Math.PI);
    ctx.stroke();
    ctx.fill();
    ctx.restore();
}

export function trailDots(canvas: Canvas, path: Path, color: Color) {
    const p = path.Path;
    const { ctx } = canvas;
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
