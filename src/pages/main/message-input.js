import { useContext, useEffect, useState } from 'react';

import api from '../../api';
import { ContactsContext } from '../../contexts/contacts-context';
import useI18n from '../../hooks/use-i18n';

import './message-input.scss';


function MessageInput() {
    const { i18n } = useI18n();
    const { contacts } = useContext(ContactsContext);

    const [translatingEnabled, setTranslatingEnabled] = useState(false);
    const [translateMenuVisible, setTranslateMenuVisible] = useState(false);
    const [langsMenuVisible, setLangsMenuVisible] = useState(false);
    const [langSelectionType, setLangSelectionType] = useState(null);

    const [selectedSourceLang, setSelectedSourceLang] = useState('pl');
    const [selectedTargetLang, setSelectedTargetLang] = useState('en');

    const [lang, setLang] = useState(null);
    const [text, setText] = useState('');
    const [canSend, setCanSend] = useState(false);

    useEffect(() => {
        if (!contacts.currentContact) return;

        setTranslatingEnabled(false);
    }, [contacts.currentContact]);

    function onMessageSubmit(ev) {
        ev.preventDefault();

        if (!canSend) return;

        const langCodes = ['cs', 'fr', 'en', 'es', 'de', 'it', 'pl', 'ru', 'sk'];
        let inlineTranslating = false;

        let msgContent = text.trim();


        if (msgContent.startsWith('/')) {
            if (langCodes.includes(msgContent.substring(1, 3).toLowerCase())) {
                //msgContent = msgContent.slice(3).trim();

                if (msgContent.substring(4).trim().length) {
                    //msgContent = text.slice(3).trim();
                    //msgLang = text.slice(1, 3).toLowerCase();
                    inlineTranslating = true;
                }
                else {
                    //setLang(msgContent.slice(1, 3).toLowerCase());
                    //setText('');
                    setCanSend(false);
                    return;
                }
            }
        }

        const options = {};

        console.log({ translatingEnabled, inlineTranslating });

        if (translatingEnabled && !inlineTranslating) {
            options.sourceLang = selectedSourceLang;
            options.targetLang = selectedTargetLang;
        }

        if (contacts.currentContact.isRoom) {
            api.sendMessage({
                roomID: contacts.currentContact.id,
                content: msgContent,
                ...options
            });
        }
        else {
            api.sendMessage({
                recipient: contacts.currentContact.name,
                content: msgContent,
                ...options
            });
        }

        setText('');
        setCanSend(false);
    }

    function handleSelectTargetLang() {
        setLangSelectionType('target');
        setLangsMenuVisible(true);
    }

    function handleSelectSourceLang() {
        setLangSelectionType('source');
        setLangsMenuVisible(true);
    }

    function handleLangSelect(langCode) {
        if (langSelectionType === 'source') {
            setSelectedSourceLang(langCode);
        }
        else if (langSelectionType === 'target') {
            setSelectedTargetLang(langCode);
        }
    }

    function onInputChange(ev) {
        setText(ev.target.value);
        let text = ev.target.value;

        if (text.startsWith('/')) {
            const langCodes = ['cs', 'fr', 'en', 'es', 'de', 'it', 'pl', 'ru', 'sk'];

            if (langCodes.includes(text.substring(1, 3).toLowerCase())) {
                if (text.substring(4).trim().length) {
                    !canSend && setCanSend(true);
                    return;
                }
            }
            else {
                !canSend && setCanSend(true);
                return;
            }
        }
        else if (text.trim().length) {
            !canSend && setCanSend(true);
            return;
        }

        canSend && setCanSend(false);
    }


    function renderTranslateMenu() {
        if (!translateMenuVisible) return null;

        return (
            <div className="menu-wrapper">
                {!langsMenuVisible && (
                    <div className="menu-overlay" onClick={() => setTranslateMenuVisible(false)}></div>
                )}
                <div className="translate-menu">
                    <p onClick={() => setTranslatingEnabled(!translatingEnabled)}>{
                        translatingEnabled ? 'Tłumaczenie wiadomości: wł' : 'Tłumaczenie wiadomości: wył'
                    }</p>
                    <p className="separator"></p>
                    <p
                        className={translatingEnabled ? '' : 'disabled'}
                        onClick={() => translatingEnabled && handleSelectSourceLang()}
                    >Język źródłowy: {selectedSourceLang}</p>
                    <p
                        className={translatingEnabled ? '' : 'disabled'}
                        onClick={() => translatingEnabled && handleSelectTargetLang()}
                    >Język docelowy: {selectedTargetLang}</p>
                </div>
                {langsMenuVisible && <>
                    <div className="menu-overlay" onClick={() => setLangsMenuVisible(false)}></div>
                    <div className="langs-menu" onClick={() => setLangsMenuVisible(false)}>
                        {langSelectionType === 'source' && <p onClick={() => handleLangSelect('auto')}>rozpoznaj język</p>}
                        <p onClick={() => handleLangSelect('en')}>angielski</p>
                        <p className="separator"></p>
                        <p onClick={() => handleLangSelect('cs')}>czeski</p>
                        <p onClick={() => handleLangSelect('fr')}>francuski</p>
                        <p onClick={() => handleLangSelect('es')}>hiszpański</p>
                        <p onClick={() => handleLangSelect('de')}>niemiecki</p>
                        <p onClick={() => handleLangSelect('pl')}>polski</p>
                        <p onClick={() => handleLangSelect('ru')}>rosyjski</p>
                        <p onClick={() => handleLangSelect('sk')}>słowacki</p>
                        <p onClick={() => handleLangSelect('it')}>włoski</p>
                    </div>
                </>}
            </div>
        );
    }

    return <form className="message-box" onSubmit={onMessageSubmit}>
        <input
            className="message-input"
            value={text}
            onChange={onInputChange}
            placeholder={i18n('messageInputPlaceholder')}
        />
        <div className="message-box-buttons">
            <button
                type="button"
                className={'message-box-translate-button' + (translatingEnabled ? ' active' : '')}
                onClick={() => setTranslateMenuVisible(true)}
                data-tip="Tłumaczenie wiadomości"
            ></button>
            <button
                className="message-box-send-button"
                disabled={!canSend}
                data-tip="Wyślij"
            ></button>
        </div>
        {renderTranslateMenu()}
    </form>;
}

export default MessageInput;