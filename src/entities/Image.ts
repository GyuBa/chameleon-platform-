import {Column, Entity, ManyToOne, OneToOne, Unique} from "typeorm"
import {Common} from "./Common";
import {Region} from "./Region";

// ubuntu:latest
@Entity()
export class Image extends Common {
    // 외래키 해-줘
    repository: string
    tags: string


    @ManyToOne(
        () => Region,
        (region) => region.images
    )
    region: Region;


}

// docker - image