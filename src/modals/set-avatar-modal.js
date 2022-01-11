import { useContext, useState } from 'react';
import axios from 'axios';

import api from '../api';
import { SessionContext } from '../contexts/session-context';
import Modal, { Button, FileDropzone, Input, ModalFooter } from '../common/modal';

import './set-avatar-modal.scss';
import UserAvatar from '../common/user-avatar';


function SetAvatarModal(props) {
    const { session, setSession } = useContext(SessionContext);

    const [changed, setChanged] = useState(false);
    const [canSubmit, setCanSubmit] = useState(false);
    const [fileName, setFileName] = useState('Nie wybrano pliku');
    const [imageURL, setImageURL] = useState(null);
    const [file, setFile] = useState(null);

    function reset() {
        setChanged(false);
        setCanSubmit(false);
        setFile(null);
        setFileName('Nie wybrano pliku');
        setImageURL(null);
    }

    function handleSubmit() {
        const formData = new FormData();
        formData.append('file', file);

        axios.post('http://localhost:3002/avatar', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
            .then((res) => {
                const avatarID = res.data.data.fileName;
                api.setUserAvatar({ avatarID });

                return avatarID;
            })
            .then((avatarID) => {
                setSession({ ...session, avatar: avatarID });

                props.onSubmit?.();
                props.onClose?.();
                reset();
            });
    }

    function handleCancel() {
        props.onClose?.();
        reset();
    }

    function handleFilesChange(files) {
        if (files.length === 0) {
            setFileName('Nie wybrano pliku');
            setCanSubmit(false);
            return;
        }

        setChanged(true);
        setFile(files[0]);
        setFileName(files[0].name);
        setCanSubmit(true);

        const blob = URL.createObjectURL(files[0]);
        setImageURL(blob);
    }

    function renderAvatar() {
        if (changed) {
            return (
                <div
                    className="avatar-preview large"
                    style={{ backgroundImage: `url('${imageURL}')` }}
                ></div>
            );
        }
        else {
            return <UserAvatar avatarID={session.avatar} name={session.username} large />
        }
    }

    return (
        <Modal {...props} title="Zmień awatar" onSubmit={handleSubmit} onClose={handleCancel}>
            <div className="avatar-preview-container">
                {renderAvatar()}
                <FileDropzone label={fileName} onChange={handleFilesChange} />
            </div>
            <ModalFooter>
                <Button text="Anuluj" onClick={handleCancel} />
                <Button text="Zmień awatar" primary disabled={!canSubmit} onClick={handleSubmit} />
            </ModalFooter>
        </Modal>
    );
}

export default SetAvatarModal;