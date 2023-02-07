import {Column, Entity, JoinColumn, OneToOne} from 'typeorm';
import {Common} from "./Common";
import {User} from "./User";


@Entity()
export class Wallet extends Common{
    @Column({default: 0})
        point: number;

    @OneToOne(() => User)
    @JoinColumn({name: 'user_id', referencedColumnName: 'id'})
    user: User;
}
