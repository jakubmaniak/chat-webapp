import { useContext, useEffect, useRef, useState } from 'react';
import { useCookies } from 'react-cookie';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/pl';

import api from '../../api';
import { SessionContext } from '../../contexts/session-context';
import { SocketContext } from '../../contexts/socket-context';
import Loader from '../../common/loader';
import Contacts from './contacts';

import './main.scss';


dayjs.extend(relativeTime);
dayjs.locale('pl');


function MainPage() {
    const { session, setSession } = useContext(SessionContext);
    const { socket, setSocket } = useContext(SocketContext);
    const [cookies, setCookies] = useCookies(['sid']);


    const [loading, setLoading] = useState(true);
    const [currentContact, setCurrentContact] = useState(null);
    const messageListElement = useRef();
    const [hoveredMessage, setHoveredMessage] = useState(null);
    const [shouldScrollDown, setShouldScrollDown] = useState(false);
    const groups = useRef([]);
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
        if (!socket.connected) {
            socket.connect(cookies.sid);
        }

        socket.connection.on('messageReceived', (ev) => {
            console.log(ev);

            if (ev.sender === currentContact || ev.sender === session.username) {
                addMessage(ev.content, dayjs(ev.date), ev.sender);
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
        setLoading(true);

        api.getMessages({ recipient: currentContact.name })
        .then((res) => {
            setLoading(false);
            addMessages(res.data);
        });
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
                date: dayjs(message.date),
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

    function addMessage(content, date = dayjs(), sender = session.username) {
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

        const messageContent = message.content
            .split(/((?:https?:\/\/|ftps?:\/\/|mailto:|magnet:)[^\s]+)/g)
            .map((segment, i) => (
                (i % 2)
                ? <a href={segment} rel="noopener noreferrer nofollow" target="_blank">{segment}</a>
                : segment
            ));

        return (
            <div className="message-row">
                <div
                    key={key}
                    className={className}
                    onMouseEnter={() => setHoveredMessage(message)}
                    onMouseLeave={() => setHoveredMessage(null)}
                >{messageContent}</div>
                {hoveredMessage === message
                    ? <p className="message-date">{message.date.fromNow()}</p>
                    : null
                }
            </div>
        );
    }

    function renderMessageGroups() {
        if (loading) {
            return <div style={{
                width: '100%',
                height: '100px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Loader />
            </div>;
        }

        if (groups.current.length === 0) {
            return <div style={{
                width: '100%',
                height: '100px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                userSelect: 'none'
            }}>
                <p style={{
                    color: '#707074',
                    fontWeight: '500',
                    fontSize: '14px'
                    
                }}>Brak wiadomości</p>
                <span style={{marginLeft: '4px', fontSize: '24px'}}>😢</span>
            </div>;
        }

        let results = groups.current.map((group, i) => (
            <div key={i} className="message-group">
                <div className="message-group-author">
                    <div className="message-group-author-avatar"></div>
                    <p className="message-group-author-username">{group.author}</p>
                </div>
                {group.messages.map((message, i) => renderMessage(i, message, group.author))}
            </div>
        ));
        return results;
    }

    return (
        <div className="main-container">
            <section className="left">
                <p>Kontakty</p>
                <Contacts onChange={setCurrentContact} />
            </section>
            <section className="right">
                <div className="message-list" ref={messageListElement}>
                    {renderMessageGroups()}
                </div>
                <form className="message-box" onSubmit={submitMessage}>
                    <input
                        className="message-input"
                        value={messageInputText}
                        placeholder="Wiadomość..."
                    />
                </form>
            </section>
        </div>
    );
}

export default MainPage;