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
        console.log({isLoadingMore, isEnded});
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

    function renderMessages() {
        const items = [];
        let lastMessage = messages[0];

        for (const message of messages) {
            if (lastMessage.sender !== message.sender) {
                items.push(<MessageAuthor authorName={lastMessage.sender} />);
            }

            items.push(<Message
                key={message.id}
                id={message.id}
                isOwned={message.sender === session.username}
                content={message.content}
                date={message.date}
            />);

            lastMessage = message;
        }
        
        if (lastMessage) {
            items.push(<MessageAuthor authorName={lastMessage.sender} />);
        }

        if (isLoadingMore) {
            items.push(<Loader margin="8px 0" />);
        }

        return items;
    }

    return <div className="message-list" onScroll={onListScroll} ref={messageListRef}>
        {renderMessages()}
    </div>;
}

export default MessageFeed;