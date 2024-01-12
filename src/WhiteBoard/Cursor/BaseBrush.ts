import { Canvas, CanvasEvents } from '../Canvas';
import { on } from '../Observable';

export abstract class BaseBrush<T = undefined> {
    width: number = 10;
    abstract mouseDown(canvas: Canvas<this>): T;
    abstract mouseMove(canvas: Canvas<this>, e: MouseEvent, obj: T): void;
    abstract mouseUp(canvas: Canvas<this>, e: MouseEvent, obj: T): void;
}

export function BaseBrushMouseDown(canvas: Canvas, e: MouseEvent) {
    const temp = canvas.cursor.mouseDown(canvas);

    canvas.cursor.mouseMove(canvas, e, temp);

    const x = on<CanvasEvents, 'mouse:move'>(canvas, 'mouse:move', function(this: Canvas, e: MouseEvent) {
        canvas.cursor.mouseMove(canvas, e, temp);
    });

    const y = on<CanvasEvents, 'mouse:up'>(canvas, 'mouse:up', function(this: Canvas, e: MouseEvent) {
        x();
        y();
        canvas.cursor.mouseUp(canvas, e, temp);
    });
}
