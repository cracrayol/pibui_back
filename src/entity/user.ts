import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn, BaseEntity, ManyToOne } from 'typeorm';
import { Playlist } from './playlist';

@Entity()
export class User extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 250 })
    email!: string;

    @Column()
    password!: string;

    @OneToMany(() => Playlist, playlist => playlist.user)
    playlists!: Playlist[];

    @Column({ nullable: true })
    currentPlaylistId!: number;

    @Column({ default: false })
    isAdmin!: boolean;

    @CreateDateColumn()
    createdAt!: string;

    @UpdateDateColumn()
    updatedAt!: string;
}
