import {
    Entity, Column, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable, CreateDateColumn, UpdateDateColumn, BaseEntity
} from 'typeorm';
import { User } from './user';
import { Tag } from './tag';
import { Author } from './author';

@Entity()
export class Movie extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 500 })
    title: string;

    @Column({ length: 500 })
    subtitle: string;

    @Column({ length: 50 })
    linkType: string;

    @Column({ length: 50 })
    linkId: string;

    @Column({ type: 'tinyint' })
    errorCount: number;

    @Column()
    valid: boolean;

    @Column('datetime')
    validDate: string;

    @Column()
    hidden: boolean;

    @ManyToOne(type => User)
    user: User;

    @ManyToOne(type => Author, author => author.movies)
    author: Author;

    @ManyToMany(type => Tag)
    @JoinTable({ name: 'movie_tag' })
    tags: Tag[];

    @CreateDateColumn()
    createdAt: string;

    @UpdateDateColumn()
    updatedAt: string;
}
