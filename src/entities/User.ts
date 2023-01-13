import {Column, Entity, PrimaryGeneratedColumn, Unique} from "typeorm"
import {Common} from "./Common";

@Entity()
@Unique(["email"])
export class User extends Common {
    // TODO: Options 제거할 수 있으면 날릴 것
    @Column({name: "email"})
    email: string;

    @Column()
    password: string;

    @Column()
    name: string;
}
