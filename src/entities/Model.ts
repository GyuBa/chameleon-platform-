import {Column, Entity, ManyToOne, OneToOne, Unique} from 'typeorm';
import {Common} from './Common';
import {User} from './User';
import {Image} from './Image';

// ubuntu:latest
@Entity()
export class Model extends Common {
    @Column()
        name:string;
    @Column()
        description: string;

    @ManyToOne(
        () => User,
        (user) => user.models
    )
        register:User;

    @OneToOne(
        () => Image,
        (image) => image.model
    )
        image:Image;

    @Column()
        inputType:string;

    @Column()
        outputType:string;
}

//Ai-Model