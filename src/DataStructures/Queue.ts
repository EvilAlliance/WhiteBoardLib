type Node<T> = {
    value: T,
    next?: Node<T>,
}

export default class Queue<T> {
    public length: number;
    private tail?: Node<T>;
    private head?: Node<T>;

    constructor() {
        this.length = 0;
    }

    enqueue(item: T): void {
        this.length++;
        const node = { value: item };
        if (!this.tail) {
            this.tail = this.head = node;
            return;
        }
        this.tail.next = node;
        this.tail = node;
    }

    deque(): T | undefined {
        if (!this.head) return undefined;

        this.length--;

        const node = this.head;
        this.head = node.next;

        node.next = undefined;

        if (this.length == 0) this.tail = undefined;

        return node.value;
    }

    peek(): T | undefined {
        return this.head?.value;
    }
}
