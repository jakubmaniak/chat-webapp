import { useState } from 'react';

import Modal, { Button, Input, ModalFooter } from '../common/modal';


function CreateRoomModal(props) {
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
        <Modal {...props} title="Stwórz grupę" onSubmit={handleSubmit}>
            <Input label="Nazwa grupy" value={roomName} onChange={(ev) => setRoomName(ev.target.value)} focused />
            <ModalFooter>
                <Button text="Anuluj" onClick={handleCancel} />
                <Button text="Stwórz" primary onClick={handleSubmit} />
            </ModalFooter>
        </Modal>
    );
}

export default CreateRoomModal;