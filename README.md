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

* strokeWidth: number;
* width: number;
* height: number;
* top: number;
* left: number;
* fill: boolean;
* fillColor: keyof typeof Color | string;
* strokeColor: keyof typeof Color | string;
* originX: 'left' | 'center' | 'right';
* originY: 'top' | 'center' | 'bottom';
* skewY: number;
* skewX: number;
* scaleY: number;
* scaleX: number;
* angle: number;
* rx: number;
* ry: number;

##### RectRender
Renders the Rect in the Canvas
```typescript
RectRender(Canvas, Rect)
```

#### CanvasObject
* Rect
