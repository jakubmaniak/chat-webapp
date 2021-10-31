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

function sendGet(path, body = null) {
    return sendRequest('GET', path, body);
}

function sendPost(path, body = null) {
    return sendRequest('POST', path, body);
}

const api = {
    userLogin: ({ username, password }) => sendPost('user/login', { username, password }),
    sendMessage: ({ recipient = null, roomID = null, content }) => sendPost('message', { recipient, roomID, content }),
    getMessages: ({ recipient }) => sendGet('messages/' + recipient),
    getMessagesBefore: ({ recipient, messageID }) => sendGet('messages/' + recipient + '/before/' + messageID),
    getRoomMessages: ({ roomID }) => sendGet('messages/room/' + roomID)
};

export default api;