import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn} from "typeorm"

@Entity()
export class Common {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    createdTime: Date;

    @UpdateDateColumn()
    updatedTime: Date;
}