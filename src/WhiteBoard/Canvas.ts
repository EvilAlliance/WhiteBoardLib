import { BaseBrush } from './Cursor/BaseBrush';
import { Brush } from './Cursor/Brush';
import { BaseObject } from './Object/BaseObject';
import { CanvasObjectContainer } from './Object/CanvasObjectContainer';
import { Observable } from './Observable';
import { CanvasParseColor, Color } from './Utils/Color';

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
    public Objects: CanvasObjectContainer[] = [];
    public height: number;
    public width: number;
    public cursor: T;
    bgColor: Color = 'White';

    constructor(tag: string | HTMLCanvasElement, width: number, height: number, backgroundColor: Color = 'White', baseBrush: BaseBrush<any> = new Brush()) {
        super();
        if (tag instanceof HTMLCanvasElement) {
            this.Canvas = tag;
        } else {
            const x = document.querySelector(tag);
            if (!(x && x instanceof HTMLCanvasElement)) throw new Error('Element does not exist or Element is not an HTMLCanvasElement');
            this.Canvas = x as HTMLCanvasElement;
        }

        this.setBrush(baseBrush);

        this.Canvas.width = width;
        this.Canvas.height = height;

        this.ctx = this.Canvas.getContext('2d') as CanvasRenderingContext2D;

        this.width = width;
        this.height = height;

        this.changeBGColor(backgroundColor);

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
            this.cursor.init(this, e);
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
            Object.fire('render:Before', null);
            if (!Object.render) continue;
            Object.Object.render(this.ctx);
            Object.fire('render:After', null);
        }
        this.fire('render:After', null);
    }

    changeBGColor(x: Color) {
        this.bgColor = x;
        this.Canvas.style.backgroundColor = CanvasParseColor(x);
    }

    /**
     * The canvas must have the the aspect ratio of 1/1 
     * **/
    changeCursor(canvas: HTMLCanvasElement) {
        const w = canvas.height / 2;
        this.Canvas.style.cursor = 'url(' + canvas.toDataURL() + ') ' + w + ' ' + w + ' , auto';
    }

    setBrush(b: BaseBrush<any>) {
        this.cursor = b as T;
        const canvas = b.renderCursor();
        this.changeCursor(canvas);
    }
}
