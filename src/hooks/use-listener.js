import { useEffect } from 'react';


export function useOnListener(target, eventName, listener, deps) {
    useEffect(() => {      
        target?.on(eventName, listener);
        
        return () => target?.off(eventName, listener);
    }, deps);
}

export function useAddListener(target, eventName, listener, deps) {
    useEffect(() => {      
        target?.addEventListener(eventName, listener);
        
        return () => target?.removeEventListener(eventName, listener);
    }, deps);
}