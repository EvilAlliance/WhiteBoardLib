import { BaseBrush } from './Cursor/BaseBrush';
import { Brush } from './Cursor/Brush';
import { BaseObject } from './Object/BaseObject';
import { SelectionBox } from './Object/SelectionBox';
import { Observable } from './Observable';
import { CanvasParseColor, Color, ColorRGBAToParse } from './Utils/Color';

export type CanvasEvents = {
    'render:Before': null;
    'render:After': null;
    'mouse:down': MouseEvent;
    'mouse:move': MouseEvent;
    'mouse:up': MouseEvent;
}

export class Canvas<T extends BaseBrush = BaseBrush> extends Observable<CanvasEvents> {
    public Canvas: HTMLCanvasElement;
    public ctx: CanvasRenderingContext2D;
    public Objects: BaseObject[] = [];
    public height: number;
    public width: number;
    public cursor: T;
    bgColor: Color = 'White';
    objectSingleRender?: BaseObject;
    selectionBox?: SelectionBox;

    constructor(tag: string | HTMLCanvasElement, width: number, height: number, backgroundColor: Color = 'White', baseBrush: BaseBrush = new Brush()) {
        super();
        if (tag instanceof HTMLCanvasElement) {
            this.Canvas = tag;
        } else {
            const x = document.querySelector(tag);
            if (!(x && x instanceof HTMLCanvasElement)) throw new Error('Element does not exist or Element is not an HTMLCanvasElement');
            this.Canvas = x;
        }

        this.setBrush(baseBrush);

        this.Canvas.width = width;
        this.Canvas.height = height;

        this.ctx = this.Canvas.getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D;

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
            this.cursor.mouseDown(this, e);
        });
        this.on('mouse:move', function(this: Canvas, e) {
            this.cursor.mouseMove(this, e);
        });
        this.on('mouse:up', function(this: Canvas, e) {
            this.cursor.mouseUp(this, e);
        });
    }

    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    addCanvasObject(obj: BaseObject) {
        this.Objects.push(obj);
    }

    addCanvasObjectRender(obj: BaseObject) {
        this.addCanvasObject(obj);
        this.render();
    }

    render() {
        this.ctx.save();
        this.ctx.fillStyle = CanvasParseColor(this.bgColor)
        this.ctx.fillRect(0, 0, this.width, this.height);
        this.ctx.restore();

        this.fire('render:Before', null);
        for (const Object of this.Objects) {
            if (!Object.shouldRender) continue;
            Object.fire('render:Before', null);
            if (this.selectionBox && this.selectionBox.includes(Object)) continue;
            Object.render(this.ctx);
            Object.fire('render:After', null);
        }

        this.renderSingle();
        this.renderSelectionBox();

        this.fire('render:After', null);
    }

    startRenderingSingle(obj: BaseObject) {
        this.objectSingleRender = obj;
        this.clear();
        this.render();
    }

    renderSingle() {
        if (this.objectSingleRender) this.objectSingleRender.render(this.ctx);
    }

    stopRenderingSingle() {
        this.objectSingleRender = undefined;
        this.clear();
        this.render();
    }

    changeBGColor(x: Color) {
        this.bgColor = x;
        if (ColorRGBAToParse(x)[3] !== 1) throw new Error('Tranparency must be of value 1');
        this.render();
    }

    startRenderingSelectionBox(obj: SelectionBox) {
        this.selectionBox = obj;
        this.clear();
        this.render();
    }

    renderSelectionBox() {
        if (this.selectionBox) this.selectionBox.render(this.ctx);
    }

    stopRenderingSelectionBox() {
        this.selectionBox = undefined;
        this.clear();
        this.render();
    }

    /**
     * The canvas must have the the aspect ratio of 1/1 
     * **/
    changeCursor(canvas: HTMLCanvasElement) {
        const w = canvas.height / 2;
        this.Canvas.style.cursor = 'url(' + canvas.toDataURL() + ') ' + w + ' ' + w + ' , auto';
    }

    setBrush(b: BaseBrush) {
        this.cursor = b as T;
        const canvas = b.renderCursor();
        this.changeCursor(canvas);
    }
}
