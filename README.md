# vCard Notification Service

This service uses WebSocket to dispatch notification to the Vue.js clients.

## Running

First, you need to setup the app by creating a `.env` file. Create a copy of the `.env.example` file and make your own changes.

### Bare metal

- Run `npm install`;
- Run `npm start`.

### Docker

- Run `docker build -t vcard_notifications .`;
- Run `docker run vcard_notifications`.
