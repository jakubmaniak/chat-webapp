import { createContext } from 'react';

export const initialSessionContext = {
    loggedIn: !!(localStorage.username),
    username: localStorage.username ?? null,
    status: 'offline',
    avatar: null
};

// console.log('exported', localStorage.username, initialSessionContext.username);

export const SessionContext = createContext(initialSessionContext);