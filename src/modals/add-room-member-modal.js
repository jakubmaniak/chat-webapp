import { useState } from 'react';
import api from '../api';

import Modal, { Button, Input, ModalFooter } from '../common/modal';
import UserAvatar from '../common/user-avatar';
import useI18n from '../hooks/use-i18n';

import './add-room-member-modal.scss';


function AddRoomMemberModal(props) {
    const { i18n } = useI18n();
    const [userName, setUserName] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [results, setResults] = useState([]);

    function handleSubmit() {
        props.onSubmit?.(selectedUser);

        props.onClose?.();
        setUserName('');
    }

    function handleCancel() {
        props.onClose?.();
        setUserName('');
    }

    function searchUsers(query) {
        setUserName(query);

        if (query.trim().length < 3) {
            if (results.length) setResults([]);
            return;
        }

        api.searchUsers({ query })
            .then((searchResults) => {
                if (!searchResults.error) {
                    setResults(searchResults.data);
                }
                else {
                    setResults([]);
                }
            });
    }

    return (
        <Modal {...props} title={i18n('addRoomMember')} onSubmit={handleSubmit}>
            <Input label="Nazwa użytkownika" value={userName} onChange={(ev) => searchUsers(ev.target.value)} focused />
            <div className="add-room-member-search-results">
                {results.length === 0 && <p className="add-room-member-search-placeholder">Brak wyników</p>}
                {results.map((result) => (
                    <div
                        key={result.id}
                        className={'add-room-member-search-item' + (selectedUser?.id === result.id ? ' selected' : '')}
                        onClick={() => setSelectedUser(result)}
                    >
                        <UserAvatar avatarID={result.avatar} name={result.username} />
                        <p key={result.id}>{result.username}</p>
                    </div>
                ))}
            </div>
            <ModalFooter>
                <Button text="Anuluj" onClick={handleCancel} />
                <Button text="Zaproś do grupy" primary onClick={handleSubmit} />
            </ModalFooter>
        </Modal>
    );
}

export default AddRoomMemberModal;