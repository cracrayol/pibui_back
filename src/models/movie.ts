import * as Sequelize from 'sequelize';
import { sequelize } from '../instances/sequelize';
import { Author } from './author';
import { User } from './user';
import { Tag } from './tag';

export interface MovieAddModel {
    id: number;
    title: string;
    subtitle: string;
    linkType: string;
    linkId: string;
    errorCount: number;
    valid: boolean;
    validDate: string;
    hidden: boolean;
}

export interface MovieModel extends Sequelize.Model<MovieModel, MovieAddModel> {
    id: number;
    title: string;
    subtitle: string;
    linkType: string;
    linkId: string;
    errorCount: number;
    valid: boolean;
    validDate: string;
    hidden: boolean;
    createdAt: string;
    updatedAt: string;
}

export const Movie = sequelize.define<MovieModel, MovieAddModel>('movie', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    title: Sequelize.STRING(500),
    subtitle: Sequelize.STRING(500),
    linkType: Sequelize.ENUM('youtube'),
    linkId: Sequelize.STRING,
    errorCount: Sequelize.INTEGER,
    valid: Sequelize.BOOLEAN,
    validDate: Sequelize.DATE,
    hidden: Sequelize.BOOLEAN
});

Movie.belongsTo(User, {});
Movie.belongsTo(Author, {});
Movie.belongsToMany(Tag, { through: 'MovieTags' });
