import { Canvas } from '../Canvas';

export abstract class BaseBrush {
    diameter: number = 10;

    abstract mouseDown(canvas: Canvas<typeof this>, e: MouseEvent): void;
    abstract mouseMove(canvas: Canvas<typeof this>, e: MouseEvent): void;
    abstract mouseUp(canvas: Canvas<typeof this>, e: MouseEvent): void;

    renderCursor(canvas: HTMLCanvasElement = document.createElement('canvas')) {
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        ctx.lineWidth = 1;
        ctx.shadowColor = 'black';
        ctx.strokeStyle = 'white';

        canvas.width = this.diameter;
        canvas.height = this.diameter;

        const w = this.diameter / 2;

        ctx.arc(w, w, w, 0, 2 * Math.PI);

        ctx.stroke();

        return canvas;
    }
}
