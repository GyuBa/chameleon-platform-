import * as express from 'express';
import {RouterOptions} from 'express';
import {BindService} from "../BindService";

export abstract class RouteService extends BindService {
    public router: express.Router;

    constructor(options?: RouterOptions) {
        super();
        this.router = express.Router(options);
        this.initRouter();
    }

    abstract initRouter();
}