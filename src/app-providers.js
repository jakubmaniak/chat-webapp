import { useState } from 'react';

import { SessionContext, initialSessionContext } from './contexts/session-context';
import { SocketContext, initialSocketContext } from './contexts/socket-context';
import { ContactsContext, initialContactsContext } from './contexts/contacts-context';
import { ConversationContext, initialConversationContext } from './contexts/conversation-context';
import { I18nContext, initialI18nContext } from './contexts/i18n-context';
import { initialNavContext, NavContext } from './contexts/nav-context';


function AppProviders(props) {
    const [nav, setNav] = useState(initialNavContext);
    const [i18n, setI18n] = useState(initialI18nContext);
    const [session, setSession] = useState(initialSessionContext);
    const [socket, setSocket] = useState(initialSocketContext);
    const [contacts, setContacts] = useState(initialContactsContext);
    const [conversation, setConversation] = useState(initialConversationContext);

    return (
        <NavContext.Provider value={{ nav, setNav }}>
            <I18nContext.Provider value={{ i18n, setI18n }}>
                <SessionContext.Provider value={{ session, setSession }}>
                    <SocketContext.Provider value={{ socket, setSocket }}>
                        <ContactsContext.Provider value={{ contacts, setContacts }}>
                            <ConversationContext.Provider value={{ conversation, setConversation }}>
                                {props.children}
                            </ConversationContext.Provider>
                        </ContactsContext.Provider>
                    </SocketContext.Provider>
                </SessionContext.Provider>
            </I18nContext.Provider>
        </NavContext.Provider>
    );
}

export default AppProviders;