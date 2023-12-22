import { Canvas, CanvasClear, CanvasEvents, CanvasRender } from '../Canvas';
import { Point } from '../GeoSpace/Point';
import { Vector, VectorMod } from '../GeoSpace/Vector';
import { CanvasObjectContainer } from '../Object/CanvasObjectContainer';
import { Path } from '../Object/Path';
import { Rect } from '../Object/Rect';
import { on } from '../Observable';
export class EraserAll {
}

export function EraserAllMouseDown(canvas: Canvas, e: MouseEvent) {
    EraserAllMouseMove(canvas, e);

    const x = on<CanvasEvents, 'mouse:move'>(canvas, 'mouse:move', function(this: Canvas, e) {
        EraserAllMouseMove(this, e);
    });

    const y = on<CanvasEvents, 'mouse:up'>(canvas, 'mouse:up', function(this: Canvas) {
        x();
        y();
    });
}

function EraserAllMouseMove(canvas: Canvas, e: MouseEvent) {
    const mousePoint: Point = new Point(e.offsetX, e.offsetY);
    const Objects = canvas.Objects;
    for (const object of Objects) {
        if (!object.render) { return; }
        else if (object.Object instanceof Path) { EraserAllPath(canvas, object, mousePoint) }
        else if (object.Object instanceof Rect) { EraserAllRect(canvas, object, mousePoint) }
        else { console.log('TODO: ', object) }
    }
}

function EraserAllPath(canvas: Canvas, object: CanvasObjectContainer, mousePoint: Point) {
    const path = object.Object;
    if (!(path instanceof Path)) return;
    for (let i = 0; i < path.Path.length; i++) {
        const coord = path.Path[i];
        if (VectorMod(new Vector(coord, mousePoint)) < path.width / 2) { EraserAllEraseObject(canvas, object); return; }
        if (i < path.Path.length - 1) {
            const dot1 = path.Path[i];
            const dot2 = path.Path[i + 1];
            if (EraserAllMousePointInsideSquareOf2Points(dot1, dot2, mousePoint)) {
                EraserAllSearchBetween2Points(canvas, dot1, dot2, mousePoint, object);
            }
        }
    }
}

function EraserAllEraseObject(canvas: Canvas, object: CanvasObjectContainer) {
    canvas.Objects.splice(canvas.Objects.indexOf(object), 1);
    CanvasClear(canvas);
    CanvasRender(canvas);
}

function EraserAllMousePointInsideSquareOf2Points(p1: Point, p2: Point, mousePoint: Point): boolean {
    const InsideYLimiter = (p1.y >= mousePoint.y && p2.y <= mousePoint.y) || (p2.y >= mousePoint.y && p1.y <= mousePoint.y)
    const InsideXLimiter = (p1.x >= mousePoint.x && p2.x <= mousePoint.x) || (p2.x >= mousePoint.x && p1.x <= mousePoint.x);
    return InsideYLimiter && InsideXLimiter;
}

function EraserAllSearchBetween2Points(canvas: Canvas, p1: Point, p2: Point, mousePoint: Point, object: CanvasObjectContainer) {
    const path = object.Object;
    if (!(path instanceof Path)) return;

    const vec = new Vector(p1, p2);
    vec.x *= 0.5;
    vec.y *= 0.5;

    const pMid = {
        x: p1.x + vec.x,
        y: p1.y + vec.y,
    };

    let low = 0;
    let high = 100;
    while (high - low > 3) {
        let j = Math.ceil((low + high) / 2)
        const quadraticCurveP = quadraticCurvePoint(p1, p2, pMid, j / 100)
        const dist = VectorMod(new Vector(quadraticCurveP, mousePoint))
        if (dist < path.width / 2) { EraserAllEraseObject(canvas, object); return; }
        else {
            const quadraticCurvePMore = quadraticCurvePoint(p1, p2, pMid, (j + 1) / 100)
            const quadraticCurvePLess = quadraticCurvePoint(p1, p2, pMid, (j - 1) / 100)
            const distM = VectorMod(new Vector(quadraticCurvePMore, mousePoint));
            const distL = VectorMod(new Vector(quadraticCurvePLess, mousePoint));
            if (distM < distL) {
                low = j;
            } else {
                high = j;
            }
        }
    }
}

function quadraticCurvePoint(origin: Point, end: Point, control: Point, porsentage: number): Point {
    return {
        x: quadraticCurve(origin.x, end.x, control.x, porsentage),
        y: quadraticCurve(origin.y, end.y, control.y, porsentage)
    }
}

function quadraticCurve(origin: number, end: number, control: number, porsentage: number) {
    return Math.pow(1 - porsentage, 2) * origin + 2 * (1 - porsentage) * porsentage * control + Math.pow(porsentage, 2) * end;
}

function EraserAllRect(canvas: Canvas, object: Rect, mousePoint: Point) {

}
