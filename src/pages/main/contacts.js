import { useContext, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';

import api from '../../api';
import { SessionContext } from '../../contexts/session-context';
import { SocketContext } from '../../contexts/socket-context';
import { ContactsContext } from '../../contexts/contacts-context';
import { useOnListener } from '../../hooks/use-listener';
import Loader from '../../common/loader';
import UserAvatar from '../../common/user-avatar';
import CreateRoomModal from '../../modals/create-room-modal';

import './contacts.scss';
import AddUserModal from '../../modals/add-user-modal';
import useI18n from '../../hooks/use-i18n';
import AddRoomModal from '../../modals/add-room-modal';
import useNav from '../../hooks/use-nav';


function Contacts() {
    const history = useHistory();
    const { navigateTo } = useNav();
    const { type: typeParam, contact: contactParam } = useParams();
    const { i18n } = useI18n();

    const { session } = useContext(SessionContext);
    const { socket } = useContext(SocketContext);
    const { contacts, setContacts } = useContext(ContactsContext);

    const [isLoading, setIsLoading] = useState(true);
    const [modalVisibility, setModalVisibility] = useState({
        createRoom: false,
        addRoom: false,
        addContact: false
    });
    const [addRoomMenuVisible, setAddRoomMenuVisible] = useState(false);

    function setUsers(newUsers) {
        setContacts({ ...contacts, users: newUsers });
    }

    function setRooms(newRooms) {
        setContacts({ ...contacts, rooms: newRooms });
    }

    function changeCurrentContact(contact = null) {
        if (contact === null) {
            if (contacts.users.length === 0 && contacts.rooms.length === 0) {
                setContacts({ ...contacts, currentContact: null });

                history.push('/messages');
                navigateTo('left');

                //console.log('a', contacts);
                return;
            }
            else if (contacts.users.length === 0) {
                //console.log('b', contacts);
                contact = contacts.rooms[0];
            }
            else if (contacts.rooms.length === 0) {
                //console.log('c', contacts);
                contact = contacts.users[0];
            }
            else {
                contact = contacts.users[0];
                //contact = contacts.users[0];
                //console.log('d');
            }
        }
        // else if (contact?.not) {
        //     if (contacts.users.length === 0 && contacts.rooms.length === 0) {
        //         setContacts({ ...contacts, currentContact: null });

        //         history.push('/messages');
        //         navigateTo('left');

        //         return;
        //     }

        //     let candidates = [...contacts.users, ...contacts.rooms];

        //     candidates = candidates.filter((c) => {
        //         if (contact.not.room && c.isRoom && c.id === contact.not.id) {
        //             return false;
        //         }

        //         if (!contact.not.room && !c.isRoom && c.name === contact.not.username) {
        //             return false;
        //         }

        //         return true;
        //     });

        //     if (candidates.length) {
        //         contact = candidates[0];
        //     }
        //     else {
        //         setContacts({ ...contacts, currentContact: null });

        //         history.push('/messages');
        //         navigateTo('left');

        //         return;
        //     }
        // }

        console.log('changed to', contact);

        contact.unreadCount = 0; // WARNING: changing directly the value of property
        setContacts({ ...contacts, currentContact: contact });

        if (contact.isRoom) {
            history.push('/messages/room/' + contact.id);
        }
        else {
            history.push('/messages/user/' + contact.name);
        }

        navigateTo('center');
    }


    useEffect(() => {
        api.getContacts()
            .then((res) => {
                // if (res.data.users.length === 0 && res.data.rooms.length === 0) {
                //     setContacts({ ...contacts, noContacts: true });
                // }
                // else {
                //     setContacts({ ...contacts, noContacts: false });
                // }

                const newUsers = res.data.users.map((user) => ({
                    isRoom: false,
                    id: user.id,
                    name: user.username,
                    avatar: user.avatar,
                    status: user.status,
                    unreadCount: 0
                }));

                const newRooms = res.data.rooms.map((room) => ({
                    isRoom: true,
                    id: room.id,
                    name: room.name,
                    iconText: room.name.slice(0, 3),
                    iconColor: [0x7c, 0x4b, 0xcc],
                    unreadCount: 0
                }));

                if ((!contactParam || !typeParam)) {
                    if (newUsers.length) {
                        changeCurrentContact(newUsers[0]);
                    }
                    else if (newRooms.length) {
                        changeCurrentContact(newRooms[0]);
                    }

                }

                setUsers(newUsers);
                setRooms(newRooms);
                setContacts({ ...contacts, users: newUsers, rooms: newRooms });
                setIsLoading(false);
            });
    }, []);

    useEffect(() => {
        if (isLoading) return;

        if (contactParam) {
            if (typeParam.toLowerCase() === 'room') {
                const room = contacts.rooms.find((room) => room.id === contactParam);
                changeCurrentContact(room ?? null);
            }
            else if (typeParam.toLowerCase() === 'user') {
                const user = contacts.users.find((user) => user.name === contactParam);
                changeCurrentContact(user ?? null);
            }
            else {
                changeCurrentContact(null);
            }
        }
    }, [contactParam, typeParam, isLoading]);

    useEffect(() => {
        if (!socket.connected) {
            return;
        }

        socket.connection.on('userStatusChanged', (ev) => {
            const userIndex = contacts.users.findIndex((user) => user.name === ev.username);

            if (userIndex >= 0) {
                const newUsers = [...contacts.users];
                newUsers[userIndex] = { ...newUsers[userIndex], status: ev.status };

                setUsers(newUsers);
            }
        });
    }, [socket.connected]);

    useOnListener(socket.connection, 'contactAdded', (ev) => {
        setUsers([
            ...contacts.users,
            {
                isRoom: false,
                id: ev.id,
                name: ev.username,
                avatar: ev.avatar,
                status: ev.status,
                unreadCount: 0
            }
        ]);
    }, [contacts]);

    useOnListener(socket.connection, 'contactDeleted', (ev) => {
        setUsers(contacts.users.filter((user) => user.name !== ev.username));
    }, [contacts]);

    useOnListener(socket.connection, 'roomJoined', (ev) => {
        setRooms([
            ...contacts.rooms,
            {
                isRoom: true,
                id: ev.id,
                name: ev.name,
                iconText: ev.name.slice(0, 3),
                iconColor: [0x7c, 0x4b, 0xcc],
                unreadCount: 0
            }
        ]);
    });

    useOnListener(socket.connection, 'roomLeft', (ev) => {
        setRooms(contacts.rooms.filter((room) => room.id !== ev.id));
    }, [contacts]);

    useEffect(() => {
        console.log(contacts, contacts.rooms);
        if (!contacts.users.includes(contacts.currentContact) && !contacts.rooms.includes(contacts.currentContact)) {
            changeCurrentContact(null);
        }
    }, [contacts.currentContact, contacts.users, contacts.rooms]);

    useOnListener(socket.connection, 'messageReceived', (msg) => {
        const isRoom = !!msg.roomID;
        const contactUsername = contacts.currentContact.name;
        const currentRoomID = contacts.currentContact.id;

        if (!isRoom && (
            (msg.sender === session.username && msg.recipient !== contactUsername)
            ||
            (msg.recipient === session.username && msg.sender !== contactUsername)
        )) {
            const userIndex = contacts.users.findIndex((user) => user.name === msg.sender);

            const newUsers = [...contacts.users];
            newUsers[userIndex] = {
                ...contacts.users[userIndex],
                unreadCount: newUsers[userIndex].unreadCount + 1
            };

            setUsers(newUsers);
        }
        else if (isRoom && currentRoomID !== msg.roomID) {
            const roomIndex = contacts.rooms.findIndex((room) => room.id === msg.roomID);

            const newRooms = [...contacts.rooms];
            newRooms[roomIndex] = {
                ...contacts.rooms[roomIndex],
                unreadCount: newRooms[roomIndex].unreadCount + 1
            };

            setRooms(newRooms);
        }
    }, [contacts.currentContact, contacts.rooms, contacts.users]);

    function showModal(dialogID) {
        setModalVisibility({ ...modalVisibility, [dialogID]: true });
    }

    function hideModal(dialogID) {
        setModalVisibility({ ...modalVisibility, [dialogID]: false });
    }

    function handleRoomCreate(roomName) {
        api.createRoom({ name: roomName })
            .then((res) => {
                const newRoom = {
                    isRoom: true,
                    id: res.data.id,
                    name: roomName,
                    iconText: roomName.slice(0, 3),
                    iconColor: [0x7c, 0x4b, 0xcc],
                    unreadCount: 0
                };

                setContacts({
                    ...contacts,
                    rooms: [...contacts.rooms, newRoom],
                    currentContact: newRoom
                });
            });
    }

    function handleCreateRoom() {
        setAddRoomMenuVisible(false);
        showModal('createRoom');
    }

    function handleAddRoom() {
        setAddRoomMenuVisible(false);
        showModal('addRoom');
    }


    function renderAddRoomMenu() {
        return (
            <div className="menu-wrapper">
                <div className="menu-overlay" onClick={() => setAddRoomMenuVisible(false)}></div>
                <div className="add-room-menu">
                    <p onClick={handleCreateRoom}>{i18n('createRoom')}</p>
                    <p onClick={handleAddRoom}>{i18n('addExistingRoom')}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="contact-list">
            <div className="contact-section">
                <div className="contact-section-header">
                    <p className="contact-section-title">{i18n('people').toUpperCase()}</p>
                    <button
                        className="contact-section-button"
                        onClick={() => showModal('addContact')}
                        data-tip={i18n('addContact')}
                    >+</button>
                </div>
                <div className="contact-section-entries">
                    {isLoading && <Loader />}
                    {contacts.users?.map?.((user) => (
                        <button
                            key={user.id}
                            className={(user.name === contacts.currentContact?.name ? 'contact active' : 'contact')}
                            onClick={() => changeCurrentContact(user)}
                        >
                            <UserAvatar avatarID={user.avatar} name={user.username} />
                            <p className="contact-name">{user.name + (user.name === session.username ? ' (Ty)' : '')}</p>
                            {
                                (user.unreadCount === 0)
                                    ? <div className={'contact-status ' + user.status} />
                                    : <div className={'contact-unread-counter ' + user.status}>{user.unreadCount}</div>
                            }
                        </button>
                    ))}
                </div>
            </div>
            <div className="contact-section">
                <div className="contact-section-header">
                    <p className="contact-section-title">{i18n('rooms').toUpperCase()}</p>
                    <button
                        className="contact-section-button"
                        onClick={() => setAddRoomMenuVisible(true)}
                        data-tip={i18n('addRoom')}
                    >+</button>
                    <CreateRoomModal
                        visible={modalVisibility.createRoom}
                        onClose={() => hideModal('createRoom')}
                        onSubmit={handleRoomCreate}
                    />
                    {modalVisibility.addRoom && (
                        <AddRoomModal
                            visible
                            onClose={() => hideModal('addRoom')}
                        />
                    )}
                    {modalVisibility.addContact && (
                        <AddUserModal
                            visible
                            onClose={() => hideModal('addContact')}
                        />
                    )}
                    {addRoomMenuVisible && renderAddRoomMenu()}
                </div>
                <div className="contact-section-entries">
                    {isLoading && <Loader />}
                    {contacts.rooms?.map?.((room) => (
                        <button
                            key={room.id}
                            className={(room.id === contacts.currentContact?.id ? 'contact active' : 'contact')}
                            onClick={() => changeCurrentContact(room)}
                        >
                            <UserAvatar name={room.name} wide />
                            <p className="contact-name">{room.name}</p>
                            {(room.unreadCount !== 0)
                                && <div className={'contact-unread-counter online'}>{room.unreadCount}</div>
                            }
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Contacts;