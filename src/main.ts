import { Server, Socket } from 'socket.io';
import http, { createServer } from 'http';
import NotificationDispatcher from './NotificationDispatcher.js';
import { HistoryManager } from './HistoryManager.js';
import type { Notification } from './Notification.js';
import express, { Express, Request, Response } from 'express';
import { v4 as uuidv4} from 'uuid';
import 'dotenv/config.js'
import cors from 'cors';

// create express app
const app: Express = express();
app.use(express.json());
app.use(cors({
    origin: "*"
}))

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

        // assign the current timestamp
        notification_obj.timestamp = Date.now();

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
    dispatcher.registerWebSocket(socket.handshake.auth.userId, socket);

    console.log(`New client ${socket.handshake.auth.userId} connected`);
});

app.put('/notifications', (req: Request, res: Response) => {

    let notif: Notification = req.body;

    notif.id = uuidv4();

    dispatcher.sendNotification(notif.destination, notif);
    historyManager.addNotification(notif.destination, notif);

    res.status(200);
    res.send();
});

// define the history endpoint
app.get('/history/:user_id', (req: Request, res: Response) => {
    res.json(historyManager.getHistory(req.params.user_id));
});

app.patch('/history/:user_id/:notif_id', (req: Request, res: Response) => {
    if(req.params.user_id == undefined || req.params.notif_id == undefined) {
        res.status(400);
        res.send("User ID or notification ID not set");
    }

    historyManager.toggleRead(req.params.user_id, req.params.notif_id);
    res.status(200);
    res.send();
});

// register a firebase client id to a vcard phone number
app.post('/registerFirebaseClient', (req: Request, res: Response) => {
    // get the phone number from the request
    const phone_number = req.body.phone_number;

    // get the firebase id from the request
    const firebase_id = req.body.firebase_id;

    // check if both were provided
    if(phone_number == undefined || firebase_id == undefined) {
        // bad request
        res.status(400);
        res.send("Phone number and Firebase ID must be provided!");
        return;
    }

    console.log("Registered Firebase client")

    // register the firebase id
    dispatcher.registerFirebase(phone_number, firebase_id);

    res.status(200);
    res.send();
});

// start the server
server.listen(process.env.WEBSOCKET_SERVER_PORT, () => {
    console.log(`🚀 Server listening on port ${process.env.WEBSOCKET_SERVER_PORT}`);
});