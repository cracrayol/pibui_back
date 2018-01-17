// src/routers/user.router.ts

import { Router, Request, Response } from 'express'
import { Movie } from '../models/movie';
import { sequelize } from '../instances/sequelize';
import { Author } from '../models/author';
import { Tag } from '../models/tag';
import { randomBytes } from 'crypto';

export const movieRouter = Router();

movieRouter.get('/latest', (req: Request, res: Response) => {
    Movie.findAll({
        where: {
            valid: true,
            hidden: false,
            errorCount: {
                [sequelize.Op.lt]: 5
            }
        },
        order: [['validDate', 'DESC']],
        limit: 30,
        include: [Author, Tag]
    }).then(movie => {
        res.send(movie);
    });
});

movieRouter.get('/:id', (req: Request, res: Response) => {
    if (req.params.id && req.params.id > 0) {
        Movie.findOne({
            where: {
                id: req.params.id,
                valid: true,
                hidden: false,
                errorCount: {
                    [sequelize.Op.lt]: 5
                }
            },
            include: [Author, Tag]
        }).then(movie => {
            res.send(movie);
        });
    } else {
        let where = {
            valid: true,
            hidden: false,
            errorCount: {
                [sequelize.Op.lt]: 5
            }
        }

        Movie.count({
            where: where
        }).then(cnt => {
            Movie.findOne({
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
            }).then(movie => {
                res.send(movie);
            });
        });
    }
});

function rand(min = 0, max = 0x7FFFFFFF): number {
    const diff = max - min;
    const bytes = randomBytes(4).readInt32LE(0);
    const fp = (bytes & 0x7FFFFFFF) / 2147483647.0;
    return Math.round(fp * diff) + min;
}