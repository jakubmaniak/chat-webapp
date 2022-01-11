import { useState } from 'react';
import api from '../api';

import Modal, { Button, Input, ModalFooter } from '../common/modal';
import UserAvatar from '../common/user-avatar';
import useI18n from '../hooks/use-i18n';
import useToast from '../hooks/use-toast';

import './add-user-modal.scss';


function AddUserModal(props) {
    const { i18n } = useI18n();
    const toast = useToast();

    const [userName, setUserName] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [results, setResults] = useState([]);

    function handleSubmit() {
        const promise = api.sendInvitation({ invitee: selectedUser.username })
        
        props.onSubmit?.(selectedUser);

        props.onClose?.();
        setUserName('');

        toast.promise(promise, {
            pending: i18n('sendingInvitation'),
            success: i18n('invitationSent'),
            error: i18n('sendingInvitationError')
        });
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
        <Modal {...props} title={i18n('addContact')} onSubmit={handleSubmit}>
            <Input label={i18n('userName')} value={userName} onChange={(ev) => searchUsers(ev.target.value)} focused />
            <div className="add-user-search-results">
                {results.length === 0 && <p className="add-user-search-placeholder">{i18n('noResults')}</p>}
                {results.map((result) => (
                    <div
                        key={result.id}
                        className={'add-user-search-item' + (selectedUser?.id === result.id ? ' selected' : '')}
                        onClick={() => setSelectedUser(result)}
                    >
                        <UserAvatar avatarID={result.avatar} name={result.username} />
                        <p key={result.id}>{result.username}</p>
                    </div>
                ))}
            </div>
            <ModalFooter>
                <Button text={i18n('cancel')} onClick={handleCancel} />
                <Button text={i18n('addContactButton')} primary onClick={handleSubmit} />
            </ModalFooter>
        </Modal>
    );
}

export default AddUserModal;