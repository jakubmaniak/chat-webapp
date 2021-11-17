import { useContext, useEffect, useState } from 'react';

import api from '../../api';
import { ContactsContext } from '../../contexts/contacts-context';


function MessageInput() {
    const { contacts } = useContext(ContactsContext);

    const [lang, setLang] = useState(null);
    const [text, setText] = useState('');
    const [canSend, setCanSend] = useState(false);

    useEffect(() => {
        if (!contacts.currentContact) return;

        setLang(null);
    }, [contacts.currentContact]);

    function onMessageSubmit(ev) {
        ev.preventDefault();

        if (!canSend) return;

        const langs = ['en', 'pl', 'de', 'ru', 'ja'];
        let msgContent = text.trim();
        let msgLang = lang;

        if (msgContent.startsWith('/')) {
            if (langs.includes(msgContent.slice(1, 3).toLowerCase())) {
                msgContent = msgContent.slice(3).trim();

                if (msgContent) {
                    msgContent = text.slice(3).trim();
                    msgLang = text.slice(1, 3).toLowerCase();
                }
                else {
                    setLang(msgContent.slice(1, 3).toLowerCase());
                    setText('');
                    setCanSend(false);
                    return;
                }
            }
        }

        if (contacts.currentContact.isRoom) {
            api.sendMessage({
                roomID: contacts.currentContact.id,
                lang: msgLang,
                content: msgContent
            });
        }
        else {
            api.sendMessage({
                recipient: contacts.currentContact.name,
                lang: msgLang,
                content: msgContent
            });
        }

        setText('');
        setCanSend(false);
    }

    function onInputChange(ev) {
        setText(ev.target.value);

        if (canSend && ev.target.value.trim() === '') {
            setCanSend(false);
        }
        else {
            setCanSend(true);
        }
    }


    return <form className="message-box" onSubmit={onMessageSubmit}>
        <input
            className="message-input"
            value={text}
            onChange={onInputChange}
            placeholder="Wiadomość..."
        />
        <div className="message-box-buttons">
            <button className="message-box-send-button" disabled={!canSend}></button>
        </div>
    </form>;
}

export default MessageInput;