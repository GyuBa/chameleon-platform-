import * as express from 'express';
import {RouterOptions} from 'express';
import {BaseService} from '../BaseService';

export abstract class RouteService extends BaseService {
    public router: express.Router;

    constructor(options?: RouterOptions) {
        super();
        this.router = express.Router(options);
        this.initRouter();
    }

    abstract initRouter();
}