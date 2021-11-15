import { useContext, useEffect, useState } from 'react';

import plural from '../../helpers/plural';
import { ContactsContext } from '../../contexts/contacts-context';
import { ConversationContext } from '../../contexts/conversation-context';
import { SocketContext } from '../../contexts/socket-context';
import UserAvatar from '../../common/user-avatar';

import './sidebar.scss';


const statusTexts = {
    online: 'dostępny',
    brb: 'zaraz wracam',
    dnd: 'nie przeszkadzać',
    invisible: 'niewidoczny',
    offline: 'niedostępny'
};

function Sidebar() {
    const { contacts } = useContext(ContactsContext);
    const { conversation } = useContext(ConversationContext);
    const { socket } = useContext(SocketContext);
    const [userStatuses, setUserStatuses] = useState(() => new Map());

    useEffect(() => {
        if (conversation.isRoom) {
            let newStatuses = new Map();

            if (conversation.users) {
                newStatuses = new Map([...conversation.users.values()].map((user) => [user.username, user.status]));
            }

            setUserStatuses(newStatuses);
        }
    }, [conversation])

    useEffect(() => {
        socket.connection?.on('userStatusChanged', (ev) => {
            setUserStatuses((userStatuses) => {
                return new Map([...userStatuses.entries(), [ev.username, ev.status]]);
            });
        });
    }, [socket.connected]);

    function getConversationExtraInfo() {
        if (!contacts.currentContact) return;

        if (contacts.currentContact.isRoom) {
            const form = plural(conversation.users.size, 'użytkownik', 'użytkowników');
            return conversation.users.size + ' ' + form;
        }
        else {
            return statusTexts[contacts.currentContact.status];
        }
    }

    function renderMembers() {
        return [...conversation.users.values()].map((user) => {
            return (
                <div key={user.id} className={'sidebar-room-member ' + userStatuses.get(user.username)}>
                    <UserAvatar avatarID={user.avatar} name={user.username} />
                    <span className="sidebar-room-member-username">{user.username}</span>
                    <div className="sidebar-room-member-status"></div>
                </div>
            );
        });
    }

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <UserAvatar
                    avatarID={contacts.currentContact?.avatar}
                    name={contacts.currentContact?.name}
                    wide={contacts.currentContact?.isRoom}
                />
                <div className="conversation-info-box">
                    <p className="conversation-name">{contacts.currentContact?.name}</p>
                    <p className="conversation-extra-info">{getConversationExtraInfo()}</p>
                </div>
                <button className="sidebar-settings-button"></button>
            </div>
            <div className="sidebar-sections">
                {contacts.currentContact?.isRoom && (
                    <div className="sidebar-section">
                        <div className="sidebar-section-header">
                            <div className="sidebar-section-title">Członkowie</div>
                            <button className="sidebar-add-button"></button>
                        </div>
                        <div className="sidebar-section-content">
                            {renderMembers()}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Sidebar;