export default class CommonMethod {
    _setObject(obj: Partial<this>) {
        for (const prop in obj) {
            this._set(prop, obj[prop] as this[typeof prop]);
        }
    }

    set<T extends keyof typeof this>(key: T | Partial<typeof this>, value?: this[T]) {
        if (typeof key === 'object') {
            this._setObject(key);
        } else if (value) {
            this._set(key, value);
        }
        return this;
    }

    _set<T extends keyof typeof this>(key: T, value: this[T]) {
        this[key] = value;
    }

    toggle(property: keyof this) {
        const value = this.get(property);
        if (typeof value === 'boolean') {
            // @ts-ignore
            this.set(property, !value);
        }
        return this;
    }

    get<T extends keyof this>(property: T): this[T] {
        return this[property];
    }
}
