import {v4 as uuidv4} from "uuid";
import {RawData, ServerOptions, WebSocketServer} from "ws";
import WSManager from "./manager/WSManager";
import {IWSocket, WebSocketHandler} from "../types/chameleon-platform";

export default class WSServer<SocketData, Manager extends WSManager> {
    readonly server: WebSocketServer;
    readonly manager: Manager;
    readonly sockets: (IWSocket & { data: SocketData })[] = [];
    readonly socketsMap: { [id: string]: IWSocket & { data: SocketData } } = {};
    readonly handlers: WebSocketHandler<any, any>[] = [];

    constructor(options: ServerOptions, manager: Manager) {
        this.server = new WebSocketServer(options);
        this.server.on('connection', (socket: IWSocket & { data: SocketData }, req) => {
            socket.id = uuidv4();
            socket.req = req;
            socket.data = {} as SocketData;
            this.socketsMap[socket.id] = socket;
            this.sockets.push(socket);

            const address = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
            console.log('WebSocketServer: ' + address + ' connected.');

            this.handlers.forEach(h => h.onReady?.(this, socket));

            socket.on('message', (message: RawData, isBinary: boolean) => {
                this.handlers.forEach(h => h.onMessage?.(this, socket, message, isBinary));
            });

            socket.on('error', (error: Error) => {
                console.error('WebSocketServer Error: ' + address, error);
                socket.close();
            });

            socket.on('close', (code: number, reason: Buffer) => {
                this.handlers.forEach(h => h.onClose?.(this, socket, code, reason));
                this.sockets.splice(this.sockets.indexOf(socket), 1);
                delete this.socketsMap[socket.id];
            });
        });
        this.manager = manager;
        this.manager.init(this);
    }

    addHandler(handler: WebSocketHandler<any, any>) {
        this.handlers.push(handler);
    }

    removeHandler(handler: WebSocketHandler<any, any>) {
        const index = this.handlers.indexOf(handler);
        if (index > -1) {
            this.handlers.splice(index, 1);
        }
    }
}
