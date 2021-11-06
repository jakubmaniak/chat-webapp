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

const api = {
    userLogin: ({ username, password }) => sendPost('user/login', { username, password }),
    userSignup: ({ username, password }) => sendPost('user/signup', { username, password }),
    getUserState: () => sendGet('user/state'),
    sendMessage: ({ recipient = null, roomID = null, lang = null, content, fileName = null }) => sendPost('message', { recipient, roomID, lang, content, fileName }),
    getMessages: ({ recipient }) => sendGet('messages/' + recipient),
    getMessagesBefore: ({ recipient, messageID }) => sendGet('messages/' + recipient + '/before/' + messageID),
    getRoomMessages: ({ roomID }) => sendGet('messages/room/' + roomID),
    uploadAttachment: ({ }) => { },
    setUserStatus: ({ status }) => sendPut('user/status', { status })
};

export default api;