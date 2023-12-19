import { Canvas } from './../Canvas';
import { setDefault } from '../CommonMethod';
import { CanvasParseColor, Color, ColorString } from '../Utils/Color';
const kRect = 1 - 0.5522847498;

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

export class Rect {
    public strokeWidth: number;
    public width: number;
    public height: number;
    public top: number;
    public left: number;
    public fill: boolean;
    public fillColor: Color;
    public strokeColor: Color;
    public originX: 'left' | 'center' | 'right' | number;
    public originY: 'top' | 'center' | 'bottom' | number;
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
        setDefault<Rect>(this, obj as Rect);
    }
}

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

export function RectRender(canvas: Canvas, rect: Rect) {
    const { ctx } = canvas;
    const {
        scaleX,
        scaleY,
        width,
        height,
        ry,
        rx,
        strokeWidth,
        angle,
        skewX,
        skewY,
    } = rect;
    let { left, top } = rect;

    const { centerX, centerY } = getCenter(rect);

    ctx.save();

    ctx.beginPath();
    ctx.arc(left, top, 5, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fillStyle = 'red';
    ctx.fill();

    ctx.setTransform(
        scaleX,
        (skewY * Math.PI) / 180,
        (skewX * Math.PI) / 180,
        scaleY,
        left,
        top,
    );
    ctx.rotate((angle * Math.PI) / 180);
    ctx.translate(-left, -top);

    left -= centerX;
    top -= centerY;

    ctx.strokeStyle = CanvasParseColor(rect.strokeColor);
    ctx.lineWidth = strokeWidth;

    ctx.moveTo(left + rx, top);

    ctx.beginPath();

    ctx.lineTo(left + width - rx, top);
    ctx.bezierCurveTo(
        left + width - rx * kRect,
        top,
        left + width,
        top + ry * kRect,
        left + width,
        top + ry,
    );

    ctx.lineTo(left + width, top + height - ry);
    ctx.bezierCurveTo(
        left + width,
        top + height - ry * kRect,
        left + width - rx * kRect,
        top + height,
        left + width - rx,
        top + height,
    );

    ctx.lineTo(left + rx, top + height);
    ctx.bezierCurveTo(
        left + rx * kRect,
        top + height,
        left,
        top + height - ry * kRect,
        left,
        top + height - ry,
    );

    ctx.lineTo(left, top + ry);
    ctx.bezierCurveTo(
        left,
        top + ry * kRect,
        left + rx * kRect,
        top,
        left + rx,
        top,
    );

    ctx.closePath();
    ctx.stroke();

    if (rect.fill) {
        ctx.fillStyle = CanvasParseColor(rect.fillColor);
        ctx.fill();
    }

    ctx.restore();
}

export const OriginXY = Object.freeze({
    top: 0,
    left: 0,
    center: 0.5,
    right: 1,
    bottom: 1,
});

export function getCenter(obj: Rect) {
    const x = OriginXY[obj.originX as keyof typeof OriginXY] ?? obj.originX;
    const y = OriginXY[obj.originY as keyof typeof OriginXY] ?? obj.originY;
    return {
        centerX: obj.width * x,
        centerY: obj.height * y,
    };
}
