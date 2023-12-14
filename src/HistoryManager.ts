import fs from 'fs';
import type { Notification } from './Notification';

export class HistoryManager {

    private history: Map<string, Array<Notification>>;
    private filename: string;

    constructor(filename: string) {
        this.history = new Map<string, Array<Notification>>();
        this.filename = filename;
    }

    // get history for user
    public getHistory(user: string): Array<any> {
        return this.history.get(user) || [];
    }

    // add history for user
    public addNotification(user: string, notification: Notification) {
        let userHistory = this.history.get(user) || [];
        userHistory.push(notification);
        this.history.set(user, userHistory);
        this.saveToFile();
    }

    public loadFromFile() {
        let rawdata = fs.readFileSync(this.filename);
        this.history = new Map<string, Array<Notification>>(JSON.parse(rawdata.toString()));
    }

    public saveToFile() {
        try {
            fs.unlinkSync(this.filename);
        } catch (err) {
            // ignore
        }
        fs.writeFileSync(this.filename, JSON.stringify(Array.from(this.history.entries())), { flag: 'wx' });
    }
}