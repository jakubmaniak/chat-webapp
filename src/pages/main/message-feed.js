import { useContext, useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';

import api from '../../api';
import { ContactsContext } from '../../contexts/contacts-context';
import { SocketContext } from '../../contexts/socket-context';
import { useOnListener } from '../../hooks/use-listener';
import Message from './message';
import { SessionContext } from '../../contexts/session-context';
import Loader from '../../common/loader';

function MessageFeed() {
    const { contacts } = useContext(ContactsContext);
    const { session } = useContext(SessionContext);
    const { socket } = useContext(SocketContext);
    
    const messageListRef = useRef();
    const [messages, setMessages] = useState([]);
    const [isLoadingMore, setIsLoadingMore] = useState(true);
    const [isEnded, setIsEnded] = useState(true);

    useEffect(() => {
        if (!contacts.currentContact) {
            return;
        }

        setMessages([]);
        setIsEnded(true);
        setIsLoadingMore(true);

        api.getMessages({ recipient: contacts.currentContact.name })
        .then((res) => {
            const messages = res.data.messages.map((msg) => {
                msg.date = dayjs(msg.date);
                return msg;
            });

            setMessages(messages);
            setIsEnded(res.data.ended);
            setIsLoadingMore(false);
        });
    }, [contacts.currentContact]);

    // useEffect(() => {
    //     if (isLoadingMore) {
    //         const { scrollHeight, offsetHeight } = messageListRef.current;
    //         messageListRef.current.scrollTop = -(scrollHeight - offsetHeight) + 24;
    //     }
    // }, [isLoadingMore]);


    useOnListener(socket.connection, 'messageReceived', (msg) => {
        msg.date = dayjs(msg.date);
        setMessages((messages) => [msg, ...messages]);
        setIsLoadingMore(false);
    }, [contacts.currentContact]);

    function onListScroll(ev) {
        if (isLoadingMore || isEnded) return;

        const { scrollTop, scrollHeight, offsetHeight } = ev.target;
        const touchingTop = (-scrollTop + 200 >= scrollHeight - offsetHeight);

        if (touchingTop) {
            setIsLoadingMore(true);

            const lastMessage = messages[messages.length - 1];

            api.getMessagesBefore({
                recipient: contacts.currentContact.name,
                messageID: lastMessage.id
            })
            .then((res) => {
                const loadedMessages = res.data.messages.map((msg) => {
                    msg.date = dayjs(msg.date);
                    return msg;
                });

                setMessages((messages) => [...messages, ...loadedMessages]);
                setIsEnded(res.data.ended);
                setIsLoadingMore(false);
            });
        }
    }

    function MessageAuthor({ authorName }) {
        return (
            <div className="message-author">
                <div className="message-author-avatar">{authorName.slice(0, 2)}</div>
                <p className="message-author-username">{authorName}</p>
            </div>
        );
    }

    function DateDelimeter({ date }) {
        return <p style={{
            color: '#707074',
            fontSize: '12px',
            fontWeight: '500',
            textTransform: 'uppercase',
            alignSelf: 'center'
        }}>{date.format('LLL')}</p>;
    }

    function renderMessages() {
        const items = [];

        if (messages.length) {
            let prevMessage = messages[0];

            for (const message of messages) {
                const prevMessageDay = prevMessage.date.startOf('day');
                const day = message.date.startOf('day');
                const isDaysVary = (prevMessageDay.diff(day, 'days') !== 0);

                if (isDaysVary || prevMessage.sender !== message.sender) {
                    items.push(<MessageAuthor
                        key={prevMessage.id + '-author'}
                        authorName={prevMessage.sender}
                    />);
                }

                if (isDaysVary) {
                    items.push(<DateDelimeter key={prevMessage.id + '-date'} date={prevMessage.date} />);
                }
    
                items.push(<Message
                    key={message.id}
                    id={message.id}
                    isOwned={message.sender === session.username}
                    content={message.content}
                    date={message.date}
                />);
    
                prevMessage = message;
            }
            
            items.push(<MessageAuthor
                key={prevMessage.id + '-author'}
                authorName={prevMessage.sender}
            />);

            items.push(<DateDelimeter key={prevMessage.id + '-date'} date={prevMessage.date} />);
        }

        if (isLoadingMore) {
            items.push(<Loader key="loader" margin="8px 0" />);
        }

        return items;
    }

    return <div className="message-list" onScroll={onListScroll} ref={messageListRef}>
        {renderMessages()}
    </div>;
}

export default MessageFeed;