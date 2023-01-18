import {Column, Entity, Unique} from "typeorm"
import {Common} from "./Common";

@Entity()
@Unique(["id"])
export class User extends Common {
    @Column({name: "email"})
    email: string;

    @Column()
    password: string;

    @Column()
    name: string;
}
