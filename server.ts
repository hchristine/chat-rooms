import express from 'express';
import { Server } from 'socket.io';
import http from 'http';

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const port = process.env.PORT || 3000;
const roomTypes = {
    PUBLIC: 'public',
    PRIVATE: 'private',
    GROUP: 'group'
};
const privateRoomPassword = '123';

app.use(express.static('public'));

io.on('connection', (socket) => {
    socket.on('new-message', (message) => {
        const room = Array.from(socket.rooms)[0];
        io.to(room).emit('message-in-room', message)
    });
});

io.use((socket, next) => {
    const { username, pass, room } = socket.handshake.auth;

    if (room === roomTypes.GROUP) {
        const groupClients = io.of('/').adapter.rooms.get(room)?.size ?? 0;

        if (groupClients === 3) {
            next(new Error(`Room is full: ${room}`));
            return;
        }
    }
    if (room === roomTypes.PRIVATE) {
        const privateClients = io.of('/').adapter.rooms.get(room)?.size ?? 0;

        if (privateClients === 2) {
            next(new Error(`Room is full: ${room}`));
            return;
        }

        if (pass !== privateRoomPassword) {
            next(new Error(`Password is incorrect!!!`));
            return;
        }
    }

    if (!Object.values(roomTypes).includes(room)) {
        next(new Error("Wrong room selected."));
        return;
    }

    socket.join(room);

    next();
})

server.listen(port, () => {
    console.log(`Shahen@ asuma Magic is happening on port ${port}`);
})
