import { Canvas, CanvasAddCanvasObjectRender } from './WhiteBoard/Canvas';
import { Brush } from './WhiteBoard/Cursor/Brush';
import { Eraser } from './WhiteBoard/Cursor/Eraser';
import { EraserAll } from './WhiteBoard/Cursor/EraserAll';
import { CtxSetting, CtxTransformation } from './WhiteBoard/Object/BaseObject';
import { Rect } from './WhiteBoard/Object/Rect';

const canvas = new Canvas('canvas', 1000, 800);

const eraserAll = new EraserAll({ width: 5 });
const brush = new Brush();
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
CanvasAddCanvasObjectRender(canvas, p);
