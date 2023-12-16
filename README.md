# WhiteBoard
## Getting Started
Instalation and Run project
```sh
pnpm install
pnpm run dev 
```

## CommonMethod
Changes the PartialObject into a complete one with their default values
```typescript
setDefault<Object>(Partial<Object>, ObjectDefault);
```

## Color
it is a JSON file with 30000+ colors

Parse the key of this JSON file to something Canvas API understands
```typescript
const string = CanvasParseColor(x: string);
```

## Types
### Canvas
```typescript
const canvas = new Canvas(selector | HTMLCanvasElement, number, number);
//if string does not point to a HTMLCanvasElement an error will occur
```
* Canvas: HTMLCanvasElement \ Canvas it use
* ctx: CanvasRenderingContext2D \ The context of said Canvas
* Objects: CanvasObjectContainer[] \ Objects of the Canvas
* eventListener: any \
* height: number \ Height of the Canvas
* width: number \ Width of the Canvas
* cursor: any \ 

#### CanvasClear
Clear the canvas of all it contents
```typescript
CanvasClear(Canvas);
```

#### CanvasAddCanvasObject
Adds a CanvasObject into the canvas list of CanvasObjectContainers
```typescript
CanvasAddCanvasObject(Canvas, CanvasObject);
```

#### CanvasAddCanvasObjectContainer
Adds a CanvasObjectContainer into the canvas list of CanvasObjectContainers
```typescript
CanvasAddCanvasObjectContainer(Canvas, CanvasObjectContainer);
```

#### CanvasRender
Renders all object inside of Objects list
```typescript
CanvasRender(Canvas);
```

### CanvasObjectContainer
```typescript
const canvasObject = new CanvasObjectContainer(CanvasObject);
```

* render: boolean \ if it is rendered in the canvas
* enventListner: any \ 
* Object: CanvasObject \ The Object

### CanvasObject
* Rect

### Rect
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

#### RectUpdateRxRy
If rx or ry is not defined it will be equal to the other
```typescript
RectUpdateRxRy(Rect)
```

#### RectUpdateWidthHeight
Updates the widht and height based int the strokeWidth
```typescript
RectUpdateRxRy(Rect)
```

#### RectRender
Renders the Rect in the Canvas
```typescript
RectRender(Canvas, Rect)
```
