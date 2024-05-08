import { ORIGIN, Point } from '../GeoSpace/Point';
import { Vector } from '../GeoSpace/Vector';
import { BaseObject } from './BaseObject';
import { BoundingBox } from './BoundingBox';

export class Path extends BaseObject {
    Path: Point[] = [];
    check: Map<number, Point> = new Map();

    constructor(obj: Partial<Path> = {}) {
        super();
        Object.assign(this, obj);
    }

    _drawObject(ctx: CanvasRenderingContext2D): void {
        if (this.Path.length == 0) return;

        if (this.Path.length == 1) {
            const point = this.Path[0];
            ctx.fillStyle = ctx.strokeStyle;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(point.x, point.y, this.ctxSetting.strokeWidth / 2, 0, 2 * Math.PI);
            ctx.fill();
            return;
        }

        ctx.beginPath();
        let p1 = this.Path[0];
        let p2 = this.Path[1];
        ctx.moveTo(p1.x, p1.y);
        for (let i = 1; i < this.Path.length - 1; i++) {
            const vec = new Vector(p1, p2);
            vec.x *= 0.5;
            vec.y *= 0.5;

            const pMid = p1.copy();
            pMid.translate(vec);

            ctx.quadraticCurveTo(p1.x, p1.y, pMid.x, pMid.y);
            p1 = this.Path[i];
            p2 = this.Path[i + 1];
        }
        ctx.lineTo(p2.x, p2.y);

        ctx.stroke();
    }

    _getBoundingBox(): BoundingBox {
        if (this.Path.length == 0) return new BoundingBox(ORIGIN.copy(), ORIGIN.copy(), ORIGIN.copy().translateY(1), ORIGIN.copy().translateX(1).translateY(1));
        const boundingBox = new BoundingBox(this.Path[0].copy(), this.Path[0].copy(), this.Path[0].copy(), this.Path[0].copy());

        for (let i = 1; i < this.Path.length; i++) {
            boundingBox.containPoint(this.Path[i]);
        }

        boundingBox.addPadding(this.ctxSetting.strokeWidth / 2);

        return boundingBox;
    }

    push(...p: Point[]) {
        this.dirty = true;
        return this.Path.push(...p);
    }

    copyWithin(target: number, start: number, end?: number | undefined) {
        this.dirty = true;
        this.Path.copyWithin(target, start, end);
        return this;
    }

    fill(value: Point, start?: number | undefined, end?: number | undefined) {
        this.dirty = true;
        return this.Path.fill(value, start, end);
    }

    pop(): Point | undefined {
        this.dirty = true;
        return this.Path.pop();
    }

    reverse(): Point[] {
        this.dirty = true;
        return this.Path.reverse();
    }

    shift(): Point | undefined {
        this.dirty = true;
        return this.Path.shift();
    }

    splice(start: number, deleteCount?: number | undefined): Point[];
    splice(start: number, deleteCount: number, ...items: Point[]): Point[];
    splice(start: number, deleteCount?: number, ...rest: Point[]): Point[] {
        this.dirty = true;
        if (!deleteCount) return this.Path.splice(start)
        return this.Path.splice(start, deleteCount, ...rest);
    }

    unshift(...items: Point[]): number {
        this.dirty = true;
        return this.Path.unshift(...items);
    }

    getPoint(i: number): Point {
        const x = this.Path[i];
        this.check.set(i, x.copy());
        return x;
    }

    isDirty(): boolean {
        if (super.isDirty()) return true;

        for (const [key, value] of this.check.entries()) {
            if (key >= this.Path.length || value != this.Path[key]) {
                this.check.delete(key);
                return true;
            }
            const x = this.Path[key];
            if (value.x != x.x && value.y != x.y) return true;
        }

        return false;
    }

    checkDelete(i: number): boolean {
        return this.check.delete(i);
    }

    clearCheck() {
        this.check.clear();
    }

    copy(): Path {
        return new Path({
            ctxSetting: this.ctxSetting.copy(),
            ctxTransformation: this.ctxTransformation.copy(),
            Path: this.Path.slice(),
        });
    }

    translate(v: Vector): void {
        this.dirty = true;

        for (let i = 0; i < this.Path.length; i++) {
            this.Path[i].translate(v);
        }
    }
}

