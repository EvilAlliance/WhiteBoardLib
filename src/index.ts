import { Canvas } from './WhiteBoard/Canvas';
import { Brush } from './WhiteBoard/Cursor/Brush';
import { EraserAll } from './WhiteBoard/Cursor/EraserAll';

const canvas = new Canvas('canvas', 1000, 800);

const eraserAll = new EraserAll({ width: 5 });
const brush = new Brush();

const eraserAllB = document.querySelector('#eraserAll');
const brushB = document.querySelector('#brush');

eraserAllB?.addEventListener('click', () => {
    canvas.cursor = eraserAll;
});

brushB?.addEventListener('click', () => {
    canvas.cursor = brush;
});
