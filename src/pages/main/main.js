import React, { useContext, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { ToastContainer } from 'react-toastify';
import ReactTooltip from 'react-tooltip';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import 'dayjs/locale/pl';

import api from '../../api';
import useI18n from '../../hooks/use-i18n';
import useNav from '../../hooks/use-nav';
import { SocketContext } from '../../contexts/socket-context';
import { SessionContext } from '../../contexts/session-context';
import DropZone from './drop-zone';
import Contacts from './contacts';
import MessageFeed from './message-feed';
import MessageInput from './message-input';
import Sidebar from './sidebar';
import UserBox from './user-box';

import 'react-toastify/dist/ReactToastify.css';
import './main.scss';
import InvitationReceiver from './invitation-receiver';
import { useHistory } from 'react-router-dom';


dayjs.locale('pl');
dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);


function MainPage() {
    const history = useHistory();
    const { focusedSection } = useNav();
    const { i18n } = useI18n();
    const { socket } = useContext(SocketContext);
    const { session, setSession } = useContext(SessionContext);
    const [cookies] = useCookies(['sid']);

    useEffect(() => {
        socket.connect(cookies.sid);

        api.getUserState()
            .then((res) => {
                if (res.error) {
                    history.replace('/login');
                }
                else {
                    setSession({ ...session, ...res.data });
                }
            });

        return () => socket.disconnect();
    }, []);

    let className = 'main-container';

    if (focusedSection) className += ` ${focusedSection}-focused`;

    return (
        <div className={className}>
            <DropZone />
            <ToastContainer limit={4} />
            <section className="left">
                <p>{i18n('contacts')}</p>
                <Contacts />
                <UserBox />
            </section>
            <section className="center">
                <MessageFeed />
                <MessageInput />
            </section>
            <section className="right">
                <Sidebar />
            </section>
            <ReactTooltip place="right" effect="float" />
            <InvitationReceiver />
        </div>
    );
}

export default MainPage;