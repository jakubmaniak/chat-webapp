import { createContext } from 'react';


export const initialConversationContext = {
    isRoom: false,
    roomID: null,
    name: null,
    owner: null,
    isEveryoneCanInvite: null,
    users: new Map()
};

export const ConversationContext = createContext(initialConversationContext);