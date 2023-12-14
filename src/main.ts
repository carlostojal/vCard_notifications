import { Server, Socket } from 'socket.io';
import { createServer } from 'http';
import NotificationDispatcher from './NotificationDispatcher.js';
import { HistoryManager } from './HistoryManager.js';
import type { Notification } from './Notification.js';
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

// client id
let clientId: string | undefined = undefined;

io.use((socket, next) => {

    let handshakeData: any = socket.request;

    if(!handshakeData._query['client_id']) {
        next(new Error("Invalid client id"));
        return;
    }

    clientId = handshakeData._query['client_id'];

    next();
});

// create the notification dispatcher instance
const dispatcher = new NotificationDispatcher();

// history manager
const historyManager = new HistoryManager(process.env.HISTORY_FILE || "data/history.json");
try {
    historyManager.loadFromFile();
} catch (err) {
    console.error(err);
}

// listen for new client connections
io.on('connection', (socket: Socket) => {

    // register the websocket event handlers
    
    // on notification
    socket.on("notification", (notification: string) => {

        let notification_obj: Notification = JSON.parse(notification);

        try {
            // send the notification to the destination
            dispatcher.sendNotification(notification_obj.destination, notification_obj);
            historyManager.addNotification(notification_obj.destination, notification_obj);
        } catch (err) {
            console.error(err);
        }
    });

    // on transaction
    socket.on("transaction", (transaction: string) => {

        let transaction_obj = JSON.parse(transaction);

        try {
            // send the transaction to the destination
            dispatcher.sendTransaction(transaction_obj.destination, transaction);
        } catch (err) {
            console.error(err);
        }
    });

    socket.on('disconnect', () => {
        dispatcher.unregisterSocket(socket);
    });

    // register the client with the dispatcher
    if(clientId) {
        dispatcher.registerClient(clientId, socket);

        console.log(`New client ${clientId} connected`);
    }
});

server.listen(process.env.WEBSOCKET_SERVER_PORT, () => {
    console.log(`🚀 Server listening on port ${process.env.WEBSOCKET_SERVER_PORT}`);
});