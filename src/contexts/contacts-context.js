import { createContext } from 'react';

export const initialContactsContext = {
    currentContact: null,
    users: [],
    rooms: [],
    getCurrentContact: () => initialContactsContext.currentContact
};

export const ContactsContext = createContext(initialContactsContext);