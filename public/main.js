function initializeSocket(username, room, pass = '') {
    const socket = io({
        auth: {
            username,
            room,
            pass
        }
    });

    socket.on("connect_error", (err) => {
        console.log(err);
    });

    const sendMessage = (text) => {
        socket.emit("new-message", text)
    };
    // We need to register listener for XXX event name
    const onMessage = (listener) => {
        socket.on('message-in-room', listener)
    }

    return { sendMessage, onMessage };
}

const body = document.body;
const publicButton = document.querySelector('#public');
const privateButton = document.querySelector('#private');
const groupButton = document.querySelector('#group');

const footer = document.querySelector('#footer');
const text = document.querySelector('#text');
const sendButton = document.querySelector('#sendButton');

let socket = null;

text.addEventListener('keyup', (event) => {
    if (event.keyCode === 13) {
        socket.sendMessage(text.value);
        text.value = '';
    }
})

sendButton.addEventListener('click', () => {
    socket.sendMessage(text.value);
    text.value = '';
});

publicButton.addEventListener('click', () => {
    footer.classList.remove('hide');
    channels.classList.add('hide');
    socket = initializeSocket(username, "public");
    listenForMessages(socket);
});

privateButton.addEventListener('click', () => {
    let pass = '';
    while (pass === null || pass.trim().length === 0) {
        pass = prompt("enter your password PLEASE!!!");
    }
    footer.classList.remove('hide');
    channels.classList.add('hide');
    socket = initializeSocket(username, "private", pass);
    listenForMessages(socket);
});

groupButton.addEventListener('click', () => {
    footer.classList.remove('hide');
    channels.classList.add('hide');
    socket = initializeSocket(username, "group");
    listenForMessages(socket);
});

function listenForMessages(socket) {
    socket.onMessage((message) => {
        const div = document.createElement('div');
        const p = document.createElement('p');

        p.innerHTML = '<br />' + "Message: " + message;
        div.appendChild(p);
        body.appendChild(div);
    })
}

