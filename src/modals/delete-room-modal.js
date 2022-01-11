import { useState } from 'react';

import Modal, { Button, ModalFooter } from '../common/modal';

import '../common/modal.scss';


function DeleteRoomModal(props) {

    function handleSubmit() {
        props.onSubmit?.();

        props.onClose?.();
    }

    function handleCancel() {
        props.onClose?.();
    }

    return (
        <Modal {...props} title="Usuwanie grupy" onSubmit={handleSubmit}>
            <p>Czy na pewno chcesz usunąć grupę?</p>
            <ModalFooter>
                <Button text="Anuluj" onClick={handleCancel} />
                <Button text="Usuń grupę" primary unsafe onClick={handleSubmit} />
            </ModalFooter>
        </Modal>
    );
}

export default DeleteRoomModal;