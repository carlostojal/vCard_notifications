import jwt from 'jsonwebtoken';


export default class Authentication {

    // verify the JWT and return the user ID if it's valid
    static authenticate(token) {
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        } catch (err) {
            throw new Error('Invalid token!');
        }

        return decoded.sub;
    }
}