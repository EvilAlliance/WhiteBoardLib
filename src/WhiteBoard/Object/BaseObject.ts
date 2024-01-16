import { Point } from '../GeoSpace/Point';
import { Vector, VectorRotate, VectorTranslatePoint } from '../GeoSpace/Vector';
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
    //this function is not ideal to evey path reason https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fill second example;
    pointInRange(obj: typeof this, mousePoint: Point, width: number, tolerance: number): boolean {
        return BaseObjectPointInRange(obj, mousePoint, width, tolerance);
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
    tr: Point;
    bl: Point;
    br: Point;
}

export function BaseObjectRender<T extends BaseObject>(ctx: CanvasRenderingContext2D, obj: T) {
    ctx.save();

    BaseObjectSettingContext(ctx, obj);

    obj.draw(ctx, obj);

    BaseObjectRenderizeCanvas(ctx, obj);


    ctx.restore();

    for (let i = 0; i < obj.erased.length; i++) {
        BaseObjectRender(ctx, obj.erased[i]);
    }
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

    ctx.transform(
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
    if (obj.shouldFill(obj))
        ctx.fill();
    if (obj.shouldStroke(obj))
        ctx.stroke();
}

export function BaseObjectDraw<T extends BaseObject>(obj: T): CanvasRenderingContext2D {
    const ctx = document.createElement('canvas').getContext('2d') as CanvasRenderingContext2D;

    BaseObjectSettingContext(ctx, obj);

    obj.draw(ctx, obj);

    BaseObjectRenderizeCanvas(ctx, obj);

    return ctx;
}

//this function is not ideal to evey path reason https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fill second example;
export function BaseObjectPointInRange(obj: BaseObject, mousePoint: Point, width: number, tolerance: number): boolean {
    const ctx = BaseObjectDraw(obj);

    while (width > 0) {
        let i = 3;
        while (width * Math.sin(Math.PI / i) > tolerance) {
            i += 1;
        }

        const mod = width / 2;
        const ang = 2 * Math.PI / i;
        const vec = new Vector({ x: 0, y: 0 }, { x: mod * Math.sin(ang), y: mod * Math.cos(ang) });

        const arr = new Array(i);

        for (let j = 0; j < arr.length; j++) {
            const p = Object.assign({}, mousePoint);
            VectorTranslatePoint(vec, p);
            arr[j] = p;
            VectorRotate(vec, ang);
        }

        const inside = arr.some((x) => {
            if (ctx.isPointInPath(x.x, x.y)) {
                return true;
            }
            if (obj.shouldStroke(obj))
                return ctx.isPointInStroke(x.x, x.y);
            return false;
        });

        if (inside) return true;
        width--;
    }

    return false;
}

export function BaseObjectCanvasData(obj: BaseObject): Uint32Array {
    const canvas = document.createElement('canvas');

    const ctx = canvas.getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D;

    const b = obj.getBoundingBox(obj);
    const centerPoint = getCenterPoint(obj.ctxTransformation, b);

    const transformationMat = new DOMMatrix();

    transformationMat.a = obj.ctxTransformation.scaleX;
    transformationMat.b = obj.ctxTransformation.skewY;
    transformationMat.c = obj.ctxTransformation.skewX;
    transformationMat.d = obj.ctxTransformation.scaleY;
    transformationMat.e = centerPoint.x;
    transformationMat.f = centerPoint.y;

    transformationMat.rotateSelf(obj.ctxTransformation.angle / Math.PI * 180);
    transformationMat.translateSelf(-centerPoint.x, -centerPoint.y);

    const tlT = new DOMPointReadOnly(b.tl.x, b.tl.y).matrixTransform(transformationMat);
    const trT = new DOMPointReadOnly(b.tr.x, b.tr.y).matrixTransform(transformationMat);
    const blT = new DOMPointReadOnly(b.bl.x, b.bl.y).matrixTransform(transformationMat);
    const brT = new DOMPointReadOnly(b.br.x, b.br.y).matrixTransform(transformationMat);

    const tl = new Point(
        Math.min(tlT.x, trT.x, blT.x, brT.x),
        Math.min(tlT.y, trT.y, blT.y, brT.y)
    )

    const br = new Point(
        Math.max(tlT.x, trT.x, blT.x, brT.x),
        Math.max(tlT.y, trT.y, blT.y, brT.y)
    )

    canvas.width = br.x - tl.x;
    canvas.height = br.y - tl.y;

    ctx.translate(-tl.x, -tl.y);

    ctx.save();

    BaseObjectSettingContext(ctx, obj);


    obj.draw(ctx, obj);

    BaseObjectRenderizeCanvas(ctx, obj);

    ctx.restore();

    for (let i = 0; i < obj.erased.length; i++) {
        BaseObjectRender(ctx, obj.erased[i]);
    }

    return new Uint32Array(ctx.getImageData(0, 0, canvas.width, canvas.height).data.buffer);
}

export const OriginXY = Object.freeze({
    top: 0,
    left: 0,
    center: 0.5,
    right: 1,
    bottom: 1,
});

export function getCenterPoint(origin: { originX: 'left' | 'center' | 'right' | number, originY: 'top' | 'center' | 'bottom' | number }, { tl }: BoundingBox): Point {
    const x = OriginXY[(origin.originX ?? 'left') as keyof typeof OriginXY] ?? origin.originX;
    const y = OriginXY[(origin.originY ?? 'top') as keyof typeof OriginXY] ?? origin.originY;
    return {
        x: tl.x + tl.x * x,
        y: tl.y + tl.y * y,
    };
}
