import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user';
import { Tag } from './tag';

@Entity()
export class Playlist {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    current: boolean;

    @Column()
    public: boolean;

    @ManyToOne(type => User, user => user.playlists)
    user: User;

    @ManyToMany(type => Tag)
    @JoinTable({name: 'playlist_tag'})
    tags: Tag[];

    @CreateDateColumn()
    createdAt: string;

    @UpdateDateColumn()
    updatedAt: string;
}
