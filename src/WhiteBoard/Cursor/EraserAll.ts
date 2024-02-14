import { Canvas, CanvasClear, CanvasRender } from '../Canvas';
import { Point } from '../GeoSpace/Point';
import { BaseObjectCanvasData } from '../Object/BaseObject';
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
        EraserAllMouseMove(canvas, e);
    }

    mouseUp(canvas: Canvas<this>, e: MouseEvent): void {

    }
}

function EraserAllMouseMove(canvas: Canvas<EraserAll>, e: MouseEvent) {
    const mousePoint: Point = new Point(e.offsetX, e.offsetY);
    const Objects = canvas.Objects;
    for (const object of Objects) {
        if (object.Object.pointInRange(object.Object, mousePoint, canvas.cursor.width, canvas.cursor.tolerance)) EraserAllEraseObject(canvas, object);
    }
}

export function EraserAllObjectCeaseExist(canvas: Canvas, object: CanvasObjectContainer): Worker {
    const worker = new Worker('./src/WhiteBoard/Cursor/ObjectExist.worker.ts', { type: 'classic' });
    worker.postMessage(new Uint32Array(BaseObjectCanvasData(object.Object).data.buffer));
    worker.addEventListener('message', (e) => {
        worker.terminate();
        if (typeof e.data != 'boolean') throw new Error('Expected a Boolean');
        EraserAllEraseObject(canvas, object);
    });
    return worker;
}

export function EraserAllEraseObject(canvas: Canvas, object: CanvasObjectContainer) {
    canvas.Objects.splice(canvas.Objects.indexOf(object), 1);
    CanvasClear(canvas);
    CanvasRender(canvas);
}

