import { Socket } from "socket.io";
import type { Notification } from "./Notification.js";
import Client from './Client.js';
import { App, initializeApp, cert } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';

export default class NotificationDispatcher {

    // maps phone number to socket instance and firebase ID
    _clients: Map<string, Client>;
    firebaseApp: App;

    constructor() {
        this._clients = new Map<string, Client>();

        // create firebase app
        this.firebaseApp = initializeApp({
            credential: cert(process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH || "./keys/serviceAccountKey.json"),
            projectId: process.env.FIREBASE_PROJECT_ID
        });
    }

    registerWebSocket(user_id: string, ws: Socket) {
        // verify the client exists
        if(this._clients.has(user_id)) {
            this._clients.get(user_id)?.setWebSocket(ws);
        } else {
            let newClient: Client = new Client(user_id);
            this._clients.set(user_id, newClient);
        }
    }

    registerFirebase(user_id: string, firebase_id: string) {
        if(this._clients.has(user_id)) {
            this._clients.get(user_id)?.setFirebaseId(firebase_id);
        } else {
            let newClient: Client = new Client(user_id);
            this._clients.set(user_id, newClient);
        }
    }

    unregisterClient(user_id: string) {
        // unregister a client
        console.log(`Client ${user_id} disconnected`);
        this._clients.delete(user_id);
    }

    unregisterSocket(ws: Socket) {
        // unregister a socket from its client
        this._clients.forEach((client: Client, user_id: string) => {
            if(client.getWebSocket() === ws) {
                // remove the websocket instance
                this._clients.get(user_id)?.setWebSocket(null);
                console.log(`Client ${user_id} disconnected`);
            }
        });
    }

    isClientOnline(user_id: string) {
        // check if a client is online
        return this._clients.get(user_id)?.websocket !== null;
    }

    sendNotification(user_id: string, notification: Notification) {
        // send a notification to a client via firebase
        this.sendFirebaseNotification(user_id, notification);

        // send a notification to a client via websocket
        if(!this.isClientOnline(user_id)) {
            throw new Error("Client is offline");
        }
        this._clients.get(user_id)?.websocket?.emit("notification", JSON.stringify(notification));
    }

    sendFirebaseNotification(user_id: string, notification: Notification) {
        // send a notification to a client using firebase
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

        this._clients.get(user_id)?.websocket?.emit("transaction", JSON.stringify(transaction));
    }
}
