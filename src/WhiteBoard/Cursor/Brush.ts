import { Canvas, CanvasClear, CanvasEvents, CanvasRender } from '../Canvas';
import { setOption } from '../CommonMethod';
import { Point } from '../GeoSpace/Point';
import { Vector } from '../GeoSpace/Vector';
import { CanvasObjectContainer } from '../Object/CanvasObjectContainer';
import { Path } from '../Object/Path';
import { on } from '../Observable';
import { Color } from '../Utils/Color';
import { trailDots } from '../debug';

export class Brush {
    public lineCap: CanvasLineCap = 'round';
    public width: number = 10;
    public color: Color = 'Red';
    public globalCompositeOperation: GlobalCompositeOperation = 'source-over';
    constructor(brush: Partial<Brush> = {}) {
        setOption<Brush>(this, brush);
    }
}

export function BrushMouseDown(canvas: Canvas, e: MouseEvent) {
    if (!(canvas.cursor instanceof Brush)) return;
    const path = new Path({
        width: canvas.cursor.width,
        color: canvas.cursor.color,
        lineCap: canvas.cursor.lineCap,
        globalCompositeOperation: canvas.cursor.globalCompositeOperation,
    });
    canvas.Objects.push(new CanvasObjectContainer(path));

    mouseMove(canvas, e, path);
    const x = on<CanvasEvents, 'mouse:move'>(canvas, 'mouse:move', function(this: Canvas, e) {
        mouseMove(this, e, path);
    });

    const y = on<CanvasEvents, 'mouse:up'>(canvas, 'mouse:up', function(this: Canvas) {
        //mouseUp(this,path)
        x();
        y();
    });
}

function mouseMove(canvas: Canvas, e: MouseEvent, path: Path) {
    if (!(canvas.cursor instanceof Brush)) return;
    const p = new Point(e.offsetX, e.offsetY);
    if (path.Path.length == 0) {
        path.Path.push(p);
    } else {
        const v = new Vector(p, path.Path[path.Path.length - 1]);
        if (Math.hypot(v.x, v.y) >= (canvas.cursor?.width as number) / 2) {
            path.Path.push(p);
        }
    }
    CanvasClear(canvas);
    CanvasRender(canvas);
}

//simplify path prototype not used 
//@ts-ignore
function mouseUp(canvas: Canvas, path: Path) {
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
