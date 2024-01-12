import { BaseBrush, BaseBrushMouseDown } from './Cursor/BaseBrush';
import { BaseObject, BaseObjectRender } from './Object/BaseObject';
import { CanvasObjectContainer, CanvasObjectContainerEvent } from './Object/CanvasObjectContainer';
import { TEventCallback, fire, on } from './Observable';

export type CanvasEvents = {
    'render:Before': null;
    'render:After': null;
    'mouse:down': MouseEvent;
    'mouse:move': MouseEvent;
    'mouse:up': MouseEvent;
}

export class Canvas<T extends BaseBrush<any> = BaseBrush<any>> {
    public Canvas: HTMLCanvasElement;
    public ctx: CanvasRenderingContext2D;
    public Objects: CanvasObjectContainer[];
    public eventListener: Record<keyof CanvasEvents, TEventCallback<CanvasEvents[keyof CanvasEvents]>[]>;
    public height: number;
    public width: number;
    public cursor: T;

    constructor(tag: string | HTMLCanvasElement, width: number, height: number, baseBrush: T) {
        this.cursor = baseBrush;

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

        this.Canvas.addEventListener('mousedown', (e) => {
            fire<CanvasEvents, 'mouse:down'>(this, 'mouse:down', e);
        });

        this.Canvas.addEventListener('mousemove', (e) => {
            fire<CanvasEvents, 'mouse:move'>(this, 'mouse:move', e);
        });

        this.Canvas.addEventListener('mouseup', (e) => {
            fire<CanvasEvents, 'mouse:up'>(this, 'mouse:up', e);
        });

        on<CanvasEvents, 'mouse:down'>(this, 'mouse:down', function(this: Canvas, e) {
            BaseBrushMouseDown(this, e);
        });
    }
}

export function CanvasClear(canvas: Canvas) {
    canvas.ctx.clearRect(0, 0, canvas.width, canvas.height);
}

export function CanvasAddCanvasObject(canvas: Canvas, obj: BaseObject) {
    canvas.Objects.push(new CanvasObjectContainer(obj));
}

export function CanvasAddCanvasObjectRender(canvas: Canvas, obj: BaseObject) {
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
        if (!Object.render) continue;
        BaseObjectRender(canvas.ctx, Object.Object);
        fire<CanvasObjectContainerEvent, 'render:After'>(Object, 'render:After', null);
    }
    fire<CanvasEvents, 'render:After'>(canvas, 'render:After', null);
}
