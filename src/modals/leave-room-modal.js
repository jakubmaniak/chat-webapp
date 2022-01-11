import Modal, { Button, ModalFooter } from '../common/modal';

import '../common/modal.scss';


function LeaveRoomModal(props) {
    function handleSubmit() {
        props.onSubmit?.();

        props.onClose?.();
    }

    function handleCancel() {
        props.onClose?.();
    }

    return (
        <Modal {...props} title="Opuszcanie grupy" onSubmit={handleSubmit}>
            <p>Czy na pewno chcesz opuścić grupę?</p>
            <ModalFooter>
                <Button text="Anuluj" onClick={handleCancel} />
                <Button text="Opuść grupę" primary unsafe onClick={handleSubmit} />
            </ModalFooter>
        </Modal>
    );
}

export default LeaveRoomModal;