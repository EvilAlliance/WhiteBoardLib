import { CanvasObject } from './Object/CanvasObject';
import { CanvasObjectContainer, CanvasObjectContainerEvent } from './Object/CanvasObjectContainer';
import { Rect, RectRender } from './Object/Rect';
import { TEventCallback, fire } from './Observable';

export type CanvasEvents = {
    'render:Before': null;
    'render:After': null;
}

export class Canvas {
    public Canvas: HTMLCanvasElement;
    public ctx: CanvasRenderingContext2D;
    public Objects: CanvasObjectContainer[];
    public eventListener: Record<keyof CanvasEvents, TEventCallback<CanvasEvents[keyof CanvasEvents]>[]>;
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

        this.eventListener = {} as Record<keyof CanvasEvents, TEventCallback<CanvasEvents[keyof CanvasEvents]>[]>;
    }
}

export function CanvasClear(canvas: Canvas) {
    canvas.ctx.clearRect(0, 0, canvas.width, canvas.height);
}

export function CanvasAddCanvasObject(canvas: Canvas, obj: CanvasObject) {
    canvas.Objects.push(new CanvasObjectContainer(obj));
}

export function CanvasAddCanvasObjectRender(canvas: Canvas, obj: CanvasObject) {
    canvas.Objects.push(new CanvasObjectContainer(obj));
    CanvasRender(canvas);
}

export function CanvasAddCanvasObjectContainer(canvas: Canvas, obj: CanvasObjectContainer) {
    canvas.Objects.push(obj);
}

export function CanvasAddCanvasObjectContainerRender(canvas: Canvas, obj: CanvasObjectContainer) {
    canvas.Objects.push(obj);
    CanvasRender(canvas);
}

export function CanvasRender(canvas: Canvas) {
    fire<CanvasEvents, 'render:Before'>(canvas, 'render:Before', null);
    for (const Object of canvas.Objects) {
        fire<CanvasObjectContainerEvent, 'render:Before'>(Object, 'render:Before', null);
        else { console.log('TODO: ', Object); }
        fire<CanvasObjectContainerEvent, 'render:After'>(Object, 'render:After', null);
    }
    fire<CanvasEvents, 'render:After'>(canvas, 'render:After', null);
}
