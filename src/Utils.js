export default class Utils {

    static getRequestParams(url) {

        let params = {};

        let tmp = url.split('?');

        if(tmp.length < 2) return params;

        tmp.forEach((param) => {
            let [key, value] = param.split('=');
            params[key] = value;
        })

        return params;
    }
}