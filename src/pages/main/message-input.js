import { useContext, useState } from 'react';

import api from '../../api';
import { ContactsContext } from '../../contexts/contacts-context';


function MessageInput() {
    const { contacts } = useContext(ContactsContext);
    const [text, setText] = useState('');

    function onMessageSubmit(ev) {
        ev.preventDefault();

        if (contacts.currentContact.isRoom) {
            api.sendMessage({
                roomID: contacts.currentContact.id,
                content: text
            });
        }
        else {
            api.sendMessage({
                recipient: contacts.currentContact.name,
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