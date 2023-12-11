# WhiteBoard
## Getting Started
Instalation and Run project
```sh
pnpm install
pnpm run dev 
```
### Methods
#### Canvas
```typescript
const canvas = new Canvas(string | HTMLCanvasElement, number, number);
//if string does not point to a HTMLCanvasElement an error will occur
```
#### CanvasObjectContainer
```typescript
const canvasObject = new CanvasObjectContainer(Object, string);
```

#### CommonMethod
Changes the PartialObject into a complete one with their default values
```typescript
setDefault<Object>(Partial<Object>, ObjectDefault);
```
