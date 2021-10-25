import { useContext, useEffect, useRef, useState } from 'react';
import { useCookies } from 'react-cookie';
import socketio from 'socket.io-client';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/pl';


import api from '../../api';
import { SessionContext } from '../../contexts/session-context';
import Contacts from './contacts';

import './main.scss';

dayjs.extend(relativeTime);


function MainPage() {
    const { session, setSession } = useContext(SessionContext);
    const [cookies, setCookies] = useCookies(['sid']);

    const socket = useRef();

    const [currentContact, setCurrentContact] = useState(null);
    const messageListElement = useRef();
    const [hoveredMessage, setHoveredMessage] = useState(null);
    const [shouldScrollDown, setShouldScrollDown] = useState(false);
    const groups = useRef([
        {
            author: 'admin',
            messages: [
                { content: 'hej', date: dayjs(new Date('2020-02-21 10:23:22')), animated: false },
                { content: 'co tam?', date: dayjs(new Date('2020-02-21 10:23:29')), animated: false }
            ]
        },
        {
            author: 'snowanka',
            messages: [
                { content: 'nic tam', date: dayjs(new Date('2020-02-21 10:25:59')), animated: false },
                { content: 'co tam?', date: dayjs(new Date('2020-02-21 10:26:15')), animated: false },
                { content: 'nic tam', date: dayjs(new Date('2020-02-21 10:26:21')), animated: false },
            ]
        }
    ]);
    const [messageInputText, setMessageInputText] = useState('');

    const [emojis] = useState({
        ':)': '🙂',
        ':(': '🙁',
        ';)': '😉',
        ';(': '😢',
        ':|': '😐',
        ':{': '🤮',
        '8)': '😎',
        '(:': '🙃',
        ':o': '😮',
        ':p': '😜',
        'XD': '😆',
        '3)': '😈',
        '>(': '😡',
        'x(': '😣',
        ':#': '🤬',
        ':*': '😘',
        '}:o': '🤯',
        't.t': '😭',
        '(y)': '👍',
        '(n)': '👎',
        '(m)': '👊',
        '(w)': '✋',
        '<3': '❤️'
    });

    useEffect(() => {
        socket.current = socketio({
            query: { httpsid: cookies.sid }
        });
        socket.current.on('connect', () => console.log('connect'));

        socket.current.on('messageReceived', (ev) => {
            console.log(ev);

            if (ev.sender === currentContact || ev.sender === session.username) {
                addMessage(ev.content, new Date(ev.date), ev.sender);
            }
        });
    }, []);

    useEffect(() => {
        if (currentContact) {
            loadMessages();
        }
    }, [currentContact]);

    useEffect(() => {
        if (shouldScrollDown) {
            messageListElement.current.scrollTop = 99999;
            setShouldScrollDown(false);
        }
    }, [shouldScrollDown]);

    function loadMessages() {
        api.getMessages({ recipient: currentContact.name })
        .then((res) => addMessages(res.data));
    }

    function submitMessage(ev) {
        ev.preventDefault();

        api.sendMessage({ recipient: currentContact.name, content: messageInputText });
        setMessageInputText('');
    }

    function addMessages(messages) {
        let newGroups = [];//[...groups];
        let lastGroup = newGroups[newGroups.length - 1];

        for (let message of messages) {
            let newMessage = {
                content: message.content,
                date: dayjs(new Date(message.date)),
                animated: false
            };

            if (!lastGroup || lastGroup.author !== message.sender) {
                newGroups.push({
                    author: message.sender,
                    messages: [newMessage]
                });

                lastGroup = newGroups[newGroups.length - 1];
            }
            else {
                lastGroup.messages.push(newMessage);
            }
        }

        groups.current = newGroups;
        setShouldScrollDown(true);
    }

    function addMessage(content, date = dayjs(new Date()), sender = session.username) {
        let newMessage = { content, date, animated: true };
        let lastGroup = { ...groups.current[groups.current.length - 1] };

        if (!lastGroup || lastGroup.author !== sender) {
            let newGroup = {
                author: sender,
                messages: [newMessage]
            };
            groups.current = [...groups.current, newGroup];
        }
        else {
            lastGroup.messages.push(newMessage);
            let newGroups = [...groups.current];
            newGroups[newGroups.length - 1] = lastGroup;

            groups.current = newGroups;
        }

        setShouldScrollDown(true);
    }

    function renderMessage(key, message, sender) {
        let className = 'message';
        
        if (sender === session.username) {
            className += ' owned';
        }

        if (message.animated) {
            className += ' animated';
        }

        return (
            <div className="message-row">
                <div
                    key={key}
                    className={className}
                    onMouseEnter={() => setHoveredMessage(message)}
                    onMouseLeave={() => setHoveredMessage(null)}
                >{message.content}</div>
                {hoveredMessage === message
                    ? <p className="message-date">{message.date.locale('pl').fromNow()}</p>
                    : null
                }
            </div>
        );
    }

    return (
        <div className="main-container">
            <section className="left">
                <p>Kontakty</p>
                <Contacts onChange={setCurrentContact} />
            </section>
            <section className="right">
                <div className="message-list" ref={messageListElement}>
                    {groups.current.map((group, i) => (
                        <div key={i} className="message-group">
                            <div className="message-group-author">
                                <div className="message-group-author-avatar"></div>
                                <p className="message-group-author-username">{group.author}</p>
                            </div>
                            {group.messages.map((message, i) => renderMessage(i, message, group.author))}
                        </div>
                    ))}
                </div>
                <form className="message-box" onSubmit={submitMessage}>
                    <input
                        className="message-input"
                        value={messageInputText}
                        onChange={(ev) => setMessageInputText(ev.target.value)}
                        placeholder="Wiadomość..."
                    />
                </form>
            </section>
        </div>
    );
}

export default MainPage;