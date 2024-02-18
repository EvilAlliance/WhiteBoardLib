type Node<T> = {
    value: T,
    prev?: Node<T>,
}

export default class Stack<T>{
    length: number = 0;
    head?: Node<T>;

    constructor(...items: T[]) {
        for (let i = 0; i < items.length; i++) {
            this.push(items[i]);
        }
    }

    push(i: T) {
        this.length++;

        const node = { value: i } as Node<T>;

        if (!this.head) {
            this.head = node;
            return;
        }

        node.prev = this.head;
        this.head = node;
    }

    pop(): T | undefined {
        this.length = Math.max(0, this.length - 1);
        if (this.length === 0) {
            const head = this.head;
            this.head = undefined;
            return head?.value;
        }

        const head = this.head as Node<T>;
        this.head = head.prev;

        return head.value;
    }

    peek(): T | undefined {
        return this.head?.value;
    }
}
