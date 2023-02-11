import {Repository} from 'typeorm/repository/Repository';
import {source} from '../../DataSource';
import {EntityTarget} from 'typeorm/common/EntityTarget';
import {ObjectLiteral} from 'typeorm/common/ObjectLiteral';

export class BaseController<Entity extends ObjectLiteral> {
    repository: Repository<Entity>;

    constructor(target: EntityTarget<Entity>) {
        this.repository = source.getRepository(target);
    }
}