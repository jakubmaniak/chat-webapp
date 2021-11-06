import React, { useContext, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import 'dayjs/locale/pl';

import api from '../../api';
import { SocketContext } from '../../contexts/socket-context';
import { SessionContext } from '../../contexts/session-context';
import DropZone from './drop-zone';
import Contacts from './contacts';
import MessageFeed from './message-feed';
import MessageInput from './message-input';
import UserBox from './user-box';

import './main.scss';


dayjs.locale('pl');
dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);


function MainPage() {
    const { socket } = useContext(SocketContext);
    const { session, setSession } = useContext(SessionContext);
    const [cookies] = useCookies(['sid']);

    useEffect(() => {
        socket.connect(cookies.sid);

        api.getUserState()
            .then((res) => setSession({ ...session, ...res.data }));

        return () => socket.disconnect();
    }, []);

    return (
        <div className="main-container">
            <DropZone />
            <section className="left">
                <p>Kontakty</p>
                <Contacts />
                <UserBox />
            </section>
            <section className="right">
                <MessageFeed />
                <MessageInput />
            </section>
        </div>
    );
}

export default MainPage;