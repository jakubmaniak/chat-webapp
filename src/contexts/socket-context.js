import { createContext } from 'react';
import socketio from 'socket.io-client';


export const initialSocketContext = {
    connection: null,
    connected: false,
    connect: null,
    disconnect: null
};

initialSocketContext.connect = function(sessionID) {
    const socket = socketio('localhost:3001', {
        query: { httpsid: sessionID },
        transports: ['websocket', 'polling']
    });

    socket.on('connect', () => {
        initialSocketContext.connected = true;
    });

    initialSocketContext.connection = socket;
};

initialSocketContext.disconnect = function() {
    initialSocketContext.connection.close();
    initialSocketContext.connection = null;
    initialSocketContext.connected = false;
};

export const SocketContext = createContext(initialSocketContext);