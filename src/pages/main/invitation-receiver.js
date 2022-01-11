import { useContext, useEffect } from 'react';

import api from '../../api';
import { SocketContext } from '../../contexts/socket-context';
import useToast from '../../hooks/use-toast';

import './invitation-receiver.scss';


function InvitationReceiver() {
    const toast = useToast();

    const { socket } = useContext(SocketContext);

    useEffect(() => {
        if (!socket.connected) {
            return;
        }

        socket.connection.on('invitationReceived', (ev) => {
            showInvitation(ev);
        });

        socket.connection.on('joinRequestReceived', (ev) => {
            showJoinRequest(ev);
        });
    }, [socket.connected]);


    function handleAcceptInvitation(invitation) {
        api.acceptInvitation({ invitationID: invitation.id });
    }

    function handleRejectInvitation(invitation) {
        api.rejectInvitation({ invitationID: invitation.id });
    }

    function handleAcceptRequest(joinRequest) {
        api.acceptRoomJoinRequest({ joinRequestID: joinRequest.id });
    }

    function handleRejectRequest(joinRequest) {
        api.rejectRoomJoinRequest({ joinRequestID: joinRequest.id });
    }

    function showInvitation(invitation) {
        toast.show(<div className="invitation-container">
            <p>
                <strong>{invitation.inviter}</strong> wysłał Ci zaproszenie do rozmowy
            </p>
            <div className="invitation-buttons">
                <button className="green" onClick={() => handleAcceptInvitation(invitation)}>Akceptuj</button>
                <button onClick={() => handleRejectInvitation(invitation)}>Odrzuć</button>
                <button>Zignoruj</button>
            </div>
        </div>);
    }

    function showJoinRequest(joinRequest) {
        toast.show(<div className="join-request-container">
            <p>
                <strong>{joinRequest.requester}</strong> wysłał prośbę o dołączenie do pokoju <strong>{joinRequest.roomName}</strong>
            </p>
            <div className="join-request-buttons">
                <button className="green" onClick={() => handleAcceptRequest(joinRequest)}>Akceptuj</button>
                <button onClick={() => handleRejectRequest(joinRequest)}>Odrzuć</button>
                <button>Zignoruj</button>
            </div>
        </div>);
    }

    return null;
}

export default InvitationReceiver;