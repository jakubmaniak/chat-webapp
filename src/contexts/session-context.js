import { createContext } from 'react';

export const initialSessionContext = {
    username: localStorage.username ?? null
};

console.log('exported', localStorage.username, initialSessionContext.username);

export const SessionContext = createContext(initialSessionContext);