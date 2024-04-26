import CommonMethod from '../CommonMethod';
import { Point } from '../GeoSpace/Point';
import { BoundingBox } from './BoundingBox';

export const OriginXY = Object.freeze({
    top: 0,
    left: 0,
    center: 0.5,
    right: 1,
    bottom: 1,
});

export class CtxTransformation extends CommonMethod {
    originX: 'left' | 'center' | 'right' | number = 'center';
    originY: 'top' | 'center' | 'bottom' | number = 'center';
    skewY: number = 0;
    skewX: number = 0;
    scaleY: number = 1;
    scaleX: number = 1;
    angle: number = 0;
    dirty: boolean = true;

    constructor(obj?: Partial<CtxTransformation>) {
        super();
        Object.assign(this, obj);
    }

    setContextTransformation(ctx: CanvasRenderingContext2D, boundingBox: BoundingBox) {
        const centerPoint = this.getCenterPoint(boundingBox);

        ctx.transform(
            this.scaleX,
            this.skewY,
            this.skewX,
            this.scaleY,
            centerPoint.x,
            centerPoint.y
        );

        ctx.rotate(this.angle);

        ctx.translate(-centerPoint.x, -centerPoint.y);
    }

    getTransformationMatrix(boundingBox: BoundingBox) {
        const centerPoint = this.getCenterPoint(boundingBox);

        const transformationMat = new DOMMatrix();

        transformationMat.a = this.scaleX;
        transformationMat.b = this.skewY;
        transformationMat.c = this.skewX;
        transformationMat.d = this.scaleY;
        transformationMat.e = centerPoint.x;
        transformationMat.f = centerPoint.y;

        transformationMat.rotateSelf(this.angle / Math.PI * 180);
        transformationMat.translateSelf(-centerPoint.x, -centerPoint.y);

        return transformationMat;
    }

    getCenterPoint({ tl, br }: BoundingBox): Point {
        const heigth = br.y - tl.y;
        const width = br.x - tl.x;
        const x = OriginXY[this.originX as keyof typeof OriginXY] ?? this.originX;
        const y = OriginXY[this.originY as keyof typeof OriginXY] ?? this.originY;
        return new Point(tl.x + width * x, tl.y + heigth * y,);
    }

    copy(): CtxTransformation {
        return new CtxTransformation(this);
    }

    set<T extends keyof this>(key: Partial<this> | T, value?: this[T] | undefined): this {
        this.dirty = true;
        return super.set(key, value);
    }
}
