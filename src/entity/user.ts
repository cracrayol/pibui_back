import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn, BaseEntity } from 'typeorm';
import { Playlist } from './playlist';

@Entity()
export class User extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 250 })
    email!: string;

    @Column()
    password!: string;

    oldPassword!: string;
    
    @OneToMany(() => Playlist, playlist => playlist.user)
    playlists!: Playlist[];

    @Column({ nullable: true })
    currentPlaylistId!: number;

    @Column({ default: false })
    isAdmin!: boolean;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
