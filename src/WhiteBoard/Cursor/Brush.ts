import { Canvas } from '../Canvas';
import { Point } from '../GeoSpace/Point';
import { Vector } from '../GeoSpace/Vector';
import { CanvasObjectContainer } from '../Object/CanvasObjectContainer';
import { CtxSetting } from '../Object/CtxSetting';
import { Path } from '../Object/Path';
import { Color } from '../Utils/Color';
import { trailDots } from '../debug';
import { BaseBrush } from './BaseBrush';

export class Brush extends BaseBrush<Path> {
    lineCap: CanvasLineCap = 'round';
    color: Color = 'Red';
    globalCompositeOperation: GlobalCompositeOperation = 'source-over';

    constructor(brush: Partial<Brush> = {}) {
        super();
        Object.assign(this, brush);
    }

    mouseDown(canvas: Canvas<this>): Path {
        const p = new Path({
            ctxSetting: new CtxSetting({
                strokeWidth: canvas.cursor.width,
                strokeColor: canvas.cursor.color,
                lineCap: canvas.cursor.lineCap,
                globalCompositeOperation: canvas.cursor.globalCompositeOperation,
            })
        });

        canvas.Objects.push(new CanvasObjectContainer(p));

        return p;
    }

    mouseMove(canvas: Canvas<this>, e: MouseEvent, path: Path): void {
        const p = new Point(e.offsetX, e.offsetY);

        if (path.Path.length == 0) {
            path.Path.push(p);
        } else {
            const v = new Vector(p, path.Path[path.Path.length - 1]);
            if (v.mod() >= canvas.cursor.width / 2) {
                path.Path.push(p);
            }
        }

        canvas.clear();
        canvas.render();
    }

    //simplify path prototype not used 
    mouseUp(canvas: Canvas<this>, e: MouseEvent, path: Path): void {
        return;
        const p = JSON.parse(JSON.stringify(path));
        let curr = path.Path[0];
        let i = 1;
        while (i < path.Path.length - 1) {
            const nextVec = new Vector(curr, path.Path[i]);
            const nextNextVec = new Vector(curr, path.Path[i + 1]);
            const newVec = new Vector(path.Path[i], path.Path[i + 1]);
            if (Math.abs(Math.atan(nextVec.y / nextVec.x) - Math.atan(nextNextVec.y / nextNextVec.x)) < Math.PI / 90 && Math.abs(Math.atan(newVec.y / newVec.x)) > Math.PI / 90 - Math.PI / 180) {
                path.Path.splice(i--, 1);
            }
            curr = path.Path[i++];
        }

        canvas.clear();
        canvas.render();
        trailDots(canvas.ctx, p, 'Black');
        trailDots(canvas.ctx, path, 'Bulrush');
    }
}

