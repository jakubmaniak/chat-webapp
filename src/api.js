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
    sendMessage: ({ recipient, content }) => sendPost('message', { recipient, content }),
    getMessages: ({ recipient }) => sendGet('messages/' + recipient)
};

export default api;