import { Canvas } from './WhiteBoard/Canvas';
import { Brush } from './WhiteBoard/Cursor/Brush';
import { Eraser } from './WhiteBoard/Cursor/Eraser';
import { EraserAll } from './WhiteBoard/Cursor/EraserAll';
import { Point } from './WhiteBoard/GeoSpace/Point';
import { CtxSetting } from './WhiteBoard/Object/CtxSetting';
import { CtxTransformation } from './WhiteBoard/Object/CtxTransformation';
import { Path } from './WhiteBoard/Object/Path';
import { Rect } from './WhiteBoard/Object/Rect';

const canvas = new Canvas('canvas', 1000, 800);

const eraserAll = new EraserAll({ width: 5 });
const brush = new Brush({
    color: 'Purple'
});
const eraser = new Eraser({ width: 20 });

const eraserAllB = document.querySelector('#eraserAll');
const brushB = document.querySelector('#brush');
const eraserB = document.querySelector('#eraser');

eraserAllB?.addEventListener('click', () => {
    canvas.cursor = eraserAll;
});

brushB?.addEventListener('click', () => {
    canvas.cursor = brush;
});

eraserB?.addEventListener('click', () => {
    canvas.cursor = eraser;
});

const p = new Rect({
    left: 100,
    top: 200,
    width: 150,
    height: 150,
    ctxSetting: new CtxSetting({
        fill: true,
        strokeColor: 'Cabo',
        strokeWidth: 20,
    }),
    ctxTransformation: new CtxTransformation({
        angle: Math.PI / 4,
        originX: 'center',
        originY: 'center',
    })
});
canvas.addCanvasObjectRender(p)
canvas.on('mouse:down', function(e) {
    const a = p.ctxTransformation.GetTransformationMatrix(p.getBoundingBox());
    a.invertSelf();
    const mousePoint = new Point(e.offsetX, e.offsetY);
    const point = new DOMPointReadOnly(mousePoint.x, mousePoint.y).matrixTransform(a);
    const path = new Path({
        Path: [new Point(point.x, point.y)],
        ctxSetting: new CtxSetting({
            strokeWidth: 10,
            strokeColor: 'Purple'
        })
    })
    canvas1.addCanvasObjectRender(path);
})

const canvas1 = new Canvas('#a', 1000, 800);

const p1 = new Rect({
    left: 100,
    top: 200,
    width: 150,
    height: 150,
    ctxSetting: new CtxSetting({
        fill: true,
        strokeColor: 'Cabo',
        strokeWidth: 20,
    }),
    ctxTransformation: new CtxTransformation({
        originX: 'center',
        originY: 'center',
    })
});
canvas1.addCanvasObjectRender(p1);
