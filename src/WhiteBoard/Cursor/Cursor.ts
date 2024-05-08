import { Canvas } from "../Canvas";
import { ORIGIN, Point } from "../GeoSpace/Point";
import { Vector } from "../GeoSpace/Vector";
import { BaseObject } from "../Object/BaseObject";
import { BoundingBox } from "../Object/BoundingBox";
import { SelectionBox } from "../Object/SelectionBox";
import { BaseBrush } from "./BaseBrush";

export class Cursor extends BaseBrush {
    diameter: number = 4;
    move: boolean = false;
    scaleXP: boolean = false;
    scaleXN: boolean = false;
    scaleYP: boolean = false;
    scaleYN: boolean = false;
    lastPoint: Point = ORIGIN.copy();

    mouseDown(canvas: Canvas<this>, e: MouseEvent): void {
        const mousePoint = new Point(e.offsetX, e.offsetY);
        if (canvas.selectionBox) {
            const bb = canvas.selectionBox.getTranformedBoundigBox();
            if (!canvas.selectionBox.pointInside(mousePoint)) {
                canvas.stopRenderingSelectionBox();
                return;
            }
            if (Math.abs(canvas.selectionBox.distanceBetweenSegmentToPoint(bb.bl, bb.tl, mousePoint)) < 20) {
                this.scaleXN = true;
            }
            if (Math.abs(canvas.selectionBox.distanceBetweenSegmentToPoint(bb.br, bb.tr, mousePoint)) < 20) {
                this.scaleXP = true;
            }
            if (Math.abs(canvas.selectionBox.distanceBetweenSegmentToPoint(bb.bl, bb.br, mousePoint)) < 20) {
                this.scaleYP = true;
            }
            if (Math.abs(canvas.selectionBox.distanceBetweenSegmentToPoint(bb.tl, bb.tr, mousePoint)) < 20) {
                this.scaleYN = true;
            }
            if (!(this.scaleYN || this.scaleYP || this.scaleXP || this.scaleXN))
                this.move = true;
        } else {
            this.lastPoint = ORIGIN.copy();

            const objects = canvas.Objects;
            let pointedObject: BaseObject[] = [];

            for (let i = objects.length - 1; i >= 0; i--) {
                if (!objects[i].pointInside(mousePoint)) continue;
                pointedObject.push(objects[i]);
                break;
            }

            if (pointedObject.length != 0)
                canvas.startRenderingSelectionBox(new SelectionBox(pointedObject));
        }

    }

    mouseMove(canvas: Canvas<this>, e: MouseEvent): void {
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
        } if (this.scaleXP) {
            const mousePoint = new Point(e.offsetX, e.offsetY);
            const bb = canvas.selectionBox?.getTranformedBoundigBox() as BoundingBox;
            const w = Math.max(bb.tr.x - bb.tl.x, bb.br.x - bb.bl.x);
            const scale = (w - Math.max(bb.br.x, bb.tr.x) + mousePoint.x) / w;
            canvas.selectionBox?.scale(scale, 1)
            canvas.clear();
            canvas.render();
        } if (this.scaleXN) {
            const mousePoint = new Point(e.offsetX, e.offsetY);
            const bb = canvas.selectionBox?.getTranformedBoundigBox() as BoundingBox;
            const w = Math.max(bb.tr.x - bb.tl.x, bb.br.x - bb.bl.x);
            const scale = (w + Math.min(bb.bl.x, bb.tl.x) - mousePoint.x) / w;

            if (scale == 0) return;
            canvas.selectionBox?.scale(scale, 1)
            const newBB = canvas.selectionBox?.getTranformedBoundigBox() as BoundingBox;
            const newW = Math.max(newBB.tr.x - newBB.tl.x, newBB.br.x - newBB.bl.x);
            canvas.selectionBox?.translate(new Vector(ORIGIN.copy(), new Point(w - newW, 0)));
            canvas.clear();
            canvas.render();
        } if (this.scaleYP) {
            const mousePoint = new Point(e.offsetX, e.offsetY);
            const bb = canvas.selectionBox?.getTranformedBoundigBox() as BoundingBox;
            const h = Math.max(bb.bl.y - bb.tl.y, bb.br.y - bb.tr.y);
            const scale = (h - Math.max(bb.br.y, bb.bl.y) + mousePoint.y) / h;
            canvas.selectionBox?.scale(1, scale)
            canvas.clear();
            canvas.render();
        } if (this.scaleYN) {
            const mousePoint = new Point(e.offsetX, e.offsetY);
            const bb = canvas.selectionBox?.getTranformedBoundigBox() as BoundingBox;
            const h = Math.max(bb.bl.y - bb.tl.y, bb.br.y - bb.tr.y);
            const scale = (h + Math.min(bb.tr.y, bb.tl.y) - mousePoint.y) / h;

            if (scale == 0) return;
            canvas.selectionBox?.scale(1, scale)
            const newBB = canvas.selectionBox?.getTranformedBoundigBox() as BoundingBox;
            const newH = Math.max(newBB.bl.y - newBB.tl.y, newBB.br.y - newBB.tr.y);
            canvas.selectionBox?.translate(new Vector(ORIGIN.copy(), new Point(0, h - newH)));
            canvas.clear();
            canvas.render();
        }
    }

    mouseUp(canvas: Canvas<this>, e: MouseEvent): void {
        this.move = false;
        this.scaleXP = false;
        this.scaleXN = false;
        this.scaleYP = false;
        this.scaleYN = false;
    }
}
