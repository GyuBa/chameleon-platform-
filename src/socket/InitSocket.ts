import * as webSocket from 'ws';
import {echo} from '../service/WebSocketService';
export function initSocket(server) {
    const wss = new webSocket.Server({ server });

    wss.on('connection', (ws, req)=>{
        console.log(req.connection.remoteAddress);

        ws.id = req.headers['sec-websocket-key'];

        ws.on('message', (response)=>{
            const obj = JSON.parse(response.toString());
            const {type, data} = obj;
            console.log(obj);
            switch(type) {
            case 'send_msg':
                echo(ws, data);
                break;
            }
        });
    });
}