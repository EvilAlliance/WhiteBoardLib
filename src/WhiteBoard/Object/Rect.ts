import { Canvas } from './../Canvas';
import { setOption } from '../CommonMethod';
import { CanvasParseColor, Color } from '../Utils/Color';
const kRect = 1 - 0.5522847498;

export class Rect {
    public strokeWidth: number = 0;
    public width: number = 0;
    public height: number = 0;
    public top: number = 0;
    public left: number = 0;
    public fill: boolean;
    public fillColor: Color = 'Red';
    public strokeColor: Color = 'Red';
    public originX: 'left' | 'center' | 'right' | number = 'left';
    public originY: 'top' | 'center' | 'bottom' | number = 'top';
    public skewY: number = 0;
    public skewX: number = 0;
    public scaleY: number = 1;
    public scaleX: number = 1;
    public angle: number = 0;
    public rx: number = 0;
    public ry: number = 0;
    constructor(obj: Partial<Rect>) {
        RectUpdateRxRy(obj);
        setOption<Rect>(this, obj);
        RectUpdateWidthHeight(this);
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
