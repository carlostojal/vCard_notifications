import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import NotificationDispatcher from './NotificationDispatcher.js';
import Authentication from './Authentication.js';
import Utils from './Utils.js';
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

    // parse the url params
    let params = Utils.getRequestParams(request.url);

    // check if the "authorization" param was defined
    if(!params['authorization']) {
        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
        socket.destroy();
        console.error("Received a connection request with no token");
        return;
    }
    
    let user_id;
    try {
        // verify the authentication token
        user_id = Authentication.authenticate(params['authorization']);
    } catch(err) {
        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
        socket.destroy();
        console.error("Received a connection request with an invalid token")
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