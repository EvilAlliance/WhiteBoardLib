self.addEventListener('message', (e: MessageEvent) => {
    if (!(e.data instanceof Uint32Array)) {
        throw new Error('Expected an Uint32Array');
    }
    self.postMessage(e.data.every((x) => x == 0));
});
