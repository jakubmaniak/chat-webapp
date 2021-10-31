import { useContext, useEffect, useState } from 'react';

import api from '../../api';
import { ContactsContext } from '../../contexts/contacts-context';


function MessageInput() {
    const { contacts } = useContext(ContactsContext);

    const [lang, setLang] = useState(null);
    const [text, setText] = useState('');

    useEffect(() => {
        if (!contacts.currentContact) return;

        setLang(null);
    }, [contacts.currentContact]);

    function onMessageSubmit(ev) {
        ev.preventDefault();

        if (text.trim() == '/pl') {
            setLang('pl');
            setText('');
            return;
        }
        else if (text.trim() == '/en') {
            setLang('en');
            setText('');
            return;
        }

        if (contacts.currentContact.isRoom) {
            api.sendMessage({
                roomID: contacts.currentContact.id,
                lang,
                content: text
            });
        }
        else {
            api.sendMessage({
                recipient: contacts.currentContact.name,
                lang,
                content: text
            });
        }

        setText('');
    }

    return <form className="message-box" onSubmit={onMessageSubmit}>
        <input
            className="message-input"
            value={text}
            onChange={(ev) => setText(ev.target.value)}
            placeholder="Wiadomość..."
        />
    </form>;
}

export default MessageInput;