import { useContext, useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';

import api from '../../api';
import { ContactsContext } from '../../contexts/contacts-context';
import { SocketContext } from '../../contexts/socket-context';
import { SessionContext } from '../../contexts/session-context';
import { ConversationContext } from '../../contexts/conversation-context';
import { useOnListener } from '../../hooks/use-listener';
import Message from './message';
import Loader from '../../common/loader';
import UserAvatar from '../../common/user-avatar';

import './message-feed.scss';
import useNav from '../../hooks/use-nav';


function MessageFeed() {
    const { navigateTo } = useNav();
    const { contacts } = useContext(ContactsContext);
    const { session } = useContext(SessionContext);
    const { socket } = useContext(SocketContext);
    const { conversation, setConversation } = useContext(ConversationContext);

    const messageListRef = useRef();
    const [messages, setMessages] = useState([]);
    const [isLoadingMore, setIsLoadingMore] = useState(true);
    const [isEnded, setIsEnded] = useState(true);


    useEffect(() => {
        setMessages([]);
        if (!contacts.currentContact) return;

        setIsEnded(true);
        setIsLoadingMore(true);

        let getMessages;

        if (contacts.currentContact.isRoom) {
            getMessages = api.getRoomMessages({ roomID: contacts.currentContact.id });

            api.getRoomState({ roomID: contacts.currentContact.id })
                .then((res) => {
                    setConversation({
                        isRoom: true,
                        roomID: res.data.id,
                        name: res.data.name,
                        owner: res.data.owner,
                        isEveryoneCanInvite: res.data.isEveryoneCanInvite,
                        users: new Map(res.data.users.map((user) => [user.username, user]))
                    });
                });
        }
        else {
            getMessages = api.getMessages({ recipient: contacts.currentContact.name });
        }

        getMessages
            .then((res) => {
                const messages = res.data.messages.map((msg) => ({ ...msg, date: dayjs(msg.date), animated: false }));

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
        msg.animated = true;

        if (msg.roomID) {
            if (contacts.currentContact.id !== msg.roomID) return;
        }
        else {
            const contactUsername = contacts.currentContact.name;

            if (
                (msg.sender === session.username && msg.recipient !== contactUsername)
                ||
                (msg.recipient === session.username && msg.sender !== contactUsername)
            ) {
                return;
            }
        }

        setMessages((messages) => [msg, ...messages]);
        //setIsLoadingMore(false);
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
                    const loadedMessages = res.data.messages.map((msg) => ({ ...msg, date: dayjs(msg.date), animated: false }));

                    setMessages((messages) => [...messages, ...loadedMessages]);
                    setIsEnded(res.data.ended);
                    setIsLoadingMore(false);
                });
        }
    }

    function MessageAuthor({ authorName }) {
        let avatarNode;

        if (contacts.currentContact?.isRoom) {
            avatarNode = <UserAvatar avatarID={conversation.users.get(authorName)?.avatar} name={authorName} />;
        }
        else {
            avatarNode = <div className="message-author-avatar">{authorName.slice(0, 2)}</div>;
        }

        return (
            <div className="message-author">
                {avatarNode}
                <p className="message-author-username">{authorName}</p>
            </div>
        );
    }

    function DateDelimeter({ date }) {
        return <p className="message-date-delimeter">{date.format('LLL')}</p>;
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
                    isAnimated={message.animated}
                    content={message.content}
                    hasAttachment={'attachment' in message}
                    attachment={message.attachment ?? null}
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


        if (contacts.users.length === 0 && contacts.rooms.length === 0) {
            items.push(<p className="no-contacts-placeholder">Nie masz kontaktów, ale nie przejmuj się tym</p>);
        }
        else if (isLoadingMore) {
            items.push(<Loader key="loader" margin="8px 0" />);
        }

        return items;
    }

    return (
        <div className="message-feed-container">
            <div className="message-feed-buttons-container">
                <button
                    className="message-feed-button-back"
                    data-tip="Kontakty"
                    onClick={() => navigateTo('left')}
                ></button>
                <div className="spacer"></div>
                <button
                    className="message-feed-button-sidebar"
                    data-tip="Ukryj pasek boczny"
                    onClick={() => navigateTo('right')}
                ></button>
            </div>
            <div className="message-list" onScroll={onListScroll} ref={messageListRef}>
                {renderMessages()}
            </div>
        </div>
    );
}

export default MessageFeed;