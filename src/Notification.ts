import { v4 as uuidv4 } from 'uuid';

export enum NotificationType {
    INFO = "info",
    CREDIT_IN = "credit_in",
    CREDIT_OUT = "credit_out",
    CARD_BLOCK = "card_block"
}


export class Notification {

    id: string;
    destination: string;
    type: NotificationType;
    message: string;
    read: boolean = false;
    timestamp: number = Date.now();

    constructor(destination: string, type: NotificationType, message: string) {
        this.id = uuidv4();
        this.destination = destination;
        this.type = type;
        this.message = message;
        this.timestamp = Date.now();
    }

    // this is the destination user ID
    getDestination() {
        return this.destination;
    }

    // this is the type of notification
    getType() {
        return this.type;
    }

    // this is the message to display to the user
    getMessage() {
        return this.message;
    }

    // this is whether the notification has been read
    isRead() {
        return this.read;
    }

    setRead(read: boolean) {
        this.read = read;
    }

    getTimestamp() {
        return this.timestamp;
    }
}