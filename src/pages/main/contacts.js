import { useContext, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';

import api from '../../api';
import { SessionContext } from '../../contexts/session-context';
import { SocketContext } from '../../contexts/socket-context';
import { ContactsContext } from '../../contexts/contacts-context';
import { useOnListener } from '../../hooks/use-listener';
import Loader from '../../common/loader';
import CreateRoomModal from './modals/create-room-modal';

import './contacts.scss';


function Contacts() {
    const history = useHistory();
    const { type: typeParam, contact: contactParam } = useParams();
    const { session } = useContext(SessionContext);
    const { socket } = useContext(SocketContext);
    const { contacts, setContacts } = useContext(ContactsContext);

    const [isLoading, setIsLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [rooms, setRooms] = useState([
        { isRoom: true, id: 'dev', name: 'Developers', iconText: 'Dev', iconColor: [0x7c, 0x4b, 0xcc], unreadCount: 0 },
        { isRoom: true, id: 'spam', name: 'SPAM', iconText: 'SP', iconColor: [0x00, 0x93, 0x78], unreadCount: 0 }
    ]);
    const [modalVisibility, setModalVisibility] = useState({ createRoom: false });

    function changeCurrentContact(contact) {
        contact.unreadCount = 0; // WARNING: changing directly the value of property
        setContacts({ ...contacts, currentContact: contact });

        if (contact.isRoom) {
            history.push('/messages/room/' + contact.id);
        }
        else {
            history.push('/messages/user/' + contact.name);
        }
    }


    useEffect(() => {
        api.getContacts()
            .then((res) => {
                const newUsers = res.data.users.map((user) => ({
                    isRoom: false,
                    id: user.id,
                    name: user.username,
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

                if ((!contactParam || !typeParam) && newUsers.length) {
                    changeCurrentContact(newUsers[0]);
                }

                setUsers(newUsers);
                setRooms(newRooms);
                setIsLoading(false);
            });
    }, []);

    useEffect(() => {
        if (isLoading) return;

        if (contactParam) {
            if (typeParam.toLowerCase() === 'room') {
                const room = rooms.find((room) => room.id === contactParam);

                if (room) {
                    changeCurrentContact(room);
                }
            }
            else if (typeParam.toLowerCase() === 'user') {
                const user = users.find((user) => user.name === contactParam);

                if (user) {
                    changeCurrentContact(user);
                }
            }
            else {
                history.push('/messages');
            }
        }
    }, [contactParam, typeParam, isLoading]);

    useEffect(() => {
        if (!socket.connected) {
            return;
        }

        socket.connection.on('userStatusChanged', (ev) => {
            setUsers((users) => {
                let newUsers = [...users];
                const userIndex = newUsers.findIndex((user) => user.name === ev.username);
                newUsers[userIndex] = { ...users[userIndex], status: ev.status };

                return newUsers;
            });
        });
    }, [socket.connected]);

    useOnListener(socket.connection, 'messageReceived', (msg) => {
        const isRoom = !!msg.roomID;
        const contactUsername = contacts.currentContact.name;
        const currentRoomID = contacts.currentContact.id;

        if (!isRoom && (
            (msg.sender === session.username && msg.recipient !== contactUsername)
            ||
            (msg.recipient === session.username && msg.sender !== contactUsername)
        )) {
            setUsers((users) => {
                const userIndex = users.findIndex((user) => user.name === msg.sender);

                const newUsers = [...users];
                newUsers[userIndex] = {
                    ...users[userIndex],
                    unreadCount: newUsers[userIndex].unreadCount + 1
                };

                return newUsers;
            });
        }
        else if (isRoom && currentRoomID !== msg.roomID) {
            setRooms((rooms) => {
                const roomIndex = rooms.findIndex((room) => room.id === msg.roomID);

                const newRooms = [...rooms];
                newRooms[roomIndex] = {
                    ...rooms[roomIndex],
                    unreadCount: newRooms[roomIndex].unreadCount + 1
                };

                return newRooms;
            });
        }
    }, [contacts.currentContact]);

    function makeIconStyles(iconColor) {
        return {
            backgroundColor: `rgba(${iconColor.join()}, 0.15)`,
            color: `rgb(${iconColor.join()})`
        };
    }

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

            setRooms((rooms) => [
                ...rooms,
                newRoom
            ]);

            changeCurrentContact(newRoom);
        });
    }

    return (
        <div className="contact-list">
            <div className="contact-section">
                <div className="contact-section-header">
                    <p className="contact-section-title">LUDZIE</p>
                    <button className="contact-section-button">+</button>
                </div>
                <div className="contact-section-entries">
                    {isLoading && <Loader />}
                    {users.map((user) => (
                        <button
                            key={user.id}
                            className={(user.name === contacts.currentContact?.name ? 'contact active' : 'contact')}
                            onClick={() => changeCurrentContact(user)}
                        >
                            <div className="contact-icon">{user.name.substr(0, 2)}</div>
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
                    <p className="contact-section-title">GRUPY</p>
                    <button className="contact-section-button" onClick={() => showModal('createRoom')}>+</button>
                    <CreateRoomModal
                        visible={modalVisibility.createRoom}
                        onClose={() => hideModal('createRoom')}
                        onSubmit={handleRoomCreate}
                    />
                </div>
                <div className="contact-section-entries">
                    {isLoading && <Loader />}
                    {rooms.map((room) => (
                        <button
                            key={room.id}
                            className={(room.id === contacts.currentContact?.id ? 'contact active' : 'contact')}
                            onClick={() => changeCurrentContact(room)}
                        >
                            <div
                                className="contact-icon"
                                style={makeIconStyles(room.iconColor)}
                            >{room.iconText}</div>
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