import { Canvas } from "../Canvas";
import { ORIGIN, Point } from "../GeoSpace/Point";
import { Vector } from "../GeoSpace/Vector";
import { BaseObject } from "../Object/BaseObject";
import { BoundingBox } from "../Object/BoundingBox";
import { SelectionBox } from "../Object/SelectionBox";
import { distanceBetweenSegmentToPoint } from "../Utils/CommonMethod";
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
    rotating: boolean = false;
    lastPoint: Point = ORIGIN.copy();

    mouseDown(canvas: Canvas<this>, e: MouseEvent): void {
        const mousePoint = new Point(e.offsetX, e.offsetY);
        if (canvas.selectionBox) {
            const bb = canvas.selectionBox.getTranformedBoundigBox();
            const l = distanceBetweenSegmentToPoint(bb.bl, bb.tl, mousePoint) < 10;
            const r = distanceBetweenSegmentToPoint(bb.br, bb.tr, mousePoint) < 10;

            const b = distanceBetweenSegmentToPoint(bb.bl, bb.br, mousePoint) < 10;
            const t = distanceBetweenSegmentToPoint(bb.tl, bb.tr, mousePoint) < 10;

            (r || l) && this.scale.push(scale.x);
            (b || t) && this.scale.push(scale.y);

            (this.translate = t || l);

            const insideRotate = (this.rotating = canvas.selectionBox.insideRotate(mousePoint));

            (this.move = this.scale.length == 0 && canvas.selectionBox.pointInside(mousePoint) && !canvas.selectionBox.insideRotate(mousePoint)) && canvas.changeCursor('grabbing');

            if ((!(l || r || t || b || insideRotate || this.move))) {
                canvas.changeCursor('default');
                canvas.stopRenderingSelectionBox();
            } else if (this.move || insideRotate) {
                this.lastPoint = mousePoint;
            } else {
                this.lastPoint = bb.clostestProjectionInSide(mousePoint)
            }
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

    scaleX(w: number, proj: number, x: number): number {
        return (w + ((-proj + x)) * (this.translate ? -1 : 1)) / w;
    }

    scaleY(h: number, proj: number, y: number): number {
        return (h + ((-proj + y)) * (this.translate ? -1 : 1)) / h;
    }

    getTranslateVector(oldBB: BoundingBox, newBB: BoundingBox): Vector {
        const oldW = oldBB.tr.x - oldBB.tl.x;
        const newW = newBB.tr.x - newBB.tl.x;

        const oldH = oldBB.bl.y - oldBB.tl.y;
        const newH = newBB.bl.y - newBB.tl.y;

        return new Vector(ORIGIN.copy(), new Point(oldW - newW, oldH - newH));
    }

    rotateSelectionBox(canvas: Canvas, { offsetX, offsetY }: MouseEvent) {
        if (!canvas.selectionBox) return;
        const mousePoint = new Point(offsetX, offsetY);

        const bb = canvas.selectionBox.getBoundingBox();
        const centerPoint = canvas.selectionBox.ctxTransformation.getCenterPoint(bb).transform(canvas.selectionBox.ctxTransformation.getTransformationMatrix(bb));

        const v1 = new Vector(centerPoint, this.lastPoint);

        const v2 = new Vector(centerPoint, mousePoint);
        const rad = v2.phase() - v1.phase();
        console.log(rad, v2.phase(), v1.phase())

        canvas.selectionBox.rotate(rad);
        canvas.clear();
        canvas.render();
    }

    mouseMove(canvas: Canvas<this>, e: MouseEvent): void {
        const mousePoint = new Point(e.offsetX, e.offsetY);

        if (!canvas.selectionBox) {
            const objects = canvas.Objects;
            for (let i = objects.length - 1; i >= 0; i--) {
                if (!(objects[i].shouldRender && objects[i].getTranformedBoundigBox().pointInside(mousePoint))) continue;
                canvas.changeCursor('pointer')
                return;
            }
            canvas.changeCursor('default');
            return;
        }


        if (this.rotating) this.rotateSelectionBox(canvas, e);

        if (this.move) this.translateSelectionBox(canvas, e);

        if (this.scale.length != 0) this.scaleSelectionBox(canvas, e);

        if (this.move || this.scale.length != 0) {
            canvas.clear();
            canvas.render();
        }

        const bb = canvas.selectionBox.getTranformedBoundigBox();

        const l = distanceBetweenSegmentToPoint(bb.bl, bb.tl, mousePoint) < 10;
        const r = distanceBetweenSegmentToPoint(bb.br, bb.tr, mousePoint) < 10;

        const b = distanceBetweenSegmentToPoint(bb.bl, bb.br, mousePoint) < 10;
        const t = distanceBetweenSegmentToPoint(bb.tl, bb.tr, mousePoint) < 10;

        const grab = canvas.selectionBox.pointInside(mousePoint) && !this.move;

        const insideRotate = canvas.selectionBox.insideRotate(mousePoint);

        (l || r) && canvas.changeCursor('ew-resize');
        (t || b) && canvas.changeCursor('ns-resize');
        ((t && l) || (b && r)) && canvas.changeCursor('nwse-resize');
        ((t && r) || (b && l)) && canvas.changeCursor('nesw-resize');
        insideRotate && canvas.changeCursor('crosshair');

        (!(l || r || t || b || insideRotate)) && grab && canvas.changeCursor('grab');
        (!(l || r || t || b || grab || this.move || insideRotate)) && canvas.changeCursor('default');
    }

    scaleSelectionBox(canvas: Canvas, { offsetX, offsetY }: MouseEvent) {
        if (!canvas.selectionBox) return;

        const bb = canvas.selectionBox.getTranformedBoundigBox() as BoundingBox;

        const scaleX = this.scaleX(canvas.selectionBox.getWidth(), this.lastPoint.x, offsetX);
        const scaleY = this.scaleY(canvas.selectionBox.getHeigth(), this.lastPoint.y, offsetY);

        if (this.scale.length == 2) {
            const min = Math.min(scaleX, scaleY);
            canvas.selectionBox.scale(min, min);
        } else {
            canvas.selectionBox.scale(
                +(this.scale[0] != scale.x) || scaleX,
                +(this.scale[0] != scale.y) || scaleY);
        }

        this.lastPoint = new Point(offsetX, offsetY);

        if (this.translate) canvas.selectionBox.translate(this.getTranslateVector(bb, canvas.selectionBox.getTranformedBoundigBox()))
    }

    translateSelectionBox(canvas: Canvas, { offsetY, offsetX }: MouseEvent) {
        if (!canvas.selectionBox) return;

        const mousePoint = new Point(offsetX, offsetY);

        const v = new Vector(this.lastPoint, mousePoint);

        canvas.selectionBox.translate(v)

        this.lastPoint = mousePoint;
    }

    mouseUp(canvas: Canvas<this>, e: MouseEvent): void {
        this.move = false;
        this.scale.splice(0, this.scale.length);
        this.translate = false;
    }

    renderCursor() {
        return 'default';
    }
}
