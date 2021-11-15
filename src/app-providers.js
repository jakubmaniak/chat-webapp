import { useState } from 'react';

import { SessionContext, initialSessionContext } from './contexts/session-context';
import { SocketContext, initialSocketContext } from './contexts/socket-context';
import { ContactsContext, initialContactsContext } from './contexts/contacts-context';
import { ConversationContext, initialConversationContext } from './contexts/conversation-context';


function AppProviders(props) {
    const [session, setSession] = useState(initialSessionContext);
    const [socket, setSocket] = useState(initialSocketContext);
    const [contacts, setContacts] = useState(initialContactsContext);
    const [conversation, setConversation] = useState(initialConversationContext);

    return (
        <SessionContext.Provider value={{ session, setSession }}>
            <SocketContext.Provider value={{ socket, setSocket }}>
                <ContactsContext.Provider value={{ contacts, setContacts }}>
                    <ConversationContext.Provider value={{ conversation, setConversation }}>
                            {props.children}
                    </ConversationContext.Provider>
                </ContactsContext.Provider>
            </SocketContext.Provider>
        </SessionContext.Provider>
    );
}

export default AppProviders;