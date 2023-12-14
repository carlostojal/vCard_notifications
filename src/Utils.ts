
export default class Utils {

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
}