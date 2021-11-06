import { useContext, useEffect, useState } from 'react';

import api from '../../api';
import { SessionContext } from '../../contexts/session-context';
import { SocketContext } from '../../contexts/socket-context';
import { ContactsContext } from '../../contexts/contacts-context';

import './contacts.scss';
import Loader from '../../common/loader';


function Contacts() {
    const { session } = useContext(SessionContext);
    const { socket } = useContext(SocketContext);
    const { contacts, setContacts } = useContext(ContactsContext);

    const [isLoading, setIsLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [rooms, setRooms] = useState([
        { isRoom: true, id: 'dev', name: 'Developers', iconText: 'Dev', iconColor: [0x7c, 0x4b, 0xcc] },
        { isRoom: true, id: 'spam', name: 'SPAM', iconText: 'SP', iconColor: [0x00, 0x93, 0x78] }
    ]);

    function updateCurrentContact(contact) {
        setContacts({ ...contacts, currentContact: contact });
    }


    useEffect(() => {
        api.getContacts()
            .then((res) => {
                const newUsers = res.data.users.map((user) => ({
                    isRoom: false,
                    id: user.id,
                    name: user.username,
                    status: user.status
                }));

                updateCurrentContact(newUsers?.[0]);
                setUsers(newUsers);
                setIsLoading(false);
            });
    }, []);

    useEffect(() => {
        if (socket.connection === null) {
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
    }, [socket.connection]);


    function makeIconStyles(iconColor) {
        return {
            backgroundColor: `rgba(${iconColor.join()}, 0.15)`,
            color: `rgb(${iconColor.join()})`
        };
    }

    return (
        <div className="contact-list">
            <div className="contact-section">
                <div className="contact-section-header">
                    <p className="contact-section-title">LUDZIE</p>
                    <p className="contact-section-button">+</p>
                </div>
                <div className="contact-section-entries">
                    {isLoading && <Loader />}
                    {users.map((user) => (
                        <button
                            key={user.id}
                            className={(user.name === contacts.currentContact?.name ? 'contact active' : 'contact')}
                            onClick={() => updateCurrentContact(user)}
                        >
                            <div className="contact-icon">{user.name.substr(0, 2)}</div>
                            <p className="contact-name">{user.name}</p>
                            <div className={'contact-status ' + user.status} />
                        </button>
                    ))}
                </div>
            </div>
            <div className="contact-section">
                <div className="contact-section-header">
                    <p className="contact-section-title">GRUPY</p>
                    <p className="contact-section-button">+</p>
                </div>
                <div className="contact-section-entries">
                    {isLoading && <Loader />}
                    {rooms.map((room) => (
                        <button
                            key={room.id}
                            className={(room.id === contacts.currentContact?.id ? 'contact active' : 'contact')}
                            onClick={() => updateCurrentContact(room)}
                        >
                            <div
                                className="contact-icon"
                                style={makeIconStyles(room.iconColor)}
                            >{room.iconText}</div>
                            <p className="contact-name">{room.name}</p>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Contacts;