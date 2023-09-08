import {
    Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinTable, CreateDateColumn, UpdateDateColumn, BaseEntity, OneToMany, ManyToMany
} from 'typeorm';
import { User } from './user';
import { Tag } from './tag';

@Entity()
export class Playlist extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column({
        default: false
    })
    public!: boolean;

    @ManyToOne(() => User, user => user.playlists, {
        onDelete: 'CASCADE'
    })
    user!: User;

    @ManyToMany(() => Tag)
    @JoinTable({ name: 'playlist_f_tag' })
    forbiddenTags!: Tag[];

    @ManyToMany(() => Tag)
    @JoinTable({ name: 'playlist_a_tag' })
    allowedTags!: Tag[];

    @ManyToMany(() => Tag)
    @JoinTable({ name: 'playlist_m_tag' })
    mandatoryTags!: Tag[];

    @CreateDateColumn()
    createdAt!: string;

    @UpdateDateColumn()
    updatedAt!: string;
}
