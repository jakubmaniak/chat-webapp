import { useContext, useEffect, useState } from 'react';

import api from '../../api';
import { SessionContext } from '../../contexts/session-context';
import Tooltip from '../../common/tooltip';
import UserAvatar from '../../common/user-avatar';
import SetAvatarModal from '../../modals/set-avatar-modal';

import './user-box.scss';


function UserBox() {
    const { session, setSession } = useContext(SessionContext);

    const [statusMenuVisible, setStatusMenuVisible] = useState(false);
    const [changeAvatarModalVisible, setChangeAvatarModalVisible] = useState(false);

    const statusTexts = {
        online: 'dostępny',
        brb: 'zaraz wracam',
        dnd: 'nie przeszkadzać',
        invisible: 'niewidoczny',
        offline: 'niedostępny'
    };


    function updateUserStatus(newStatus) {
        const prevStatus = session.status;
        setSession({ ...session, status: newStatus });

        api.setUserStatus({ status: newStatus })
            .catch(() => setSession({ ...session, status: prevStatus }));
    }

    function renderChangeStatusMenu() {
        return <div className="user-box-status-change-menu">
            {[...Object.entries(statusTexts)].slice(0, -1).map(([id, text]) => (
                <p
                    key={id}
                    className={id}
                    onClick={() => { updateUserStatus(id); setStatusMenuVisible(false); }}
                >
                    <span className="status-icon"></span>
                    <span className="status-text">{text}</span>
                </p>
            ))}
        </div>;
    }

    return <div className="user-box">
        <Tooltip text="Zmień awatar">
            <div
                className="user-box-avatar"
                onClick={() => setChangeAvatarModalVisible(true)}
            >
                <UserAvatar avatarID={session.avatar} name={session.username} />
            </div>
        </Tooltip>
        <SetAvatarModal visible={changeAvatarModalVisible} onClose={() => setChangeAvatarModalVisible(false)} />
        <div className="user-box-user-status">
            <div className="user-box-username">{localStorage.username}</div>
            <Tooltip text="Zmień status">
                <div
                    className={'user-box-status ' + session.status}
                    onClick={() => setStatusMenuVisible(true)}
                >
                    <div className="user-box-status-icon"></div>
                    <p className="user-box-status-text">{statusTexts[session.status]}</p>
                </div>
            </Tooltip>
        </div>
        <Tooltip text="Ustawienia">
            <div className="user-box-settings"></div>
        </Tooltip>
        {statusMenuVisible && renderChangeStatusMenu()}
    </div>;
}

export default UserBox;