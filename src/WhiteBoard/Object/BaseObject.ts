import { Point } from '../GeoSpace/Point';
import { CanvasParseColor, Color } from '../Utils/Color';
import { Path } from './Path';

export abstract class BaseObject {
    ctxTransformation: CtxTransformation = new CtxTransformation();
    ctxSetting: CtxSetting = new CtxSetting();
    erased: Path[] = [];
    abstract draw(ctx: CanvasRenderingContext2D, obj: typeof this): void;
    abstract getBoundingBox(obj: typeof this): BoundingBox;
    shouldFill(obj: typeof this): boolean {
        return obj.ctxSetting.fill;
    }
    shouldStroke(obj: typeof this): boolean {
        return obj.ctxSetting.strokeWidth != 0;
    }
}

export class CtxTransformation {
    originX: 'left' | 'center' | 'right' | number = 'left';
    originY: 'top' | 'center' | 'bottom' | number = 'top';
    skewY: number = 0;
    skewX: number = 0;
    scaleY: number = 1;
    scaleX: number = 1;
    angle: number = 0;
    constructor(obj?: Partial<CtxTransformation>) {
        Object.assign(this, obj);
    }
}

export class CtxSetting {
    lineCap: CanvasLineCap = 'round';
    strokeWidth: number = 0;
    strokeColor: Color = 'Red';
    fill: boolean = false;
    fillColor: Color = 'Red';
    globalCompositeOperation: GlobalCompositeOperation = 'source-over';
    constructor(obj?: Partial<CtxSetting>) {
        Object.assign(this, obj);
    }
}

export interface BoundingBox {
    tl: Point;
    br: Point;
}

export function BaseObjectRender<T extends BaseObject>(ctx: CanvasRenderingContext2D, obj: T) {
    ctx.save();

    BaseObjectSettingContext(ctx, obj);

    obj.draw(ctx, obj);

    BaseObjectRenderizeCanvas(ctx, obj);


    for (let i = 0; i < obj.erased.length; i++) {
        BaseObjectRender(ctx, obj.erased[i]);
    }

    ctx.restore();
}



export function CtxSettingSetContextOption(ctx: CanvasRenderingContext2D, obj: CtxSetting) {
    ctx.lineCap = obj.lineCap;
    ctx.lineWidth = obj.strokeWidth;
    ctx.strokeStyle = CanvasParseColor(obj.strokeColor);

    ctx.fillStyle = CanvasParseColor(obj.fillColor);

    ctx.globalCompositeOperation = obj.globalCompositeOperation;
}

export function CtxTransformationSetContextTransformation(ctx: CanvasRenderingContext2D, obj: CtxTransformation, boundingBox: BoundingBox) {
    const centerPoint = getCenterPoint(obj, boundingBox);

    ctx.setTransform(
        obj.scaleX,
        obj.skewY,
        obj.skewX,
        obj.scaleY,
        centerPoint.x,
        centerPoint.y
    );
    ctx.rotate(obj.angle);
    ctx.translate(-centerPoint.x, -centerPoint.y);
}

export function BaseObjectSettingContext<T extends BaseObject>(ctx: CanvasRenderingContext2D, obj: T) {
    CtxSettingSetContextOption(ctx, obj.ctxSetting);
    CtxTransformationSetContextTransformation(ctx, obj.ctxTransformation, obj.getBoundingBox(obj));
}

export function BaseObjectRenderizeCanvas<T extends BaseObject>(ctx: CanvasRenderingContext2D, obj: T) {
    if (obj.shouldStroke(obj))
        ctx.stroke();
    if (obj.shouldFill(obj))
        ctx.fill();
}

export function BaseClosedObjectDraw<T extends BaseObject>(ctx: CanvasRenderingContext2D, obj: T) {
    ctx.save();

    BaseObjectSettingContext(ctx, obj);

    obj.draw(ctx, obj);

    ctx.restore();
}

export const OriginXY = Object.freeze({
    top: 0,
    left: 0,
    center: 0.5,
    right: 1,
    bottom: 1,
});

export function getCenterPoint(origin: { originX: 'left' | 'center' | 'right' | number, originY: 'top' | 'center' | 'bottom' | number }, { tl }: BoundingBox): Point {
    const x = OriginXY[origin.originX as keyof typeof OriginXY] ?? origin.originX;
    const y = OriginXY[origin.originY as keyof typeof OriginXY] ?? origin.originY;
    return {
        x: tl.x + tl.x * x,
        y: tl.y + tl.y * y,
    };
}
