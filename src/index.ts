import { Canvas } from './WhiteBoard/Canvas';
import { Brush } from './WhiteBoard/Cursor/Brush';
import { Eraser } from './WhiteBoard/Cursor/Eraser';
import { EraserAll } from './WhiteBoard/Cursor/EraserAll';
import { FloofFill } from './WhiteBoard/Cursor/FloodFill';
import { Point } from './WhiteBoard/GeoSpace/Point';
import { Circle } from './WhiteBoard/Object/Circle';
import { CtxSetting } from './WhiteBoard/Object/CtxSetting';
import { CtxTransformation } from './WhiteBoard/Object/CtxTransformation';
import { Rect } from './WhiteBoard/Object/Rect';


const eraserAll = new EraserAll({ diameter: 5 });
const floodFill = new FloofFill({ diameter: 5 });
const brush = new Brush({
    color: 'Purple',
    diameter: 50,
});

const eraser = new Eraser({ diameter: 25 });

export const canvas = new Canvas('canvas', 1000, 800, 'Orange', brush);

const eraserAllB = document.querySelector('#eraserAll');
const brushB = document.querySelector('#brush');
const eraserB = document.querySelector('#eraser');
const floodFillB = document.querySelector('#floodFill');


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
        //fill: true,
        strokeColor: 'Cabo',
        strokeWidth: 20,
    }),
    ctxTransformation: new CtxTransformation({
        originX: 'center',
        originY: 'center',
        scaleX: 2,
        skewY: Math.PI / 4
    })
});

const x = new Circle({
    center: new Point(350, 350),
    radius: 40,
    ctxSetting: new CtxSetting({
        strokeColor: 'Cabo',
        strokeWidth: 20,
    }),
    ctxTransformation: new CtxTransformation({
        originX: 'center',
        originY: 'center',
        scaleX: 2,
        skewY: Math.PI / 4
    })
});

canvas.addCanvasObjectRender(p);

//canvas.addCanvasObjectRender(x);
