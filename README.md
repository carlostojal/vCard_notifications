# vCard Notification Service

This service uses WebSocket to dispatch notification to the Vue.js clients.

## Authentication

This service does nothing special about authentication. In fact, it must not be trusted at all. A JWT with a symmetric key is used, which contains the user ID. The payload of the JWT just looks like this:
```json
{
  "sub": "0987654321"
}
```

## Running

First, you need to setup the app by creating a `.env` file. Create a copy of the `.env.example` file and make your own changes.

### Bare metal

- Run `npm install`;
- Run `npm run build`;
- Get the Firebase service account key from the Firebase console and place it in `keys/serviceAccountKey.json`, or update the `.env` accordingly.
- Verify that the variable `FIREBASE_PROJECT_ID` is right.
- Run `npm start`.

### Docker

- Run `docker build -t vcard_notifications .`;
- Run `docker run vcard_notifications`.
