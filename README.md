# WhiteBoard
## Getting Started
Instalation and Run project
```sh
pnpm install
pnpm run dev 
```
### Type Checking
#### Primitive Types
* isNumber
    ```javascript
    const x = ??;
    //result is true or false
    const result = isNumber(x);
    ```
* isString
    ```javascript
    const x = ??;
    //result is true or false
    const result = isString(x);
    ```
* isBoolean
     ```javascript
    const x = ??;
    //result is true or false
    const result = isBoolean(x);
    ```
* isUndefined
    ```javascript
    const x = ??;
    //result is true or false
    const result = isUndefined(x);
    ```
* isNull
     ```javascript
    const x = ??;
    //result is true or false
    const result = isNull(x);
    ```
* isSymbol
    ```javascript
    const x = ?;
    //result is true or false
    const result = isSymbol(x);
    ```
* isBigInt
    ```javascript
    const x = ??;
    //result is true or false
    const result = isbigInt(x);
    ```
* isFunction
    ```javascript
    const x = ??;
    //result is true or false
    const result = isFunction(x);
    ```
#### Array Type
* isArray
    ```javascript
    const x = ??;
    //result is true or false
    const result = isArray(x);
    ```
* isArrayOf
     ```javascript
    const x = ??;
    //result is true or false
    const result = isArrayOf(x, TypeCheckingFunction);
    //Second parameter is not a Function throws an error
    ```
#### Object Type
* isObject
     ```javascript
    const x = ??;
    //result is true or false
    const result = isObject(x);
    ```
* isObjectWithKeys
     ```javascript
    const x = ??;
    //result is true or false
    const result = isObjectWithKeys(x, ArrayWithKeys);
    //Second parameter is not an Array throws an error
    ```
* isObjectOf
    ```javascript
    const x = ???;
    //result is true or false
    const result = isObjectOf(x, TypeCheckingFunction);
    //Second parameter is not a Function throws an error
    ```
* isObjectWhiteKeysAndTypes
    ```javascript
    const x = ??;
    //result is true or false
    const result = isObjectWhiteKeysAndTypes(x, ObjectWithValueAsFunction);
    //Second parameter is not an Object with value as Function throws an error
    ```
