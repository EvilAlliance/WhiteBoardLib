import { CanvasObjectContainer } from './Object/CanvasObjectContainer';
import { Rect, RectRender } from './Object/Rect';

export class Canvas {
    public Canvas: HTMLCanvasElement;
    public ctx: CanvasRenderingContext2D;
    public Objects: CanvasObjectContainer[];
    public eventListener: any;
    public height: number;
    public width: number;
    public cursor: any;

    constructor(tag: string | HTMLCanvasElement, width: number, height: number) {
        if (tag instanceof HTMLCanvasElement) {
            this.Canvas = tag;
        } else {
            const x = document.querySelector(tag);
            if (!(x && x instanceof HTMLCanvasElement)) throw new Error('Element does not exist or Element is not an HTMLCanvasElement');
            this.Canvas = x as HTMLCanvasElement;
        }

        this.Canvas.width = width;
        this.Canvas.height = height;

        this.ctx = this.Canvas.getContext('2d') as CanvasRenderingContext2D;

        this.width = width;
        this.height = height;

        this.Objects = [];
export function CanvasClear(canvas: Canvas) {
    canvas.ctx.clearRect(0, 0, canvas.width, canvas.height);
}
export function CanvasAddCanvasObject(canvas: Canvas, obj: CanvasObject) {
    canvas.Objects.push(new CanvasObjectContainer(obj));
}

export function CanvasAddCanvasObjectContainer(canvas: Canvas, obj: CanvasObjectContainer) {
    canvas.Objects.push(obj);
}
export function CanvasRender(canvas: Canvas) {
    for (const Object of canvas.Objects) {
        if (Object instanceof Rect) { RectRender(canvas, Object); }
        else { console.log('TODO: ', Object); }
    }
}
