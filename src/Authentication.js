import jwt from 'jsonwebtoken';


export default class Authentication {

    // verify the JWT and return the user ID if it's valid
    static authenticate(token) {
        let decoded;
        try {
            decoded = jwt.decode(token);
        } catch (err) {
            throw new Error('Invalid token!');
        }

        return decoded.sub;
    }
}