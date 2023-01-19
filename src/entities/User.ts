import {Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique} from 'typeorm';
import {Common} from './Common';
import {Model} from './Model';

@Entity()
@Unique(['email'])
export class User extends Common {
    // TODO: Options 제거할 수 있으면 날릴 것
    @Column()
        email: string;

    @Column()
        password: string;

    @Column()
        name: string;

    @ManyToOne(
        () => Model,
        (model) => model.register
    )
        models: Model[];
}
