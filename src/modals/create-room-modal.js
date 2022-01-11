import { useState } from 'react';

import Modal, { Button, Input, ModalFooter } from '../common/modal';
import useI18n from '../hooks/use-i18n';


function CreateRoomModal(props) {
    const { i18n } = useI18n();
    const [roomName, setRoomName] = useState('');

    function handleSubmit() {
        props.onSubmit?.(roomName);

        props.onClose?.();
        setRoomName('');
    }

    function handleCancel() {
        props.onClose?.();
        setRoomName('');
    }

    return (
        <Modal {...props} title={i18n('createRoom')} onSubmit={handleSubmit}>
            <Input label={i18n('roomName')} value={roomName} onChange={(ev) => setRoomName(ev.target.value)} focused />
            <ModalFooter>
                <Button text={i18n('cancel')} onClick={handleCancel} />
                <Button text={i18n('createRoomButton')} primary onClick={handleSubmit} />
            </ModalFooter>
        </Modal>
    );
}

export default CreateRoomModal;