import {Application} from 'express';
import {BindService} from "../BindService";
import {Server} from "http";

export abstract class HTTPService extends BindService {
    abstract init(app: Application, server: Server);
}