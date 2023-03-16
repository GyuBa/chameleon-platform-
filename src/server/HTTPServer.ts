import * as express from "express";
import {Application} from "express";
import * as http from "http";
import {Server} from "http";
import {HTTPHandler} from "../types/chameleon-platform";

export default class HTTPServer {
    readonly app: Application;
    readonly server: Server;

    constructor() {
        this.app = express();
        this.server = http.createServer(this.app);
    }

    addHandler(httpHandler: HTTPHandler) {
        httpHandler.init(this.app, this.server);
    }

    listen(port: number) {
        this.server.listen(port, () => {
            console.log(`HTTPServer Listening on ${port}.`);
        });
    }

    close() {
        this.server.close(() => {
            console.log(`HTTPServer closed.`);
        });
    }
}