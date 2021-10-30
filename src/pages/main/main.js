import React, { useContext, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import 'dayjs/locale/pl';

import { SocketContext } from '../../contexts/socket-context';
import Contacts from './contacts';
import MessageFeed from './message-feed';
import MessageInput from './message-input';

import './main.scss';


dayjs.locale('pl');
dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);


function MainPage() {
    const { socket } = useContext(SocketContext);
    const [cookies] = useCookies(['sid']);

    useEffect(() => {
        socket.connect(cookies.sid);

        return () => socket.disconnect();
    }, []);

    return (
        <div className="main-container">
            <section className="left">
                <p>Kontakty</p>
                <Contacts />
            </section>
            <section className="right">
                <MessageFeed />
                <MessageInput />
            </section>
        </div>
    );
}

export default MainPage;