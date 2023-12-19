import { setDefault } from '../CommonMethod';
import { Point } from '../GeoSpace/Point';
import { Color } from '../Utils/Color';


const PathDefault: Path = Object.freeze({
    Path: [] as Point[],
    color: 'Red',
    lineCap: 'round',
    width: 1
});

export class Path {
    public Path: Point[];
    public color: Color;
    public lineCap: CanvasLineCap;
    public width: number;

    constructor(obj: Partial<Path>) {
        setDefault<Path>(obj, PathDefault);
        setDefault<Path>(this, obj as Path);
    }
}
