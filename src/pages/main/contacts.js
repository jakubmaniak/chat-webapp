import { useContext, useEffect, useState } from 'react';

import { SessionContext } from '../../contexts/session-context';
import { SocketContext } from '../../contexts/socket-context';

import './contacts.scss';


function Contacts({ onChange }) {
    const { session, setSession } = useContext(SessionContext);
    const { socket, setSocket } = useContext(SocketContext);

    const [users, setUsers] = useState([
        { name: 'admin', status: 'online' },
        { name: 'snowanka', status: 'offline' }
    ]);
    const [rooms, setRooms] = useState([
        { name: 'Developers', iconText: 'Dev', iconColor: [0x7c, 0x4b, 0xcc] },
        { name: 'SPAM', iconText: 'SP', iconColor: [0x00, 0x93, 0x78]}
    ]);
    const [currentContact, setCurrentContact] = useState(() => {
        return users.find((user) => (user.name !== session.username));
    });

    useEffect(() => {
        if (socket.connection === null) {
            return;
        }

        socket.connection.on('userStatusChanged', (ev) => {
            setUsers((users) => {
                let newUsers = [ ...users ];
                const userIndex = newUsers.findIndex((user) => user.name === ev.username);
                newUsers[userIndex] = { ...users[userIndex], status: ev.status };

                return newUsers;
            });
        });
    }, [socket.connection]);

    useEffect(() => {
        onChange?.(currentContact);
    }, [currentContact]);

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
                    <p className="contact-section-title">CZŁONKOWIE</p>
                    <p className="contact-section-button">+</p>
                </div>
                <div className="contact-section-entries">
                    {users.map((user) => (
                        <button
                            key={user.name}
                            className={(user.name === currentContact.name ? 'contact active' : 'contact')}
                            onClick={() => setCurrentContact(user)}
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
                    {rooms.map((room) => (
                        <button
                            key={room.name}
                            className={(room.name === currentContact ? 'contact active' : 'contact')}
                            onClick={() => setCurrentContact(room.name)}
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