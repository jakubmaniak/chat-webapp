import { useContext, useEffect, useState } from 'react';

import plural from '../../helpers/plural';
import { ContactsContext } from '../../contexts/contacts-context';
import { ConversationContext } from '../../contexts/conversation-context';
import { SocketContext } from '../../contexts/socket-context';
import UserAvatar from '../../common/user-avatar';

import './sidebar.scss';
import api from '../../api';
import ImageViewer from './image-viewer';
import Tooltip from '../../common/tooltip';


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
    const [attachments, setAttachments] = useState([]);
    const [displaysImageViewer, setDisplaysImageViewer] = useState(false);
    const [displayedAttachment, setDisplayedAttachment] = useState(null);

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

        socket.connection?.on('messageReceived', (msg) => {
            if (msg.attachment) {
                setAttachments((attachments) => [msg.attachment, ...attachments]);
            }
        });
    }, [socket.connected]);

    useEffect(() => {
        if (contacts.currentContact?.isRoom) {
            api.getRoomAttachments({ roomID: contacts.currentContact.id })
                .then((res) => {
                    setAttachments(res.data.attachments);
                });
        }
        else if (contacts.currentContact?.isRoom === false) {
            api.getAttachments({ recipient: contacts.currentContact.name })
            .then((res) => {
                setAttachments(res.data.attachments);
            });
        }
    }, [contacts.currentContact]);

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

    function renderMultimedia() {
        const images = attachments.filter((attachment) => attachment.type === 'image');

        return images.map((image, i) => {
            const firstRow = (i < 3);
            const lastRow = (Math.floor(i / 3) === Math.floor((images.length - 1) / 3));
            const first = (i === 0);
            const last = (i === images.length - 1);
            const firstInRow = (i % 3 === 0);
            const nextRowLast = (Math.floor(i / 3) + 1 === Math.floor((images.length - 1) / 3));
            const lastRowFull = (images.length % 3 === 0);

            const borderRadius = [0, 0, 0, 0];

            if (first) {
                borderRadius[0] = '10px';
            }

            if (lastRow && firstInRow) {
                borderRadius[3] = '10px';
            }

            if (last) {
                borderRadius[2] = '10px';

                if (firstRow) {
                    borderRadius[1] = '10px';
                }
            }

            if (nextRowLast && !lastRowFull && i % 3 == 2) {
                borderRadius[2] = '10px';
            }

            if (images.length > 3 && i == 2) {
                borderRadius[1] = '10px';
            }

            return (
                <div
                    key={image.fileName}
                    data-key={image.fileName}
                    className="sidebar-attachment"
                    onClick={() => { setDisplayedAttachment(image); setDisplaysImageViewer(true); }}>
                    <div
                        className="sidebar-attachment-image"
                        style={{
                            backgroundImage: `url('http://localhost:3002/attachments/${image.fileName}')`,
                            borderRadius: borderRadius.join(' ')
                        }}
                    ></div>
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
                <Tooltip text={(contacts.currentContact?.isRoom ? 'Ustawienia grupy' : 'Ustawienia konwersacji')} horizontalPosition="left">
                    <button className="sidebar-settings-button"></button>
                </Tooltip>
            </div>
            <div className="sidebar-sections">
                {contacts.currentContact?.isRoom && (
                    <div className="sidebar-section">
                        <div className="sidebar-section-header">
                            <div className="sidebar-section-title">Członkowie</div>
                            <Tooltip text="Dodaj członka grupy" horizontalPosition="left">
                                <button className="sidebar-add-button"></button>
                            </Tooltip>
                        </div>
                        <div className="sidebar-section-content">
                            {renderMembers()}
                        </div>
                    </div>
                )}
                {(attachments.length > 0) && (
                    <div className="sidebar-section">
                        <div className="sidebar-section-header">
                            <div className="sidebar-section-title">Multimedia</div>
                        </div>
                        <div className="sidebar-section-content sidebar-attachments">
                            {renderMultimedia()}
                        </div>
                    </div>
                )}
            </div>
            {displaysImageViewer && <ImageViewer attachment={displayedAttachment} onClose={() => setDisplaysImageViewer(false)} />}
        </div>
    );
}

export default Sidebar;