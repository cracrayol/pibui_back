import * as Sequelize from 'sequelize';
import { sequelize } from '../instances/sequelize';
import { Movie } from './movie';

export interface TagAddModel {
    name: string;
    valid: boolean;
}

export interface TagModel extends Sequelize.Model<TagModel, TagAddModel> {
    id: number;
    name: string;
    valid: boolean;
    createdAt: string;
    updatedAt: string;
}

export const Tag = sequelize.define<TagModel, TagAddModel>('tag', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: Sequelize.STRING(250),
    valid: Sequelize.BOOLEAN
});

// Tag.belongsToMany(Movie, { through: 'MovieTags' });
