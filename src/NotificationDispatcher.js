
class NotificationDispatcher {

    constructor() {
        this._clients = {};
    }

    registerClient(user_id, websocket) {
        // register a new client to its websocket instance
        this._clients[user_id] = websocket;
    }

    unregisterClient(user_id) {
        // unregister a client from its websocket instance
        delete this._clients[user_id];
    }

    isClientOnline(user_id) {
        // check if a client is online
        return this._clients[user_id] !== undefined;
    }

    sendNotification(user_id, notification) {
        // send a notification to a client
        this._clients[user_id].send(JSON.stringify(notification));
    }
}
