import { BaseBrush, BaseBrushMouseDown } from './Cursor/BaseBrush';
import { Brush } from './Cursor/Brush';
import { BaseObject, BaseObjectRender } from './Object/BaseObject';
import { CanvasObjectContainer, CanvasObjectContainerEvent } from './Object/CanvasObjectContainer';
import { Observable, TEventCallback } from './Observable';

export type CanvasEvents = {
    'render:Before': null;
    'render:After': null;
    'mouse:down': MouseEvent;
    'mouse:move': MouseEvent;
    'mouse:up': MouseEvent;
}

export class Canvas<T extends BaseBrush<any> = BaseBrush<any>> extends Observable<CanvasEvents> {
    public Canvas: HTMLCanvasElement;
    public ctx: CanvasRenderingContext2D;
    public Objects: CanvasObjectContainer[];
    public height: number;
    public width: number;
    public cursor: T;

    constructor(tag: string | HTMLCanvasElement, width: number, height: number, baseBrush: BaseBrush<any> = new Brush()) {
        super();
        if (tag instanceof HTMLCanvasElement) {
            this.Canvas = tag;
        } else {
            const x = document.querySelector(tag);
            if (!(x && x instanceof HTMLCanvasElement)) throw new Error('Element does not exist or Element is not an HTMLCanvasElement');
            this.Canvas = x as HTMLCanvasElement;
        }

        this.cursor = baseBrush as T;

        this.Canvas.width = width;
        this.Canvas.height = height;

        this.ctx = this.Canvas.getContext('2d') as CanvasRenderingContext2D;

        this.width = width;
        this.height = height;

        this.Objects = [];

        this.eventListener = {} as Record<keyof CanvasEvents, TEventCallback<CanvasEvents[keyof CanvasEvents]>[]>;

        this.Canvas.addEventListener('mousedown', (e) => {
            this.fire('mouse:down', e);
        });

        this.Canvas.addEventListener('mousemove', (e) => {
            this.fire('mouse:move', e);
        });

        this.Canvas.addEventListener('mouseup', (e) => {
            this.fire('mouse:up', e);
        });

        this.on('mouse:down', function(this: Canvas, e) {
            BaseBrushMouseDown(this, e);
        });
    }

    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    addCanvasObject(obj: BaseObject) {
        this.Objects.push(new CanvasObjectContainer(obj));
    }

    addCanvasObjectRender(obj: BaseObject) {
        this.addCanvasObject(obj);
        this.render();
    }

    addCanvasObjectContainer(obj: CanvasObjectContainer) {
        this.Objects.push(obj);
    }

    CanvasAddCanvasObjectContainerRender(obj: CanvasObjectContainer) {
        this.addCanvasObjectContainer(obj);
        this.render();
    }

    render() {
        this.fire('render:Before', null);
        for (const Object of this.Objects) {
            fire<CanvasObjectContainerEvent, 'render:Before'>(Object, 'render:Before', null);
            if (!Object.render) continue;
            BaseObjectRender(this.ctx, Object.Object);
            fire<CanvasObjectContainerEvent, 'render:After'>(Object, 'render:After', null);
        }
        this.fire('render:After', null);
    }
}
