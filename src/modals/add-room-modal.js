import { useState } from 'react';
import api from '../api';

import Modal, { Button, Input, ModalFooter } from '../common/modal';
import UserAvatar from '../common/user-avatar';
import useI18n from '../hooks/use-i18n';
import useToast from '../hooks/use-toast';

import './add-room-modal.scss';


function AddRoomModal(props) {
    const { i18n } = useI18n();
    const toast = useToast();

    const [roomName, setRoomName] = useState('');
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [results, setResults] = useState([]);

    function handleSubmit() {
        console.log(selectedRoom);
        const promise = api.sendRoomJoinRequest({ roomID: selectedRoom.id });

        props.onSubmit?.(selectedRoom);

        props.onClose?.();
        setRoomName('');

        toast.promise(promise, {
            pending: i18n('roomJoinRequestPending'),
            success: i18n('roomJoinRequestSuccess')(selectedRoom.name),
            error: i18n('roomJoinRequestError')
        });
    }

    function handleCancel() {
        props.onClose?.();
        setRoomName('');
    }

    function searchRooms(query) {
        setRoomName(query);

        if (query.trim().length < 3) {
            if (results.length) setResults([]);
            return;
        }

        api.searchRooms({ query })
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
        <Modal {...props} title={i18n('addRoom')} onSubmit={handleSubmit}>
            <Input label={i18n('roomName')} value={roomName} onChange={(ev) => searchRooms(ev.target.value)} focused />
            <div className="add-room-search-results">
                {results.length === 0 && <p className="add-room-search-placeholder">{i18n('noResults')}</p>}
                {results.map((result) => (
                    <div
                        key={result.id}
                        className={'add-room-search-item' + (selectedRoom?.id === result.id ? ' selected' : '')}
                        onClick={() => setSelectedRoom(result)}
                    >
                        <UserAvatar avatarID={result.avatar} name={result.name} wide />
                        <p key={result.id}>{result.name}</p>
                    </div>
                ))}
            </div>
            <ModalFooter>
                <Button text={i18n('cancel')} onClick={handleCancel} />
                <Button text={i18n('addRoomButton')} primary onClick={handleSubmit} />
            </ModalFooter>
        </Modal>
    );
}

export default AddRoomModal;