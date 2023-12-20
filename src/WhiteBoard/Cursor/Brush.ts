import { Canvas, CanvasClear, CanvasEvents, CanvasRender } from '../Canvas';
import { setOption } from '../CommonMethod';
import { Point } from '../GeoSpace/Point';
import { Vector } from '../GeoSpace/Vector';
import { CanvasObjectContainer } from '../Object/CanvasObjectContainer';
import { Path } from '../Object/Path';
import { on } from '../Observable';
import { CanvasParseColor, Color } from '../Utils/Color';

export class Brush {
    public lineCap: CanvasLineCap = 'round';
    public width: number = 10;
    public color: Color = 'Red';
    constructor(brush: Partial<Brush>) {
        setOption<Brush>(this, brush);
    }
}

export function BrushMouseDown(this: Canvas, e: MouseEvent) {
    const path = new Path({
        width: this.cursor?.width,
        color: this.cursor?.color,
        lineCap: this.cursor?.lineCap,
    });
    this.Objects.push(new CanvasObjectContainer(path));

    mouseMove.bind(this)(e, path);
    const x = on<CanvasEvents, 'mouse:move'>(this, 'mouse:move', function(this: Canvas, e) {
        mouseMove.bind(this)(e, path);
    });

    const y = on<CanvasEvents, 'mouse:up'>(this, 'mouse:up', function(this: Canvas) {
        x();
        y();
    });
}

function mouseMove(this: Canvas, e: MouseEvent, path: Path) {
    const p = new Point(e.offsetX, e.offsetY);
    if (path.Path.length == 0) {
        path.Path.push(p);
    } else {
        const v = new Vector(p, path.Path[path.Path.length - 1]);
        if (Math.hypot(v.x, v.y) >= (this.cursor?.width as number) / 3) {
            path.Path.push(p);
        }
    }
    CanvasClear(this);
    CanvasRender(this);
}

export function PathRender(canvas: Canvas, path: Path) {
    console.log(canvas.Objects);
    if (path.Path.length == 0) return;
    const ctx = canvas.ctx;
    ctx.save();

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

function mouseUp() {
}
