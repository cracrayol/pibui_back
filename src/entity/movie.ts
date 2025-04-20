import {
    Entity, Column, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable, CreateDateColumn, UpdateDateColumn, BaseEntity, Index,
    DeleteDateColumn
} from 'typeorm';
import { User } from './user';
import { Tag } from './tag';
import { Author } from './author';

@Entity()
export class Movie extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 500 })
    @Index({ fulltext: true })
    title!: string;

    @Column({ length: 500 })
    subtitle!: string;

    @Column({ length: 50 })
    linkId!: string;

    @Column({ type: 'tinyint' })
    errorCount!: number;

    @ManyToOne(() => User, {
        onDelete: 'SET NULL'
    })
    user!: User;

    @ManyToOne(() => Author, author => author.movies, {
        onDelete: 'CASCADE'
    })
    author!: Author;

    @ManyToMany(() => Tag)
    @JoinTable({ name: 'movie_tag' })
    tags!: Tag[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @DeleteDateColumn()
    deletedAt!: Date;
}
