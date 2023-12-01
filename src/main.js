import { Server } from 'socket.io';
import { createServer } from 'http';
import NotificationDispatcher from './NotificationDispatcher.js';
import Authentication from './Authentication.js';
import Utils from './Utils.js';
import 'dotenv/config.js'

// create the http server
const server = createServer();

// create the websocket server
const io = new Server(server);

// create the notification dispatcher instance
const dispatcher = new NotificationDispatcher();

// listen for new client connections
io.on('connection', (socket, request, client) => {

    // register the websocket event handlers
    socket.on('message', (notification) => {
        NotificationDispatcher.onNotificationDispatch(dispatcher, client, notification);
    });

    socket.on('close', () => {
        dispatcher.unregisterClient(client);
    });

    socket.on('disconnect', () => {
        dispatcher.unregisterClient(client);
    });

    // register the client with the dispatcher
    dispatcher.registerClient(client, socket);

    console.log(`New client ${client} connected`);
});

server.listen(process.env.WEBSOCKET_SERVER_PORT, () => {
    console.log(`🚀 Server listening on port ${process.env.WEBSOCKET_SERVER_PORT}`);
});