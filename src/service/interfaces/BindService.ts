import {PlatformService} from './PlatformService';

export class BindService extends PlatformService {
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