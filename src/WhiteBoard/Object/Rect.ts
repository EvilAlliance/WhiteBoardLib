import { BaseObject, BoundingBox } from './BaseObject';
import { DeepPartial } from '../Type';
import { Point } from '../GeoSpace/Point';
const kRect = 1 - 0.5522847498;

export class Rect extends BaseObject {
    public width: number = 0;
    public height: number = 0;
    public top: number = 0;
    public left: number = 0;
    public rx: number = 0;
    public ry: number = 0;
    constructor(obj: DeepPartial<Rect>) {
        super();
        RectUpdateRxRy(obj);
        Object.assign(this, obj);
    }

    draw(ctx: CanvasRenderingContext2D, obj: this): void {
        RectDraw(ctx, obj);
    }

    getBoundingBox(obj: this): BoundingBox {
        return RectGetBoundingBox(obj);
    }
}

function RectUpdateRxRy(obj: { rx?: number, ry?: number }) {
    if (obj.rx && !obj.ry) {
        obj.ry = obj.rx;
    } else if (obj.ry && !obj.rx) {
        obj.rx = obj.ry;
    }
}

export function RectDraw(ctx: CanvasRenderingContext2D, rect: Rect) {
    const {
        width,
        rx,
        ry,
        height,
        left,
        top
    } = rect;

    ctx.beginPath();

    ctx.moveTo(left + rx, top);

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

    ctx.restore();
}

export function RectGetBoundingBox(obj: Rect): BoundingBox {
    const thick = obj.ctxSetting.strokeWidth / 2;
    const tl = new Point(obj.left - thick, obj.top - thick);
    const br = new Point(obj.left + obj.width + thick, obj.top + obj.height + thick);
    return { tl, br };
}
