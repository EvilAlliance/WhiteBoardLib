import { setDefault } from '../CommonMethod';
import Colors from './../Constantes/Colors.json';
const kRect = 1 - 0.5522847498;

export class Rect {
    public strokeWidth: number;
    public width: number;
    public height: number;
    public top: number;
    public left: number;
    public fill: boolean;
    public fillColor: keyof typeof Colors | string;
    public strokeColor: keyof typeof Colors | string;
    public originX: 'left' | 'center' | 'right';
    public originY: 'top' | 'center' | 'bottom';
    public skewY: number;
    public skewX: number;
    public scaleY: number;
    public scaleX: number;
    public angle: number;
    public rx: number;
    public ry: number;
    constructor(obj: Partial<Rect>) {
        RectUpdateRxRy(obj as Rect);
        setDefault<Rect>(obj, RectDefault);
        RectUpdateWidthHeight(obj as Rect);
        this.strokeWidth = obj.strokeWidth as number;
        this.width = obj.width as number;
        this.height = obj.height as number;
        this.top = obj.top as number;
        this.left = obj.left as number;
        this.fill = obj.fill as boolean;
        this.fillColor = obj.fillColor as string;
        this.strokeColor = obj.strokeColor as string;
        this.originX = obj.originX as ('left');
        this.originY = obj.originY as ('top');
        this.skewY = obj.skewY as number;
        this.skewX = obj.skewX as number;
        this.scaleY = obj.scaleY as number;
        this.scaleX = obj.scaleX as number;
        this.angle = obj.angle as number;
        this.rx = obj.rx as number;
        this.ry = obj.ry as number;
    }
}

const RectDefault: Rect = Object.freeze({
    strokeWidth: 0,
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    fill: false,
    fillColor: 'Red',
    strokeColor: 'Red',
    originX: 'left',
    originY: 'top',
    skewX: 0,
    skewY: 0,
    scaleX: 1,
    scaleY: 1,
    angle: 0,
    rx: 0,
    ry: 0,
});

function RectUpdateRxRy(obj: { rx?: number, ry?: number }) {
    if (obj.rx && !obj.ry) {
        obj.ry = obj.rx;
    } else if (obj.ry && !obj.rx) {
        obj.rx = obj.ry;
    }
}

function RectUpdateWidthHeight(obj: { width: number, height: number, strokeWidth: number }) {
    obj.width = obj.width + obj.strokeWidth / 2;
    obj.height = obj.height + obj.strokeWidth / 2;
}
