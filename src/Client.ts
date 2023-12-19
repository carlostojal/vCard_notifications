import { Socket } from 'socket.io';

export default class Client {

    phoneNumber: string;
    websocket: Socket | null;
    firebaseId: string | null;

    constructor(phoneNumber: string) {
        this.phoneNumber = phoneNumber;
        this.websocket = null;
        this.firebaseId = null;
    }

    getPhoneNumber(): string {
        return this.phoneNumber;
    }

    setPhoneNumber(phoneNumber: string) {
        this.phoneNumber = phoneNumber;
    }

    getWebSocket(): Socket | null {
        return this.websocket;
    }

    setWebSocket(socket: Socket | null) {
        this.websocket = socket;
    }

    getFirebaseId(): string | null {
        return this.firebaseId;
    }

    setFirebaseId(firebaseId: string) {
        this.firebaseId = firebaseId;
    }
}