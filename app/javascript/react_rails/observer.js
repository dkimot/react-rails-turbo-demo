export default class Observer {

    started = false;

    constructor(reactRails) {
        this.observer = new MutationObserver(mutations => this.processMutations(mutations));
        this.reactRails = reactRails;
    }

    start() {
        console.log('started');
        this.observer.observe(document.documentElement, { subtree: true, childList: true, attributes: true });
        this.started = true;
    }

    stop() {
        this.observer.disconnect();
        this.started = false;
    }

    processMutations(mutations) {
        if (this.started) {
            for (const mutation of mutations) {
                this.processMutation(mutation);
            }
        }
    }

    processMutation(mutation) {
        if (mutation.type !== 'childList') return;

        this.processRemovedNodes(mutation.removedNodes);
        this.processAddedNodes(mutation.addedNodes);
    }

    processAddedNodes(nodes) {
        for (const node of Array.from(nodes)) {
            const element = elementFromNode(node);

            if (element && element.isConnected) {
                this.processNodeTree(element);
            }
        }
    }

    processRemovedNodes(nodes) {
        for (const node of Array.from(nodes)) {
            const element = elementFromNode(node);

            if (element) {
                this.processNodeTree(element);
            }
        }
    }

    processNodeTree(element, adding = true) {
        if (element.getAttribute('data-react-class') == null) return;

        if (adding) {
            this.reactRails.mountComponents(element);
        } else {
            this.reactRails.unmountComponents(element);
        }
    }
}

const elementFromNode = (node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
        return node;
    }
};
