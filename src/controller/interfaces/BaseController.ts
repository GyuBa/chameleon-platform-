import {Repository} from 'typeorm/repository/Repository';
import {EntityTarget} from 'typeorm/common/EntityTarget';
import {ObjectLiteral} from 'typeorm/common/ObjectLiteral';
import {DataSource} from "typeorm";

export class BaseController<Entity extends ObjectLiteral> {
    public repository: Repository<Entity>;

    constructor(source: DataSource, target: EntityTarget<Entity>) {
        this.repository = source.getRepository(target);
    }
}