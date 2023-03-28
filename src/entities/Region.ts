import {Column, Entity, OneToMany} from 'typeorm';
import {Common} from './interfaces/Common';
import {Image} from './Image';

// ubuntu:latest
@Entity()
export class Region extends Common {
    @Column()
        name: string;

    @Column()
        host: string;

    @Column()
        port: number;
}
