import { Canvas } from '../Canvas';
import { Point } from '../GeoSpace/Point';
import { CanvasObjectContainer } from '../Object/CanvasObjectContainer';
import { BaseBrush } from './BaseBrush';

export class EraserAll extends BaseBrush {
    tolerance: number = 10;
    constructor(eraserAll: Partial<EraserAll> = {}) {
        super();
        Object.assign(this, eraserAll);
    }

    mouseDown(canvas: Canvas<this>): undefined {

    }

    mouseMove(canvas: Canvas<this>, e: MouseEvent): void {
        const mousePoint: Point = new Point(e.offsetX, e.offsetY);
        const Objects = canvas.Objects;
        for (const object of Objects) {
            if (object.Object.pointInRange(mousePoint, canvas.cursor.diameter, canvas.cursor.tolerance)) EraserAllEraseObject(canvas, object);
        }
    }

    mouseUp(canvas: Canvas<this>, e: MouseEvent): void {

    }
}

export function EraserAllObjectCeaseExist(canvas: Canvas, object: CanvasObjectContainer): Worker {
    const worker = new Worker('./src/WhiteBoard/Cursor/ObjectExist.worker.ts', { type: 'classic' });
    worker.postMessage(new Uint32Array(object.Object.getCanvasData().data.buffer));
    worker.addEventListener('message', (e) => {
        worker.terminate();
        if (typeof e.data != 'boolean') throw new Error('Expected a Boolean');
        if (e.data) EraserAllEraseObject(canvas, object);
    });
    return worker;
}

export function EraserAllEraseObject(canvas: Canvas, object: CanvasObjectContainer) {
    canvas.Objects.splice(canvas.Objects.indexOf(object), 1);
    canvas.clear();
    canvas.render();
}

