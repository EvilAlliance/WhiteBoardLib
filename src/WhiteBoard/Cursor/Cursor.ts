import { Canvas } from "../Canvas";
import { ORIGIN, Point } from "../GeoSpace/Point";
import { Vector } from "../GeoSpace/Vector";
import { BaseObject } from "../Object/BaseObject";
import { BoundingBox } from "../Object/BoundingBox";
import { SelectionBox } from "../Object/SelectionBox";
import { closestToBase } from "../Utils/CommonMethod";
import { BaseBrush } from "./BaseBrush";

const enum scale {
    x,
    y
}

export class Cursor extends BaseBrush {
    diameter: number = 4;
    move: boolean = false;
    scale: scale[] = [];
    translate: boolean = false;
    lastPoint: Point = ORIGIN.copy();

    mouseDown(canvas: Canvas<this>, e: MouseEvent): void {
        const mousePoint = new Point(e.offsetX, e.offsetY);
        if (canvas.selectionBox) {
            const bb = canvas.selectionBox.getTranformedBoundigBox();
            if (!canvas.selectionBox.pointInside(mousePoint)) {
                canvas.stopRenderingSelectionBox();
                return;
            }
            const l = Math.abs(canvas.selectionBox.distanceBetweenSegmentToPoint(bb.bl, bb.tl, mousePoint)) < 20;
            const r = Math.abs(canvas.selectionBox.distanceBetweenSegmentToPoint(bb.br, bb.tr, mousePoint)) < 20;

            const b = Math.abs(canvas.selectionBox.distanceBetweenSegmentToPoint(bb.bl, bb.br, mousePoint)) < 20;
            const t = Math.abs(canvas.selectionBox.distanceBetweenSegmentToPoint(bb.tl, bb.tr, mousePoint)) < 20;

            (r || l) && this.scale.push(scale.x);
            (b || t) && this.scale.push(scale.y);

            this.translate = t || l;

            this.move = this.scale.length == 0;
        } else {
            this.lastPoint = ORIGIN.copy();

            const objects = canvas.Objects;
            let pointedObject: BaseObject[] = [];

            for (let i = objects.length - 1; i >= 0; i--) {
                if (!(objects[i].shouldRender && objects[i].pointInside(mousePoint))) continue;
                pointedObject.push(objects[i]);
                break;
            }

            if (pointedObject.length != 0)
                canvas.startRenderingSelectionBox(new SelectionBox(pointedObject));
        }

    }

    scaleX(bb: BoundingBox, x: number): number {
        const w = bb.tr.x - bb.tl.x;
        const side = closestToBase(bb.br.x, bb.bl.x, x)
        return (w + ((-side + x)) * (this.translate ? -1 : 1)) / w;
    }

    scaleY(bb: BoundingBox, y: number): number {
        const h = bb.bl.y - bb.tl.y;;
        const side = closestToBase(bb.tl.y, bb.bl.y, y)
        return (h + ((-side + y)) * (this.translate ? -1 : 1)) / h;
    }

    getTranslateVector(oldBB: BoundingBox, newBB: BoundingBox): Vector {
        const oldW = oldBB.tr.x - oldBB.tl.x;
        const newW = newBB.tr.x - newBB.tl.x;

        const oldH = oldBB.bl.y - oldBB.tl.y;
        const newH = newBB.bl.y - newBB.tl.y;

        return new Vector(ORIGIN.copy(), new Point(oldW - newW, oldH - newH));
    }

    mouseMove(canvas: Canvas<this>, e: MouseEvent): void {
        if (!canvas.selectionBox) return;
        if (this.move) {
            if (this.lastPoint.x == 0 && this.lastPoint.y == 0) {
                this.lastPoint = new Point(e.offsetX, e.offsetY);
            } else {
                const mousePoint = new Point(e.offsetX, e.offsetY);
                const v = new Vector(this.lastPoint, mousePoint);
                canvas.selectionBox?.translate(v)
                canvas.clear();
                canvas.render();
                this.lastPoint = mousePoint;
            }
        }

        if (this.scale.length == 0) return;
        console.log(this.scale);

        const bb = canvas.selectionBox.getTranformedBoundigBox() as BoundingBox;

        const scaleX = this.scaleX(bb, e.offsetX);
        const scaleY = this.scaleY(bb, e.offsetY);

        if (this.scale.length == 2) {
            const min = Math.min(scaleX, scaleY);
            canvas.selectionBox.scale(min, min);
        } else {
            canvas.selectionBox.scale(
                +(this.scale[0] != scale.x) || scaleX,
                +(this.scale[0] != scale.y) || scaleY);
        }

        if (this.translate) canvas.selectionBox.translate(this.getTranslateVector(bb, canvas.selectionBox.getTranformedBoundigBox()))
        canvas.clear();
        canvas.render();

    }

    mouseUp(canvas: Canvas<this>, e: MouseEvent): void {
        this.move = false;
        this.scale.splice(0, this.scale.length);
        this.translate = false;
    }
}
