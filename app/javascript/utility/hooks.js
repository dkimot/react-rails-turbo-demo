import { useEffect } from 'react';
import { on, off } from './events';

export const useAction = (ref, ev, handler) => {
    useEffect(() => {
        if (!ref.current) return;

        on(ref.current, ev, handler);

        return () => off(ref.current, ev, handler);
    }, [ref]);
}
