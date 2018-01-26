import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn, BaseEntity } from 'typeorm';
import { Movie } from './movie';

@Entity()
export class Author extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    subname: string;

    @OneToMany(type => Movie, movie => movie.author)
    movies: Movie[];

    @CreateDateColumn()
    createdAt: string;

    @UpdateDateColumn()
    updatedAt: string;

}

