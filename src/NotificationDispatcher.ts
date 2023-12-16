import { Socket } from "socket.io";
import type { Notification } from "./Notification";

export default class NotificationDispatcher {

    _clients: Map<string, Socket>;
    _sockets: Map<Socket, string>;

    constructor() {
        this._clients = new Map<string, Socket>();
        this._sockets = new Map<Socket, string>();
    }

    registerClient(user_id: string, ws: Socket) {
        // register a new client to its websocket instance
        this._clients.set(user_id, ws);
        this._sockets.set(ws, user_id);
    }

    unregisterClient(user_id: string) {
        // unregister a client from its websocket instance
        console.log(`Client ${user_id} disconnected`);
        this._sockets.delete(this._clients.get(user_id) as Socket);
        this._clients.delete(user_id);
    }

    unregisterSocket(ws: Socket) {
        // unregister a socket from its client
        let user_id = this._sockets.get(ws) as string;
        this._clients.delete(user_id);
        this._sockets.delete(ws);
        console.log(`Client ${user_id} disconnected`);
    }

    isClientOnline(user_id: string) {
        // check if a client is online
        return this._clients.has(user_id);
    }

    sendNotification(user_id: string, notification: Notification) {
        // send a notification to a client
        if(!this.isClientOnline(user_id)) {
            throw new Error("Client is offline");
        }
        this._clients.get(user_id)?.emit("notification", JSON.stringify(notification));
    }

    sendTransaction(user_id: string, transaction: any) {

        // send the transaction to the client
        if(!this.isClientOnline(user_id)) {
            throw new Error("Client is offline");
        }

        this._clients.get(user_id)?.emit("transaction", JSON.stringify(transaction));
    }
}
