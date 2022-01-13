import axios from 'axios';


function sendRequest(method, path, body = null) {
    let opts = {
        method,
        url: 'http://localhost:3000/' + path
    };

    if (body !== null) {
        opts.data = body;
    }

    return axios.request(opts)
        .then((response) => response.data);
}

function sendGet(path) {
    return sendRequest('GET', path);
}

function sendPost(path, body = null) {
    return sendRequest('POST', path, body);
}

function sendPut(path, body = null) {
    return sendRequest('PUT', path, body);
}

function sendDelete(path) {
    return sendRequest('DELETE', path);
}

const api = {
    userLogin: ({ username, password }) => sendPost('user/login', { username, password }),
    userSignup: ({ username, password, lang = null }) => sendPost('user/signup', { username, password, lang }),
    userLogout: () => sendPost('user/logout'),
    getUserState: () => sendGet('user/state'),
    setUserLang: ({ lang }) => sendPut('user/lang', { lang }),
    getContacts: () => sendGet('contacts'),
    deleteContact: ({ username }) => sendDelete('contact/' + username),
    searchUsers: ({ query }) => sendPost('users', { query }),
    searchRooms: ({ query }) => sendPost('rooms', { query }),
    sendMessage: ({ recipient = null, roomID = null, sourceLang = null, targetLang = null, content, fileName = null }) => sendPost('message', { recipient, roomID, sourceLang, targetLang, content, fileName }),
    getMessages: ({ recipient }) => sendGet('messages/' + recipient),
    getMessagesBefore: ({ recipient, messageID }) => sendGet('messages/' + recipient + '/before/' + messageID),
    getAttachments: ({ recipient }) => sendGet('messages/' + recipient + '/attachments'),
    getRoomState: ({ roomID }) => sendGet('room/' + roomID),
    getRoomMessages: ({ roomID }) => sendGet('messages/room/' + roomID),
    getRoomAttachments: ({ roomID }) => sendGet('messages/room/' + roomID + '/attachments'),
    createRoom: ({ name }) => sendPost('room', { name }),
    leaveRoom: ({ roomID }) => sendPost('room/leave', { roomID }),
    deleteRoom: ({ roomID }) => sendDelete('room/' + roomID),
    updateRoom: ({ roomID, property, value }) => sendPut('room', { roomID, property, value }),
    setUserAvatar: ({ avatarID }) => sendPut('user/avatar', { avatarID }),
    setUserStatus: ({ status }) => sendPut('user/status', { status }),
    sendRoomJoinRequest: ({ roomID }) => sendPost('room/joinrequest', { roomID }),
    acceptRoomJoinRequest: ({ joinRequestID }) => sendPut('room/joinrequest', { joinRequestID, action: 'accept' }),
    rejectRoomJoinRequest: ({ joinRequestID }) => sendPut('room/joinrequest', { joinRequestID, action: 'reject' }),
    sendInvitation: ({ invitee, roomID = null }) => sendPost('invitation', { invitee, roomID }),
    acceptInvitation: ({ invitationID }) => sendPut('invitation', { invitationID, action: 'accept' }),
    rejectInvitation: ({ invitationID }) => sendPut('invitation', { invitationID, action: 'reject' })
};

export default api;