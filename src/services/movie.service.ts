// src/services/user.service.ts

import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import * as Bluebird from 'Bluebird';
import { Movie } from '../models/movie';
import { sequelize } from '../instances/sequelize';
import { Author } from '../models/author';
import { Tag } from '../models/tag';
import { randomBytes } from 'crypto';

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

    getRandom() {
        return Movie.count({
            where: {
                valid: true,
                hidden: false,
                errorCount: {
                    [sequelize.Op.lt]: 5
                }
            }
        }).then(cnt => {
            return Movie.findOne({
                where: {
                    valid: true,
                    hidden: false,
                    errorCount: {
                        [sequelize.Op.lt]: 5
                    }
                },
                include: [Author, Tag],
                order: [['id', 'ASC']],
                offset: (rand(0, cnt) - 1)
            });
        });
    }
}

function rand(min = 0, max = 0x7FFFFFFF): number {
    const diff = max - min;
    const bytes = randomBytes(4).readInt32LE(0);
    const fp = (bytes & 0x7FFFFFFF) / 2147483647.0;
    return Math.round(fp * diff) + min;
}
