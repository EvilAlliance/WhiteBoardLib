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

## CommonMethod
Changes the PartialObject into a complete one with their default values
```typescript
setDefault<Object>(Partial<Object>, ObjectDefault);
```

### Methods
#### Canvas
```typescript
const canvas = new Canvas(selector | HTMLCanvasElement, number, number);
//if string does not point to a HTMLCanvasElement an error will occur
```
##### CanvasClear
Clear the canvas of all it contents
```typescript
CanvasClear(Canvas);
```
##### CanvasAddCanvasObject
Adds a CanvasObject into the canvas list of CanvasObjectContainers
```typescript
CanvasAddCanvasObject(Canvas, CanvasObject);
```
##### CanvasAddCanvasObjectContainer
Adds a CanvasObjectContainer into the canvas list of CanvasObjectContainers
```typescript
CanvasAddCanvasObjectContainer(Canvas, CanvasObjectContainer);
```
#### CanvasObjectContainer
```typescript
const canvasObject = new CanvasObjectContainer(CanvasObject);
```
#### Rect
```typescript
const rect = new Rect(PartialRect)
```
* width: number \ Width of the rectangle
* height: number \ Height of the rectangle
* top: number \ Distance of the rectangle from the top border of the canvas
* left: number \ Distance of the rectangle from the left border of the canvas
* fill: boolean \ If the rectangle is filled with the color
* fillColor: keyof typeof Color | string \ The color inside the rectangle
* strokeColor: keyof typeof Color | string \ The color of the outer stroke of the rectangle
* strokeWidth: number \ Thickness of the outer stroke of the rectangle
* originX: 'left' | 'center' | 'right' | number \ Center point base in the x axis, number between0 and 1
* originY: 'top' | 'center' | 'bottom' | number \ Center point base in the y axis, number between 0 and 1
* skewY: number \ 
* skewX: number \ 
* scaleY: number \ 
* scaleX: number \ 
* angle: number \ Rotation base on the center point
* rx: number \ Curve the corners in the side of the x axis
* ry: number \ Curve the corners in the side of the y axis

##### RectRender
Renders the Rect in the Canvas
```typescript
RectRender(Canvas, Rect)
```

#### CanvasObject
* Rect
