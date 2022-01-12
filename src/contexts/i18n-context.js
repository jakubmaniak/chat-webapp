import { createContext } from 'react';
import plural from '../helpers/plural';

const langs = {
    pl: {
        code: 'pl',
        name: 'polski',
        dict: {
            cancel: 'Anuluj',
            online: 'dostępny',
            brb: 'zaraz wracam',
            dnd: 'nie przeszkadzać',
            offline: 'niedostępny',
            invisible: 'niewidoczny',
            changeStatus: 'Zmień status',
            userSettings: 'Ustawienia',
            contacts: 'Kontakty',
            people: 'Ludzie',
            rooms: 'Grupy',
            members: 'Członkowie',
            multimedia: 'Multimedia',
            currentLanguage: 'Język:',
            setUserAvatar: 'Zmień awatar',
            logOut: 'Wyloguj',
            memberCounter: (n) => {
                const form = plural(n, 'użytkownik', 'użytkowników');
                return `${n} ${form}`;
            },
            messageInputPlaceholder: 'Wiadomość...',
            noResults: 'Brak wyników',
            userName: 'Nazwa użytkownika',
            roomName: 'Nazwa grupy',
            addContact: 'Dodaj kontakt',
            addContactButton: 'Dodaj kontakt',
            invitationSent: 'Zaproszenie wysłane',
            sendingInvitation: 'Wysyłanie zaproszenia',
            sendingInvitationError: 'Błąd',
            createRoom: 'Stwórz grupę',
            createRoomButton: 'Stwórz',
            addRoom: 'Dodaj grupę',
            addRoomButton: 'Dodaj',
            addExistingRoom: 'Dodaj istniejącą grupę'
        }
    },
    en: {
        code: 'en',
        name: 'English',
        dict: {
            cancel: 'Cancel',
            online: 'online',
            brb: 'idle',
            dnd: 'do not disturb',
            offline: 'offline',
            invisible: 'invisible',
            changeStatus: 'Change your status',
            userSettings: 'Settings',
            contacts: 'Contacts',
            people: 'People',
            rooms: 'Groups',
            members: 'Members',
            multimedia: 'Multimedia',
            currentLanguage: 'Language:',
            setUserAvatar: 'Set your avatar',
            logOut: 'Log out',
            memberCounter: (n) => (n === 1 ? '1 user' : n + ' users'),
            messageInputPlaceholder: 'Message...',
            noResults: 'No results',
            userName: 'Username',
            roomName: 'Group name',
            addContact: 'Add a contact',
            addContactButton: 'Add',
            invitationSent: 'The invitation has been sent',
            sendingInvitation: 'Sending an invitation',
            sendingInvitationError: 'Error',
            createRoom: 'Create a group',
            createRoomButton: 'Create',
            addRoom: 'Add a group',
            addRoomButton: 'Add',
            addExistingRoom: 'Add an existing group'
        }
    },
    de: {
        code: 'de',
        name: 'Deutsch',
        dict: {
            cancel: 'Abbrechen',
            online: 'online',
            brb: 'abwesend',
            dnd: 'bitte nicht stören',
            offline: 'offline',
            invisible: 'unsichtbar',
            changeStatus: 'Change your status',
            userSettings: 'Settings',
            contacts: 'Kontakte',
            people: 'Personen',
            rooms: 'Gruppen',
            members: 'Mitglieder',
            multimedia: 'Multimedia',
            currentLanguage: 'Sprache:',
            setUserAvatar: 'Set your avatar',
            logOut: 'Log out',
            memberCounter: (n) => `${n} Benutzer`,
            messageInputPlaceholder: 'Die Nachricht...',
            noResults: 'Keine Ergebnisse',
            userName: 'Benutzername',
            roomName: 'Group name',
            addContact: 'Add a contact',
            addContactButton: 'Add',
            invitationSent: 'The invitation has been sent',
            sendingInvitation: 'Sending an invitation',
            sendingInvitationError: 'Error',
            createRoom: 'Create a group',
            createRoomButton: 'Create',
            addRoom: 'Add a group',
            addRoomButton: 'Add',
            addExistingRoom: 'Add an existing group'
        }
    }
};

export const initialI18nContext = {
    langs,
    currentLang: langs.en
};

export const I18nContext = createContext(initialI18nContext);