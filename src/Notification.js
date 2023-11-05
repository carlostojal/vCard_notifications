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

    getDestination() {
        return this._destination;
    }

    getType() {
        return this._type;
    }

    getMessage() {
        return this._message;
    }
}