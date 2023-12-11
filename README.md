# WhiteBoard
## Getting Started
Instalation and Run project
```sh
pnpm install
pnpm run dev 
```
## Color
it is a JSON file with 30000+ colors

Parse the key of this JSON file to something Canvas API understands
```typescript
const string = CanvasParseColor(x: string);
```

### Methods
#### Canvas
```typescript
const canvas = new Canvas(selector | HTMLCanvasElement, number, number);
//if string does not point to a HTMLCanvasElement an error will occur
```
#### CanvasObjectContainer
```typescript
const canvasObject = new CanvasObjectContainer(CanvasObject);
```

#### CommonMethod
Changes the PartialObject into a complete one with their default values
```typescript
setDefault<Object>(Partial<Object>, ObjectDefault);
```

#### Rect

```typescript
const rect = new Rect(PartialRect)
```
Width of the rectangle
* width: number
Height of the rectangle
* height: number
Distance of the rectangle from the top border of the canvas
* top: number;
Distance of the rectangle from the left border of the canvas
* left: number;
If the rectangle is filled with the color
* fill: boolean;
The color inside the rectangle
* fillColor: keyof typeof Color | string;
The color of the outer stroke of the rectangle
* strokeColor: keyof typeof Color | string;
Thickness of the outer stroke of the rectangle
* strokeWidth: number
Center point base in the x axis, number between 0 and 1
* originX: 'left' | 'center' | 'right' | number;
Center point base in the y axis, number between 0 and 1
* originY: 'top' | 'center' | 'bottom' | number;
* skewY: number;
* skewX: number;
* scaleY: number;
* scaleX: number;
Rotation base on the center point
* angle: number;
Curve the corners in the side of the x axis
* rx: number;
Curve the corners in the side of the y axis
* ry: number;

##### RectRender
Renders the Rect in the Canvas
```typescript
RectRender(Canvas, Rect)
```

#### CanvasObject
* Rect
