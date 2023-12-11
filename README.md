# WhiteBoard
## Getting Started
Instalation and Run project
```sh
pnpm install
pnpm run dev 
```
## Colors
it is a JSON file with 30000+ colors

### Methods
#### Canvas
```typescript
const canvas = new Canvas(string | HTMLCanvasElement, number, number);
//if string does not point to a HTMLCanvasElement an error will occur
```
#### CanvasObjectContainer
```typescript
const canvasObject = new CanvasObjectContainer(CanvasObject, string);
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
* fillColor: keyof typeof Colors | string;
* strokeColor: keyof typeof Colors | string;
* originX: 'left' | 'center' | 'right';
* originY: 'top' | 'center' | 'bottom';
* skewY: number;
* skewX: number;
* scaleY: number;
* scaleX: number;
* angle: number;
* rx: number;
* ry: number;


#### CanvasObject
* Rect
