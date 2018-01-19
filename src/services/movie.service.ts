// src/services/user.service.ts

import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import * as Bluebird from 'Bluebird';
import { Movie } from '../models/movie';
import { sequelize } from '../instances/sequelize';
import { Author } from '../models/author';
import { Tag } from '../models/tag';

export class MovieService {

    getAll(limit?: number) {
        return Movie.findAll({
            where: {
                valid: true,
                hidden: false,
                errorCount: {
                    [sequelize.Op.lt]: 5
                }
            },
            order: [['validDate', 'DESC']],
            limit,
            include: [Author, Tag]
        });
    }

    getById(id: number) {
        return Movie.findOne({
            where: {
                id: id,
                valid: true,
                hidden: false,
                errorCount: {
                    [sequelize.Op.lt]: 5
                }
            },
            include: [Author, Tag]
        });
    }
}
