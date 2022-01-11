import { createContext } from 'react';


export const initialCacheContext = {
    avatars: new Map()
};

export const CacheContext = createContext(initialCacheContext);