import { Canvas, CanvasAddCanvasObjectRender, CanvasRender } from './WhiteBoard/Canvas';
import { Brush } from './WhiteBoard/Cursor/Brush';
import { Eraser } from './WhiteBoard/Cursor/Eraser';
import { EraserAll } from './WhiteBoard/Cursor/EraserAll';
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
    height: 200,
    ctxSetting: {
        fill: false,
        strokeColor: 'Cabo',
        strokeWidth: 20
    }
});

CanvasAddCanvasObjectRender(canvas, p);

setTimeout(() => {
    canvas.Objects[canvas.Objects.length - 1].Object.ctxSetting.fill = true;
    CanvasRender(canvas);
    console.log(canvas.Objects);
}, 5000);
