import { useEffect } from 'react';


function useListener(target, eventName, listener, deps) {
    useEffect(() => {      
        target?.on(eventName, listener);
        
        return () => target?.off(eventName, listener);
    }, deps);
}

export default useListener;