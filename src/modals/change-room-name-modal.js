import { useState } from 'react';

import Modal, { Button, Input, ModalFooter } from '../common/modal';


function ChangeRoomNameModal(props) {
    const [roomName, setRoomName] = useState(() => props.roomName);

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
        <Modal {...props} title="Zmiana nazwy grupy" onSubmit={handleSubmit}>
            <Input label="Nazwa grupy" value={roomName} onChange={(ev) => setRoomName(ev.target.value)} focused />
            <ModalFooter>
                <Button text="Anuluj" onClick={handleCancel} />
                <Button text="Zapisz" primary onClick={handleSubmit} />
            </ModalFooter>
        </Modal>
    );
}

export default ChangeRoomNameModal;