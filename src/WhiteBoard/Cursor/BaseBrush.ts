import { Canvas } from '../Canvas';

export abstract class BaseBrush<T = void> {
    diameter: number = 10;

    init(canvas: Canvas<typeof this>, e: MouseEvent) {
        const temp = canvas.cursor.mouseDown(canvas, e);

        canvas.cursor.mouseMove(canvas, e, temp);

        const x = canvas.on('mouse:move', function(this: Canvas, e: MouseEvent) {
            canvas.cursor.mouseMove(canvas, e, temp);
        });

        canvas.once('mouse:up', function(this: Canvas, e: MouseEvent) {
            x();
            canvas.cursor.mouseUp(canvas, e, temp);
        });
    }

    abstract mouseDown(canvas: Canvas<typeof this>, e: MouseEvent): T;
    abstract mouseMove(canvas: Canvas<typeof this>, e: MouseEvent, obj: T): void;
    abstract mouseUp(canvas: Canvas<typeof this>, e: MouseEvent, obj: T): void;
}
