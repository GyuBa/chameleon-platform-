import {Column, Entity, OneToMany, OneToOne, Unique} from "typeorm"
import {Common} from "./Common";
import {Image} from "./Image";

// ubuntu:latest
@Entity()
export class Region extends Common {
    @Column()
    host: string;

    @Column()
    port: number;
    // TODO: 후에 인증을 위한 확장 컬럼 추가 고려

    @OneToMany(
        () => Image,
        (image) => image.region
    )
    images: Image[];
}
