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
io.on('connection', (socket) => {

    // register the websocket event handlers
    
    // on notification
    socket.on("notification", (notification) => {

        notification = JSON.parse(notification);

        try {
            // send the notification to the destination
            dispatcher.sendNotification(notification.destination, notification);
        } catch (err) {
            console.error(err);
        }
    });

    // TODO: on transaction

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