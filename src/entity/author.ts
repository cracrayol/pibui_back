import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn, BaseEntity, Index, DeleteDateColumn } from 'typeorm';
import { Movie } from './movie';

@Entity()
export class Author extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 250 })
    @Index({ fulltext: true })
    name!: string;

    @Column({ length: 250 })
    subname!: string;

    @OneToMany(() => Movie, movie => movie.author)
    movies!: Movie[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
    
    @DeleteDateColumn()
    deletedAt!: Date;
}

