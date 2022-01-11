import { useContext, useEffect, useState } from 'react';
import ReactTooltip from 'react-tooltip';

import { ContactsContext } from '../../contexts/contacts-context';
import { ConversationContext } from '../../contexts/conversation-context';
import { SocketContext } from '../../contexts/socket-context';
import UserAvatar from '../../common/user-avatar';

import './sidebar.scss';
import api from '../../api';
import ImageViewer from './image-viewer';
import DeleteRoomModal from '../../modals/delete-room-modal';
import LeaveRoomModal from '../../modals/leave-room-modal';
import ChangeRoomNameModal from '../../modals/change-room-name-modal';
import AddRoomMemberModal from '../../modals/add-room-member-modal';
import useI18n from '../../hooks/use-i18n';
import useNav from '../../hooks/use-nav';
import useToast from '../../hooks/use-toast';
import { useOnListener } from '../../hooks/use-listener';
import { SessionContext } from '../../contexts/session-context';


const statusTexts = {
    online: 'dostępny',
    brb: 'zaraz wracam',
    dnd: 'nie przeszkadzać',
    invisible: 'niewidoczny',
    offline: 'niedostępny'
};

function Sidebar() {
    const { i18n } = useI18n();
    const { navigateTo } = useNav();
    const toast = useToast();

    const { contacts, setContacts } = useContext(ContactsContext);
    const { conversation, setConversation } = useContext(ConversationContext);
    const { session } = useContext(SessionContext);
    const { socket } = useContext(SocketContext);
    const [userStatuses, setUserStatuses] = useState(() => new Map());
    const [attachments, setAttachments] = useState([]);
    const [displaysImageViewer, setDisplaysImageViewer] = useState(false);
    const [displayedAttachment, setDisplayedAttachment] = useState(null);

    const [settingsMenuVisible, setSettingsMenuVisible] = useState(false);
    const [addRoomMemberModalVisible, setAddRoomMemberModalVisible] = useState(false);
    const [changeRoomNameModalVisible, setChangeRoomNameModalVisible] = useState(false);
    const [changeRoomImageModalVisible, setChangeRoomImageModalVisible] = useState(false);
    const [leaveRoomModalVisible, setLeaveRoomModalVisible] = useState(false);
    const [deleteRoomModalVisible, setDeleteRoomModalVisible] = useState(false);

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
        if (!socket.connected) return;

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

    useOnListener(socket.connection, 'roomMemberJoined', (ev) => {
        if (contacts.currentContact?.isRoom && contacts.currentContact?.id === ev.roomID) {
            const newUsers = new Map([...conversation.users]);
            newUsers.set(ev.username, ev);

            setConversation({
                ...conversation,
                users: newUsers
            });
        }
    }, [contacts.currentContact, conversation]);

    useOnListener(socket.connection, 'roomMemberLeft', (ev) => {
        if (contacts.currentContact?.isRoom && contacts.currentContact?.id === ev.roomID) {
            const newUsers = new Map([...conversation.users]);
            newUsers.delete(ev.username);

            setConversation({
                ...conversation,
                users: newUsers
            });
        }
    }, [contacts.currentContact, conversation]);

    useEffect(() => {
        if (contacts.currentContact?.isRoom) {
            api.getRoomAttachments({ roomID: contacts.currentContact.id })
                .then((res) => {
                    setAttachments(res.data.attachments);
                });

            ReactTooltip.rebuild();
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
            return i18n('memberCounter')(conversation.users.size);
        }
        else {
            return statusTexts[contacts.currentContact.status];
        }
    }

    function handleLeaveRoom() {
        const currentRoom = contacts.currentContact;

        setContacts({
            ...contacts,
            rooms: contacts.rooms.filter((room) => room.id !== currentRoom.id),
            currentContact: null
        });

        api.leaveRoom({ roomID: currentRoom.id });
    }

    function handleDeleteRoom() {
        const currentRoom = contacts.currentContact;
        //const currentRoomIndex = contacts.rooms.findIndex((room) => room.id === currentRoom.id);
        //api.deleteRoom(contacts.currentContact.id)

        // const newRoomIndex = currentRoomIndex - 1;

        // if (contacts.rooms.length === 1) {

        // }
        // else if (newRoomIndex < 0) {
        //     newRoomIndex = 0;
        // }

        api.deleteRoom({ roomID: contacts.currentContact.id });

        // setContacts({
        //     ...contacts,
        //     rooms: contacts.rooms.filter((room) => room.id !== currentRoom.id),
        //     currentContact: null
        // });
    }

    function handleRoomNameChange(roomName) {
        const currentRoom = contacts.currentContact;

        api.updateRoom({ roomID: currentRoom.id, property: 'name', value: roomName })
            .then(() => {
                const rooms = contacts.rooms.map((room) => {
                    if (room.id === currentRoom.id) {
                        return { ...room, name: roomName };
                    }
                    else return room;
                });

                setContacts({
                    ...contacts,
                    rooms,
                    currentContact: { ...contacts.currentContact, name: roomName }
                });
            });
    }

    function handleAddRoomMember(selectedUser) {
        if (!selectedUser) return;

        api.sendInvitation({
            invitee: selectedUser.username,
            roomID: contacts.currentContact.id
        })
            .then(() => console.log('Wysłano zaproszenie'));
    }

    function handleDeleteContact() {
        api.deleteContact({ username: contacts.currentContact.name });
        setSettingsMenuVisible(false);
    }


    function renderMembers() {
        return [...conversation.users.values()].map((user) => {
            return (
                <div key={user.username} className={'sidebar-room-member ' + userStatuses.get(user.username)}>
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

    function renderSettingsMenu() {
        if (!settingsMenuVisible) return null;

        if (contacts.currentContact?.isRoom) {
            const isRoomOwner = (conversation.owner === session.username);

            return (
                <div className="menu-wrapper">
                    <div className="menu-overlay" onClick={() => setSettingsMenuVisible(false)}></div>
                    <div className="sidebar-settings-menu" onClick={() => setSettingsMenuVisible(false)}>
                        {isRoomOwner && <p onClick={() => setChangeRoomNameModalVisible(true)}>Zmień nazwę grupy</p>}
                        {isRoomOwner && <p>Wszyscy mogą zapraszać: wył</p>}
                        {isRoomOwner && <p className="separator"></p>}
                        <p
                            className="unsafe"
                            onClick={() => setLeaveRoomModalVisible(true)}
                        >Opuść grupę</p>
                        {isRoomOwner && <p
                            className="unsafe"
                            onClick={() => setDeleteRoomModalVisible(true)}
                        >Usuń grupę</p>}
                    </div>
                </div>
            );
        }
        else if (contacts.currentContact?.isRoom === false) {
            return (
                <div className="menu-wrapper">
                    <div className="menu-overlay" onClick={() => setSettingsMenuVisible(false)}></div>
                    <div className="sidebar-settings-menu">
                        <p className="unsafe">Zablokuj użytkownika</p>
                        <p className="unsafe" onClick={handleDeleteContact}>Usuń kontakt</p>
                    </div>
                </div>
            );
        }

        return null;
    }

    if (contacts.users.length === 0 && contacts.rooms.length === 0) {
        return null;
    }

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <button className="sidebar-back-button" onClick={() => navigateTo('center')}></button>
                <UserAvatar
                    avatarID={contacts.currentContact?.avatar}
                    name={contacts.currentContact?.name}
                    wide={contacts.currentContact?.isRoom}
                />
                <div className="conversation-info-box">
                    <p className="conversation-name">{contacts.currentContact?.name}</p>
                    <p className="conversation-extra-info">{getConversationExtraInfo()}</p>
                </div>
                <button className="sidebar-settings-button"
                    data-tip={(contacts.currentContact?.isRoom ? 'Ustawienia grupy' : 'Ustawienia konwersacji')}
                    onClick={() => setSettingsMenuVisible(true)}
                ></button>
                {renderSettingsMenu()}
            </div>
            <div className="sidebar-sections">
                {contacts.currentContact?.isRoom && (
                    <div className="sidebar-section">
                        <div className="sidebar-section-header">
                            <div className="sidebar-section-title">{i18n('members')}</div>
                            <button
                                className="sidebar-add-button"
                                data-tip="Dodaj członka grupy"
                                onClick={() => setAddRoomMemberModalVisible(true)}
                            ></button>
                        </div>
                        <div className="sidebar-section-content">
                            {renderMembers()}
                        </div>
                    </div>
                )}
                {(attachments.length > 0) && (
                    <div className="sidebar-section">
                        <div className="sidebar-section-header">
                            <div className="sidebar-section-title">{i18n('multimedia')}</div>
                        </div>
                        <div className="sidebar-section-content sidebar-attachments">
                            {renderMultimedia()}
                        </div>
                    </div>
                )}
            </div>
            {addRoomMemberModalVisible && <AddRoomMemberModal
                visible
                onClose={() => setAddRoomMemberModalVisible(false)}
                onSubmit={handleAddRoomMember}
            />}
            {changeRoomNameModalVisible && <ChangeRoomNameModal
                visible
                roomName={contacts.currentContact?.name}
                onClose={() => setChangeRoomNameModalVisible(false)}
                onSubmit={handleRoomNameChange}
            />}
            <LeaveRoomModal
                visible={leaveRoomModalVisible}
                onClose={() => setLeaveRoomModalVisible(false)}
                onSubmit={handleLeaveRoom}
            />
            <DeleteRoomModal
                visible={deleteRoomModalVisible}
                onClose={() => setDeleteRoomModalVisible(false)}
                onSubmit={handleDeleteRoom}
            />
            {displaysImageViewer && <ImageViewer attachment={displayedAttachment} onClose={() => setDisplaysImageViewer(false)} />}
        </div>
    );
}

export default Sidebar;