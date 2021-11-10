import { useState } from 'react';

import { SessionContext, initialSessionContext } from './contexts/session-context';
import { SocketContext, initialSocketContext } from './contexts/socket-context';
import { ContactsContext, initialContactsContext } from './contexts/contacts-context';


function AppProviders(props) {
    const [session, setSession] = useState(initialSessionContext);
    const [socket, setSocket] = useState(initialSocketContext);
    const [contacts, setContacts] = useState(initialContactsContext);

    return (
        <SessionContext.Provider value={{ session, setSession }}>
            <SocketContext.Provider value={{ socket, setSocket }}>
                <ContactsContext.Provider value={{ contacts, setContacts }}>
                    {props.children}
                </ContactsContext.Provider>
            </SocketContext.Provider>
        </SessionContext.Provider>
    );
}

export default AppProviders;