import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, BaseEntity, DeleteDateColumn } from 'typeorm';

@Entity()
export class Tag extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 100 })
    name!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
    
    @DeleteDateColumn()
    deletedAt!: Date;
}
