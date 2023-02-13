import * as express from 'express';
import {RouterOptions} from 'express';
import {BaseService} from '../BaseService';

export abstract class RouteService extends BaseService {
    public router: express.Router;

    constructor(options?: RouterOptions) {
        super();
        this.router = express.Router(options);
        this.bindThis();
        this.initRouter();
    }

    private bindThis() {
        const functions = Object.getOwnPropertyNames(Object.getPrototypeOf(this))
            .filter(f => f !== 'constructor');
        for (const name of functions) {
            this[name] = this[name].bind(this);
        }
    }

    abstract initRouter();
}