import { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import dayjs from 'dayjs';

import api from '../../api';
import useI18n from '../../hooks/use-i18n';
import { SessionContext } from '../../contexts/session-context';
import UserAvatar from '../../common/user-avatar';
import SetAvatarModal from '../../modals/set-avatar-modal';

import './user-box.scss';
import { SocketContext } from '../../contexts/socket-context';
import { useEffect } from 'react';


function UserBox() {
    const { i18n, lang, setLang } = useI18n();
    const history = useHistory();

    const { session, setSession } = useContext(SessionContext);
    const { socket } = useContext(SocketContext);

    const [statusMenuVisible, setStatusMenuVisible] = useState(false);
    const [userSettingsMenuVisible, setUserSettingsMenuVisible] = useState(false);
    const [i18nLangMenuVisible, setI18nLangMenuVisible] = useState(false);
    const [changeAvatarModalVisible, setChangeAvatarModalVisible] = useState(false);

    const statuses = ['online', 'brb', 'dnd', 'invisible', 'offline'];

    useEffect(() => {
        if (!socket.connected) return;

        socket.connection.on('userStatusChanged', (ev) => {
            if (ev.username === session.username) {
                setSession({ ...session, status: ev.status });
            }
        });
    }, [socket.connected]);

    function updateUserStatus(newStatus) {
        const prevStatus = session.status;
        setSession({ ...session, status: newStatus });

        api.setUserStatus({ status: newStatus })
            .catch(() => setSession({ ...session, status: prevStatus }));
    }

    function handleLogout() {
        api.userLogout()
            .then(() => {
                window.localStorage.clear();
                socket.connection.disconnect();

                setSession({ ...session, loggedIn: false });

                setTimeout(() => {
                    history.replace('/login');
                }, 300);
            });
    }

    function handleSetLang(langCode) {
        setLang(langCode);
        setI18nLangMenuVisible(false);

        api.setUserLang({ lang: langCode });
        dayjs.locale(langCode);
    }

    function handleAvatarChange() {
        setUserSettingsMenuVisible(false);
        setChangeAvatarModalVisible(true);
    }

    function renderChangeStatusMenu() {
        return (
            <div className="menu-wrapper">
                <div className="menu-overlay" onClick={() => setStatusMenuVisible(false)}></div>
                <div className="user-box-status-change-menu">
                    {statuses.slice(0, -1).map((statusID) => (
                        <p
                            key={statusID}
                            className={statusID}
                            onClick={() => { updateUserStatus(statusID); setStatusMenuVisible(false); }}
                        >
                            <span className="status-icon"></span>
                            <span className="status-text">{i18n(statusID)}</span>
                        </p>
                    ))}
                </div>
            </div>
        );
    }

    function renderUserSettingsMenu() {
        return (
            <div className="menu-wrapper">
                {!i18nLangMenuVisible && (
                    <div className="menu-overlay" onClick={() => setUserSettingsMenuVisible(false)}></div>
                )}
                <div className="user-box-settings-menu">
                    <p onClick={() => setI18nLangMenuVisible(true)}>{i18n('currentLanguage')} {lang.name}</p>
                    <p className="separator"></p>
                    <p onClick={handleAvatarChange}>{i18n('setUserAvatar')}</p>
                    <p className="unsafe" onClick={handleLogout}>{i18n('logOut')}</p>
                </div>
                {i18nLangMenuVisible && <div className="menu-overlay" onClick={() => setI18nLangMenuVisible(false)}></div>}
                {i18nLangMenuVisible && <div className="i18n-lang-selection-menu">
                    <p onClick={() => handleSetLang('en')}>English</p>
                    <p onClick={() => handleSetLang('de')}>Deutsch</p>
                    <p onClick={() => handleSetLang('pl')}>Polski</p>
                </div>}
            </div>
        );
    }

    return <>
        <SetAvatarModal visible={changeAvatarModalVisible} onClose={() => setChangeAvatarModalVisible(false)} />
        <div className="user-box">
            <div
                className="user-box-avatar"
                onClick={() => setChangeAvatarModalVisible(true)}
                data-tip={i18n('setUserAvatar')}
            >
                <UserAvatar avatarID={session.avatar} name={session.username} />
            </div>
            <div className="user-box-user-status">
                <div className="user-box-username">{localStorage.username}</div>
                <div
                    className={'user-box-status ' + session.status}
                    onClick={() => setStatusMenuVisible(true)}
                    data-tip={i18n('changeStatus')}
                >
                    <div className="user-box-status-icon"></div>
                    <p className="user-box-status-text">{i18n(session.status)}</p>
                </div>
            </div>
            <div
                className="user-box-settings"
                onClick={() => setUserSettingsMenuVisible(true)}
                data-tip={i18n('userSettings')}
            ></div>

            {statusMenuVisible && renderChangeStatusMenu()}
            {userSettingsMenuVisible && renderUserSettingsMenu()}
        </div>
    </>;
}

export default UserBox;