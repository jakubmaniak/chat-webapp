import { createContext } from 'react';

export const initialSessionContext = {
    loggedIn: !!(localStorage.username),
    username: localStorage.username ?? null
};

// console.log('exported', localStorage.username, initialSessionContext.username);

export const SessionContext = createContext(initialSessionContext);