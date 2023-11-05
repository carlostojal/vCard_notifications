export const NotificationType = {
    INFO: "info",
    CREDIT_IN: "credit_in",
    CREDIT_OUT: "credit_out",
    CARD_BLOCK: "card_block"
}


export class Notification {

    constructor(destination, type, message) {
        this._destination = destination;
        this._type = type;
        this._message = message;
    }

    // this is the destination user ID
    getDestination() {
        return this._destination;
    }

    // this is the type of notification
    getType() {
        return this._type;
    }

    // this is the message to display to the user
    getMessage() {
        return this._message;
    }
}