import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn, BaseEntity, Index } from 'typeorm';
import { Movie } from './movie';

@Entity()
export class Author extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 250 })
    @Index({fulltext: true})
    name: string;

    @Column({ length: 250 })
    subname: string;

    @OneToMany(type => Movie, movie => movie.author)
    movies: Movie[];

    @CreateDateColumn()
    createdAt: string;

    @UpdateDateColumn()
    updatedAt: string;

}

