import { Canvas, CanvasClear, CanvasRender } from '../Canvas';
import { Point } from '../GeoSpace/Point';
import { Vector, VectorMod } from '../GeoSpace/Vector';
import { CanvasObjectContainer } from '../Object/CanvasObjectContainer';
import { Path } from '../Object/Path';
import { Color } from '../Utils/Color';
import { trailDots } from '../debug';
import { BaseBrush } from './BaseBrush';

export class Brush extends BaseBrush<Path> {
    lineCap: CanvasLineCap = 'round';
    color: Color = 'Red';
    globalCompositeOperation: GlobalCompositeOperation = 'source-over';

    constructor(brush: Partial<Brush> = {}) {
        super();
        Object.assign(this, brush);
    }
    mouseDown(canvas: Canvas<this>): Path {
        return BrushMouseDown(canvas);
    }

    mouseMove(canvas: Canvas<this>, e: MouseEvent, obj: Path): void {
        BrushMouseMove(canvas, e, obj);
    }
    // @ts-ignore
    mouseUp(canvas: Canvas<this>, e: MouseEvent, obj: Path): void {
        trailDots(canvas, obj, 'Black');
    }
}

export function BrushMouseDown(canvas: Canvas<Brush>): Path {
    const p = new Path({
        ctxSetting: {
            strokeWidth: canvas.cursor.width,
            strokeColor: canvas.cursor.color,
            lineCap: canvas.cursor.lineCap,
            globalCompositeOperation: canvas.cursor.globalCompositeOperation,
        }
    });

    canvas.Objects.push(new CanvasObjectContainer(p));

    return p;
}

export function BrushMouseMove(canvas: Canvas<Brush>, e: MouseEvent, path: Path) {
    if (!(canvas.cursor instanceof Brush)) return;
    const p = new Point(e.offsetX, e.offsetY);

    if (path.Path.length == 0) {
        path.Path.push(p);
    } else {
        const v = new Vector(p, path.Path[path.Path.length - 1]);
        if (VectorMod(v) >= canvas.cursor.width / 2) {
            path.Path.push(p);
        }
    }

    CanvasClear(canvas);
    CanvasRender(canvas);
}

//simplify path prototype not used 
//@ts-ignore
export function BrushMouseUp(canvas: Canvas, path: Path) {
    const p = JSON.parse(JSON.stringify(path));
    let curr = path.Path[0];
    let i = 1;
    while (i < path.Path.length - 1) {
        const nextVec = new Vector(curr, path.Path[i]);
        const nextNextVec = new Vector(curr, path.Path[i + 1]);
        const newVec = new Vector(path.Path[i], path.Path[i + 1]);
        if (Math.abs(Math.atan(nextVec.y / nextVec.x) - Math.atan(nextNextVec.y / nextNextVec.x)) < Math.PI / 90 && Math.abs(Math.atan(newVec.y / newVec.x)) > Math.PI / 90 - Math.PI / 180) {
            path.Path.splice(i--, 1);
        }
        curr = path.Path[i++];
    }
    CanvasClear(canvas);
    CanvasRender(canvas);
    trailDots(canvas, p, 'Black');
    trailDots(canvas, path, 'Bulrush');
}
