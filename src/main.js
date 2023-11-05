import { WebSocketServer } from 'ws';
import { createServer, request } from 'http';
import { Notification, NotificationType } from './Notification.js';
import NotificationDispatcher from './NotificationDispatcher.js';
import 'dotenv/config.js'

// create the http server
const server = createServer();

// create the websocket server
const wss = new WebSocketServer({ noServer: true });

// create the notification dispatcher instance
const dispatcher = new NotificationDispatcher();

// listen for new client connections
wss.on('connection', (ws, request, client) => {

    // TODO
    console.log(`New client ${client} connected`);
});

// handler when a new socket connection is started
server.on('upgrade', (request, socket, head) => {
    
    console.log(request);
    // TODO
});

server.listen(process.env.WEBSOCKET_SERVER_PORT, () => {
    console.log(`🚀 Server listening on port ${process.env.WEBSOCKET_SERVER_PORT}`);
});