import { createContext } from 'react';


export const initialConversationContext = {
    isRoom: false,
    roomID: null,
    name: null,
    owner: null,
    users: new Map()
};

export const ConversationContext = createContext(initialConversationContext);