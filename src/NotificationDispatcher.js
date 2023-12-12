
export default class NotificationDispatcher {

    constructor() {
        this._clients = {};
    }

    registerClient(user_id, ws) {
        // register a new client to its websocket instance
        this._clients[user_id] = ws;
    }

    unregisterClient(user_id) {
        // unregister a client from its websocket instance
        console.log(`Client ${user_id} disconnected`);
        delete this._clients[user_id];
    }

    isClientOnline(user_id) {
        // check if a client is online
        return this._clients[user_id] !== undefined;
    }

    sendNotification(user_id, notification) {
        // send a notification to a client
        if(!this.isClientOnline(user_id)) {
            throw new Error("Client is offline");
        }
        this._clients[user_id].emit("notification", JSON.stringify(notification));
    }

    static onNotificationDispatch(dispatcher, sender, notification) {
        // dispatch the notification to the destination
        notification = JSON.parse(notification);

        // check if the destination is online
        if(!dispatcher.isClientOnline(notification._destination)) {
            console.warn("Destination is offline");
            return;
        }

        // send the notification
        dispatcher.sendNotification(notification._destination, notification);
    }
}
