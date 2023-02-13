import * as webSocket from 'ws';

export function initSocket(server) {
    const wss = new webSocket.Server({server, path: '/websocket'});

    wss.on('connection', (ws, req) => {
        console.log(req.connection.remoteAddress);

        ws.id = req.headers['sec-websocket-key'];

        ws.on('message', (response) => {
            const obj = JSON.parse(response.toString());
            const {type, data} = obj;
            console.log(obj);
            switch (type) {
            case 'send_msg':
                if (data == 'hi') {
                    ws.send('Hello');
                }
                break;
            }
        });
    });
}