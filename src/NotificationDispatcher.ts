import { Socket } from "socket.io";
import type { Notification } from "./Notification";
import { App, initializeApp, cert } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';

const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH || "./keys/serviceAccountKey.json");

export default class NotificationDispatcher {

    _clients: Map<string, Socket>;
    _sockets: Map<Socket, string>;
    firebaseApp: App;

    constructor() {
        this._clients = new Map<string, Socket>();
        this._sockets = new Map<Socket, string>();

        // create firebase app
        this.firebaseApp = initializeApp({
            credential: cert(serviceAccount),
            projectId: process.env.FIREBASE_PROJECT_ID
        });
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

    sendFirebaseNotification(user_id: string, notification: Notification) {
        // send a notification to a client using firebase
        if(!this.isClientOnline(user_id)) {
            throw new Error("Client is offline");
        }

        const messaging = getMessaging(this.firebaseApp);
        messaging.send({
            token: user_id,
            notification: {
                title: "A transaction just happened",
                body: notification.message,
            }
        });
    }

    sendTransaction(user_id: string, transaction: any) {

        // send the transaction to the client
        if(!this.isClientOnline(user_id)) {
            throw new Error("Client is offline");
        }

        this._clients.get(user_id)?.emit("transaction", JSON.stringify(transaction));
    }
}
