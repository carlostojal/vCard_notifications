import { Notification } from "./Notification";

export enum SortDirection {
    ASC = 1,
    DESC = -1
};

export class Utils {

    static getRequestParams(url: string): Map<string, string> {

        let params = new Map<string, string>();

        let tmp = url.split('?');

        if(tmp.length < 2) return params;

        tmp.forEach((param) => {
            let [key, value] = param.split('=');
            params.set(key, value);
        })

        return params;
    }

    static sortHistory(history: Array<Notification>, direction: SortDirection): Array<Notification> {

        let sortedHistory = history.sort((a, b) => {
            if(direction == SortDirection.ASC)
                return a.timestamp - b.timestamp;
            else
                return b.timestamp - a.timestamp;
        });

        return sortedHistory;
    }
}