import * as Sequelize from 'sequelize';
import { sequelize } from '../instances/sequelize';
import { User } from './user';
import { Tag } from './tag';

export interface PlaylistAddModel {
    name: string;
    subname: string;
    userId: string;
}

export interface PlaylistModel extends Sequelize.Model<PlaylistModel, PlaylistAddModel> {
    id: number;
    name: string;
    subname: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
}

export const Playlist = sequelize.define<PlaylistModel, PlaylistAddModel>('playlist', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    name: Sequelize.STRING(250),
    current: Sequelize.BOOLEAN,
    public: Sequelize.BOOLEAN,
});

Playlist.belongsTo(User, {});
Playlist.belongsToMany(Tag, { through: 'PlaylistTags' });
