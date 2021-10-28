import { createContext } from 'react';

export const initialContactsContext = {
    currentContact: null,
    getCurrentContact: () => initialContactsContext.currentContact
};

export const ContactsContext = createContext(initialContactsContext);