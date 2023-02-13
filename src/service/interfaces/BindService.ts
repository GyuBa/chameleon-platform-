import {BaseService} from './BaseService';

export class BindService extends BaseService {
    constructor() {
        super();
        this.bindThis();
    }

    protected bindThis() {
        const functions = Object.getOwnPropertyNames(Object.getPrototypeOf(this))
            .filter(f => f !== 'constructor');
        for (const name of functions) {
            this[name] = this[name].bind(this);
        }
    }
}