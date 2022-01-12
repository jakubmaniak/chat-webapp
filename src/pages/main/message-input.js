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

    const [selectedSourceLang, setSelectedSourceLang] = useState('auto');
    const [selectedTargetLang, setSelectedTargetLang] = useState('en');

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
                if (msgContent.substring(4).trim().length) {
                    inlineTranslating = true;
                }
                else {
                    setCanSend(false);
                    return;
                }
            }
        }

        const options = {};

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
                    <p onClick={() => setTranslatingEnabled(!translatingEnabled)}>
                        {i18n('messageTranslation')}: {i18n('turn' + (translatingEnabled ? 'On' : 'Off'))}
                    </p>
                    <p className="separator"></p>
                    <p
                        className={translatingEnabled ? '' : 'disabled'}
                        onClick={() => translatingEnabled && handleSelectSourceLang()}
                    >{i18n('sourceLang')}: {i18n(selectedSourceLang === 'auto' ? 'detectLang' : selectedSourceLang)}</p>
                    <p
                        className={translatingEnabled ? '' : 'disabled'}
                        onClick={() => translatingEnabled && handleSelectTargetLang()}
                    >{i18n('targetLang')}: {i18n(selectedTargetLang)}</p>
                </div>
                {langsMenuVisible && <>
                    <div className="menu-overlay" onClick={() => setLangsMenuVisible(false)}></div>
                    <div className="langs-menu" onClick={() => setLangsMenuVisible(false)}>
                        {langSelectionType === 'source' && <p onClick={() => handleLangSelect('auto')}>{i18n('detectLang')}</p>}
                        <p onClick={() => handleLangSelect('en')}>{i18n('en')}</p>
                        <p className="separator"></p>
                        <p onClick={() => handleLangSelect('cs')}>{i18n('cs')}</p>
                        <p onClick={() => handleLangSelect('fr')}>{i18n('fr')}</p>
                        <p onClick={() => handleLangSelect('es')}>{i18n('es')}</p>
                        <p onClick={() => handleLangSelect('de')}>{i18n('de')}</p>
                        <p onClick={() => handleLangSelect('pl')}>{i18n('pl')}</p>
                        <p onClick={() => handleLangSelect('ru')}>{i18n('ru')}</p>
                        <p onClick={() => handleLangSelect('sk')}>{i18n('sk')}</p>
                        <p onClick={() => handleLangSelect('it')}>{i18n('it')}</p>
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
                data-tip={i18n('messageTranslation')}
            ></button>
            <button
                className="message-box-send-button"
                disabled={!canSend}
                data-tip={i18n('send')}
            ></button>
        </div>
        {renderTranslateMenu()}
    </form>;
}

export default MessageInput;