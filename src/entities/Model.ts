import {Column, Entity, OneToOne, Unique} from "typeorm"
import {Common} from "./Common";
import {User} from "./User";
import {Image} from "./Image";

// ubuntu:latest
@Entity()
export class Model extends Common {
    image:Image;
    name:string;
    description: string;
    register:User;
    // input type output tpye
}

//Ai-Model