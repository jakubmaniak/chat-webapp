import { createContext } from 'react';
import plural from '../helpers/plural';

const langs = {
    pl: {
        code: 'pl',
        name: 'polski',
        dict: {
            cancel: 'Anuluj',
            username: 'Nazwa użytkownika',
            password: 'Hasło',
            repeatPassword: 'Powtórz hasło',
            logIn: 'Zaloguj',
            signUp: 'Zarejestruj',
            goToSignUp: 'Załóż konto',
            goToLogIn: 'Masz już konto?',
            turnOn: 'wł',
            turnOff: 'wył',
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
            roomSettings: 'Ustawienia grupy',
            leaveRoom: 'Opuść grupę',
            deleteRoom: 'Usuń grupę',
            changeRoomName: 'Zmień nazwę grupy',
            everyoneCanInvite: 'Wszyscy mogą zapraszać',
            contactSidebarSettings: 'Ustawienia konwersacji',
            deleteContact: 'Usuń kontakt',
            members: 'Członkowie',
            owner: 'właściciel',
            multimedia: 'Multimedia',
            currentLanguage: 'Język:',
            setUserAvatar: 'Zmień awatar',
            logOut: 'Wyloguj',
            memberCounter: (n) => {
                const form = plural(n, 'użytkownik', 'użytkowników');
                return `${n} ${form}`;
            },
            messageInputPlaceholder: 'Wiadomość...',
            send: 'Wyślij',
            messageTranslation: 'Tłumacz',
            sourceLang: 'Język źródłowy',
            targetLang: 'Język docelowy',
            detectLang: 'rozponaj język',
            en: 'angielski',
            cs: 'czeski',
            fr: 'francuski',
            es: 'hiszpański',
            de: 'niemiecki',
            pl: 'polski',
            ru: 'rosyjski',
            sk: 'słowacki',
            it: 'włoski',
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
            addExistingRoom: 'Dodaj istniejącą grupę',
            roomJoinRequestPending: 'Wysyłanie prośby',
            roomJoinRequestSuccess: (roomName) => `Prośba o dołączenie do pokoju ${roomName} wysłana`,
            roomJoinRequestError: 'Wystąpił błąd podczas wysyłania prośby',
            addRoomMember: 'Dodaj członka grupy'
        }
    },
    en: {
        code: 'en',
        name: 'English',
        dict: {
            cancel: 'Cancel',
            username: 'Username',
            password: 'Password',
            repeatPassword: 'Repeat password',
            logIn: 'Log in',
            signUp: 'Sing up',
            goToSignUp: 'Create new account',
            goToLogIn: 'Already have an account?',
            turnOn: 'on',
            turnOff: 'off',
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
            roomSettings: 'Group settings',
            leaveRoom: 'Leave group',
            deleteRoom: 'Delete group',
            changeRoomName: 'Change group name',
            everyoneCanInvite: 'Everyone can invite',
            contactSidebarSettings: 'Conversation settings',
            deleteContact: 'Remove contact',
            members: 'Members',
            owner: 'owner',
            multimedia: 'Multimedia',
            currentLanguage: 'Language:',
            setUserAvatar: 'Set your avatar',
            logOut: 'Log out',
            memberCounter: (n) => (n === 1 ? '1 user' : n + ' users'),
            messageInputPlaceholder: 'Message...',
            send: 'Send',
            messageTranslation: 'Translator',
            sourceLang: 'Source language',
            targetLang: 'Target language',
            detectLang: 'detect language',
            en: 'English',
            cs: 'Czech',
            fr: 'French',
            es: 'Spanish',
            de: 'German',
            pl: 'Polish',
            ru: 'Russian',
            sk: 'Slovak',
            it: 'Italian',
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
            addExistingRoom: 'Add an existing group',
            roomJoinRequestPending: 'Sending a request',
            roomJoinRequestSuccess: (roomName) => `The join request has been sent`,
            roomJoinRequestError: 'Error occured',
            addRoomMember: 'Add a group member'
        }
    },
    de: {
        code: 'de',
        name: 'Deutsch',
        dict: {
            cancel: 'Abbrechen',
            username: 'Benutzername',
            password: 'Passwort',
            repeatPassword: 'Passwort bestätigen',
            logIn: 'Log in',
            signUp: 'Anmelden',
            goToSignUp: 'Anmelden',
            goToLogIn: 'Log in',
            turnOn: 'ein',
            turnOff: 'aus',
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
            roomSettings: 'Group settings',
            leaveRoom: 'Leave group',
            deleteRoom: 'Delete group',
            changeRoomName: 'Change group name',
            everyoneCanInvite: 'Everyone can invite',
            contactSidebarSettings: 'Conversation settings',
            deleteContact: 'Remove contact',
            members: 'Mitglieder',
            owner: 'Besitzer',
            multimedia: 'Multimedia',
            currentLanguage: 'Sprache:',
            setUserAvatar: 'Set your avatar',
            logOut: 'Log out',
            memberCounter: (n) => `${n} Benutzer`,
            messageInputPlaceholder: 'Die Nachricht...',
            send: 'Senden',
            messageTranslation: 'Übersetzer',
            sourceLang: 'Quellsprache',
            targetLang: 'Zielsprache',
            detectLang: 'Sprache erkennen',
            en: 'Englisch',
            cs: 'Tschechisch',
            fr: 'Französisch',
            es: 'Spanisch',
            de: 'Deutsch',
            pl: 'Polnisch',
            ru: 'Russisch',
            sk: 'Slowakisch',
            it: 'Italienisch',
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
            addExistingRoom: 'Add an existing group',
            roomJoinRequestPending: 'Sending a request',
            roomJoinRequestSuccess: (roomName) => `The join request has been sent`,
            roomJoinRequestError: 'Error occured',
            addRoomMember: 'Add a group member'
        }
    }
};

export const initialI18nContext = {
    langs,
    currentLang: langs.en
};

export const I18nContext = createContext(initialI18nContext);