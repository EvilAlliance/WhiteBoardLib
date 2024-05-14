import { Canvas } from './WhiteBoard/Canvas';
import { Brush } from './WhiteBoard/Cursor/Brush';
import { Cursor } from './WhiteBoard/Cursor/Cursor';
import { Eraser } from './WhiteBoard/Cursor/Eraser';
import { EraserAll } from './WhiteBoard/Cursor/EraserAll';
import { FloodFill } from './WhiteBoard/Cursor/FloodFill';
import { UndoEraser } from './WhiteBoard/Cursor/UndoEraser';
import { Point } from './WhiteBoard/GeoSpace/Point';
import { Circle } from './WhiteBoard/Object/Circle';
import { CtxSetting } from './WhiteBoard/Object/CtxSetting';
import { CtxTransformation } from './WhiteBoard/Object/CtxTransformation';
import { Rect } from './WhiteBoard/Object/Rect';
import { CanvasParseColor } from './WhiteBoard/Utils/Color';


const eraserAll = new EraserAll({ diameter: 5 });
const cursor = new Cursor();
const undoEraser = new UndoEraser({ diameter: 10 });
const floodFill = new FloodFill({ diameter: 5 });
const brush = new Brush({
    color: 'Purple',
    diameter: 50,
});

const eraser = new Eraser({ diameter: 25 });

export const canvas = new Canvas('canvas', 1000, 800, 'Orange', cursor);

const eraserAllB = document.querySelector('#eraserAll');
const undoEraserB = document.querySelector('#undoEraser');
const brushB = document.querySelector('#brush');
const eraserB = document.querySelector('#eraser');
const floodFillB = document.querySelector('#floodFill');
const cursorB = document.querySelector('#cursor');

undoEraserB?.addEventListener('click', () => {
    canvas.setBrush(undoEraser);
})

cursorB?.addEventListener('click', () => {
    canvas.setBrush(cursor);
})

floodFillB?.addEventListener('click', () => {
    canvas.setBrush(floodFill);
});

eraserAllB?.addEventListener('click', () => {
    canvas.setBrush(eraserAll);
});

brushB?.addEventListener('click', () => {
    canvas.setBrush(brush);
});

eraserB?.addEventListener('click', () => {
    canvas.setBrush(eraser);
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
        originX: 'center',
        originY: 'center',
        scaleX: 1,
        skewY: Math.PI / 4,
        angle: Math.PI / 2
    })
});

canvas.addCanvasObject(new Rect({
    left: 100,
    top: 200,
    width: 150,
    height: 150,
    ctxSetting: new CtxSetting({
        //fill: true,
        strokeColor: 'Purple',
        strokeWidth: 20,
    }),
    ctxTransformation: new CtxTransformation({
        originX: 'center',
        originY: 'center',
        scaleX: 2,
        //skewY: Math.PI / 4
    })
}));

canvas.addCanvasObject(p);

canvas.addCanvasObject(new Rect({
    left: 100,
    top: 200,
    width: 150,
    height: 150,
    ctxSetting: new CtxSetting({
        //fill: true,
        strokeColor: 'BlackBay',
        strokeWidth: 20,
    }),
    ctxTransformation: new CtxTransformation({
        originX: 'center',
        originY: 'center',
        scaleX: 1 / 2,
        //skewY: Math.PI / 4
    })
}));
const x = new Circle({
    center: new Point(300, 300),
    radius: 40,
    ctxSetting: new CtxSetting({
        strokeColor: 'Cabo',
        strokeWidth: 20,
    }),
    ctxTransformation: new CtxTransformation({
        originX: 'center',
        originY: 'center',
        scaleX: 2,
        skewX: Math.PI / 4
    })
});


canvas.addCanvasObject(x);

canvas.render();

setInterval(() => {
    console.log('render');
    canvas.render();
}, 4000)
console.log(CanvasParseColor('LightBlue'))
