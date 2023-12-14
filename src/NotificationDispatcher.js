"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var NotificationDispatcher = /** @class */ (function () {
    function NotificationDispatcher() {
        this._clients = new Map();
        this._sockets = new Map();
    }
    NotificationDispatcher.prototype.registerClient = function (user_id, ws) {
        // register a new client to its websocket instance
        this._clients.set(user_id, ws);
        this._sockets.set(ws, user_id);
    };
    NotificationDispatcher.prototype.unregisterClient = function (user_id) {
        // unregister a client from its websocket instance
        console.log("Client ".concat(user_id, " disconnected"));
        this._sockets.delete(this._clients.get(user_id));
        this._clients.delete(user_id);
    };
    NotificationDispatcher.prototype.unregisterSocket = function (ws) {
        // unregister a socket from its client
        var user_id = this._sockets.get(ws);
        this._clients.delete(user_id);
        this._sockets.delete(ws);
        console.log("Client ".concat(user_id, " disconnected"));
    };
    NotificationDispatcher.prototype.isClientOnline = function (user_id) {
        // check if a client is online
        return this._clients.has(user_id);
    };
    NotificationDispatcher.prototype.sendNotification = function (user_id, notification) {
        var _a;
        // send a notification to a client
        if (!this.isClientOnline(user_id)) {
            throw new Error("Client is offline");
        }
        (_a = this._clients.get(user_id)) === null || _a === void 0 ? void 0 : _a.emit("notification", JSON.stringify(notification));
    };
    NotificationDispatcher.prototype.sendTransaction = function (user_id, transaction) {
        var _a;
        // send the transaction to the client
        if (!this.isClientOnline(user_id)) {
            throw new Error("Client is offline");
        }
        (_a = this._clients.get(user_id)) === null || _a === void 0 ? void 0 : _a.emit("transaction", JSON.stringify(transaction));
    };
    return NotificationDispatcher;
}());
exports.default = NotificationDispatcher;
