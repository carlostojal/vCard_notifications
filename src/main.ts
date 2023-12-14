import { Server, Socket } from 'socket.io';
import http, { createServer } from 'http';
import NotificationDispatcher from './NotificationDispatcher.js';
import { HistoryManager } from './HistoryManager.js';
import type { Notification } from './Notification.js';
import express, { Express, Request, Response } from 'express';
import 'dotenv/config.js'

// create express app
const app: Express = express();

// create the http server
const server: http.Server = createServer(app);

// create the websocket server
const io = new Server(server, {
    transports: ['websocket', 'polling'],
    cors: {
        origin: process.env.FRONTEND_URL,
        methods: ["GET", "POST"],
        credentials: true
    }
});

io.use((socket, next) => {

    if(socket.handshake.auth.userId == undefined) {
        return next(new Error("Client ID not provided!"));
    }

    next();
});

// create the notification dispatcher instance
const dispatcher = new NotificationDispatcher();

// history manager
const historyManager = new HistoryManager(process.env.HISTORY_FILE || "./data/history.json");
try {
    historyManager.loadFromFile();
} catch (err) {
    console.error("Could not open history file");
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
    dispatcher.registerClient(socket.handshake.auth.userId, socket);

    console.log(`New client ${socket.handshake.auth.userId} connected`);
});

// define the history endpoint
app.get('/history/:user_id', (req: Request, res: Response) => {
    res.json(historyManager.getHistory(req.params.user_id));
});

// start the server
server.listen(process.env.WEBSOCKET_SERVER_PORT, () => {
    console.log(`🚀 Server listening on port ${process.env.WEBSOCKET_SERVER_PORT}`);
});