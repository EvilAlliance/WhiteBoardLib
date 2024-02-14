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
    pointInRange(obj: typeof this, mousePoint: Point, width: number, tolerance: number): Point | null {
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
export function BaseObjectPointInRange(obj: BaseObject, mousePoint: Point, width: number, tolerance: number): Point | null {
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

        for (let j = 0; j < arr.length; j++) {

            if (obj.shouldFill(obj) && ctx.isPointInPath(arr[j].x, arr[j].y) || obj.shouldStroke(obj) && ctx.isPointInStroke(arr[j].x, arr[j].y))
                return arr[j];
        }

        width--;
    }

    return null;
}

export function BaseObjectCanvasData(obj: BaseObject, { tl, tr, bl, br }: BoundingBox = BaseObjectGetBoundingBoxTransformed(obj)): ImageData {
    const canvas = document.createElement('canvas');

    const ctx = canvas.getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D;

    const canvasTL = new Point(
        Math.min(tl.x, tr.x, bl.x, br.x),
        Math.min(tl.y, tr.y, bl.y, br.y)
    );

    const canvasBR = new Point(
        Math.max(tl.x, tr.x, bl.x, br.x),
        Math.max(tl.y, tr.y, bl.y, br.y)
    );

    canvas.width = canvasBR.x - canvasTL.x;
    canvas.height = canvasBR.y - canvasTL.y;

    ctx.translate(-canvasTL.x, -canvasTL.y);

    ctx.save();

    BaseObjectSettingContext(ctx, obj);


    obj.draw(ctx, obj);

    BaseObjectRenderizeCanvas(ctx, obj);

    ctx.restore();

    for (let i = 0; i < obj.erased.length; i++) {
        BaseObjectRender(ctx, obj.erased[i]);
    }

    return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

export function BaseObjectGetBoundingBoxTransformed(obj: BaseObject, b: BoundingBox = obj.getBoundingBox(obj), transformationMat: DOMMatrix = BaseObjectGetTransformationMatrix(obj, b)): BoundingBox {
    return {
        tl: new DOMPointReadOnly(b.tl.x, b.tl.y).matrixTransform(transformationMat),
        tr: new DOMPointReadOnly(b.tr.x, b.tr.y).matrixTransform(transformationMat),
        bl: new DOMPointReadOnly(b.bl.x, b.bl.y).matrixTransform(transformationMat),
        br: new DOMPointReadOnly(b.br.x, b.br.y).matrixTransform(transformationMat)
    };
}

export function BaseObjectGetTransformationMatrix(obj: BaseObject, boundingBox: BoundingBox = obj.getBoundingBox(obj)): DOMMatrix {
    const centerPoint = getCenterPoint(obj.ctxTransformation, boundingBox);

    const transformationMat = new DOMMatrix();

    transformationMat.a = obj.ctxTransformation.scaleX;
    transformationMat.b = obj.ctxTransformation.skewY;
    transformationMat.c = obj.ctxTransformation.skewX;
    transformationMat.d = obj.ctxTransformation.scaleY;
    transformationMat.e = centerPoint.x;
    transformationMat.f = centerPoint.y;

    transformationMat.rotateSelf(obj.ctxTransformation.angle / Math.PI * 180);
    transformationMat.translateSelf(-centerPoint.x, -centerPoint.y);

    return transformationMat;
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
