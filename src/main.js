import { Server } from 'socket.io';
import { createServer } from 'http';
import NotificationDispatcher from './NotificationDispatcher.js';
import Authentication from './Authentication.js';
import Utils from './Utils.js';
import 'dotenv/config.js'

// create the http server
const server = createServer();

// create the websocket server
const io = new Server(server, {
    transports: ['websocket', 'polling'],
    cors: {
        origin: process.env.FRONTEND_URL,
        methods: ["GET", "POST"],
        credentials: true
    }
});

let clientId = null;

io.use((socket, next) => {

    let handshakeData = socket.request;

    if(!handshakeData._query['client_id']) {
        next(new Error("Invalid client id"));
        return;
    }

    clientId = handshakeData._query['client_id'];

    next();
});

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

    // on transaction
    socket.on("transaction", (transaction) => {

        transaction = JSON.parse(transaction);

        try {
            // send the transaction to the destination
            dispatcher.sendTransaction(transaction.destination, transaction);
        } catch (err) {
            console.error(err);
        }
    });

    socket.on('disconnect', () => {
        dispatcher.unregisterClient(clientId);
    });

    // register the client with the dispatcher
    dispatcher.registerClient(clientId, socket);

    console.log(`New client ${clientId} connected`);
});

server.listen(process.env.WEBSOCKET_SERVER_PORT, () => {
    console.log(`🚀 Server listening on port ${process.env.WEBSOCKET_SERVER_PORT}`);
});