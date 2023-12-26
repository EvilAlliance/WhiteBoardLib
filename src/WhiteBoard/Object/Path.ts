import { setOption } from '../CommonMethod';
import { Point } from '../GeoSpace/Point';
import { Color } from '../Utils/Color';

export class Path {
    public Path: Point[] = [];
    public color: Color = 'Red';
    public lineCap: CanvasLineCap = 'round';
    public width: number = 1;

    constructor(obj: Partial<Path> = {}) {
        setOption<Path>(this, obj);
    }
}
