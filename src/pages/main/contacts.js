import { useContext, useEffect, useState } from 'react';

import { SessionContext } from '../../contexts/session-context';


function Contacts({ onChange }) {
    const { session, setSession } = useContext(SessionContext);
    const [users, setUsers] = useState(['admin', 'snowanka']);
    const [rooms, setRooms] = useState([]);
    const [currentContact, setCurrentContact] = useState(() => {
        return users.find((username) => username !== session.username);
    });

    useEffect(() => {
        onChange?.(currentContact);
    }, [currentContact]);

    return (
        <div className="contact-list">
            {users.map((username) => (
                <button
                    key={username}
                    className={(username === currentContact ? 'contact active' : 'contact')}
                    onClick={() => setCurrentContact(username)}
                >{username}</button>
            ))}
        </div>
    );
}

export default Contacts;