export const on = (el, eventType, listener) => {
    el.addEventListener(eventType, listener);
}

export const off = (el, eventType, listener) => {
    el.removeEventListener(eventType, listener);
}

export const once = (el, eventType, listener) => {
    on(el, eventType, handleEventOnce);

    function handleEventOnce(event) {
        listener(event);
        off(el, eventType, handleEventOnce);
    }
}

export const trigger = (eventType, data) => {
    const event = new CustomEvent(eventType, { detail: data });
    document.dispatchEvent(event);
}
