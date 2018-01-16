import * as Sequelize from 'sequelize';
import { sequelize } from '../instances/sequelize';

export interface AuthorAddModel {
    name: string;
    subname: string;
}

export interface AuthorModel extends Sequelize.Model<AuthorModel, AuthorAddModel> {
    id: number;
    name: string;
    subname: string;
    createdAt: string;
    updatedAt: string;
}

export const Author = sequelize.define<AuthorModel, AuthorAddModel>('author', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    name: Sequelize.STRING(250),
    subname: Sequelize.STRING(250)
});
