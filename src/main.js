import { WebSocketServer } from 'ws';
import { createServer, request } from 'http';
import { Notification, NotificationType } from './Notification.js';
import NotificationDispatcher from './NotificationDispatcher.js';
import Authentication from './Authentication.js';
import 'dotenv/config.js'

// create the http server
const server = createServer();

// create the websocket server
const wss = new WebSocketServer({ noServer: true });

// create the notification dispatcher instance
const dispatcher = new NotificationDispatcher();

// listen for new client connections
wss.on('connection', (ws, request, client) => {

    // register the websocket event handlers
    ws.on('message', (notification) => {
        NotificationDispatcher.onNotificationDispatch(dispatcher, client, notification);
    });

    ws.on('close', () => {
        dispatcher.unregisterClient(client);
    });

    // register the client with the dispatcher
    dispatcher.registerClient(client, ws);

    console.log(`New client ${client} connected`);
});

// handler when a new socket connection is started
server.on('upgrade', (request, socket, head) => {

    if(!request.headers.authorization) {
        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
        socket.destroy();
        return;
    }
    
    let user_id;
    try {
        // verify the authentication token
        user_id = Authentication.authenticate(request.headers.authorization);
    } catch(err) {
        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
        socket.destroy();
        return;
    }

    // emit the connection event to the websocket server
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request, user_id);
    });
});

server.listen(process.env.WEBSOCKET_SERVER_PORT, () => {
    console.log(`🚀 Server listening on port ${process.env.WEBSOCKET_SERVER_PORT}`);
});