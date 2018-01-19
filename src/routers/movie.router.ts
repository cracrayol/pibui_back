import { Router, Request, Response } from 'express';
import { Movie } from '../models/movie';
import { sequelize } from '../instances/sequelize';
import { Author } from '../models/author';
import { Tag } from '../models/tag';
import { MovieService } from '../services/movie.service';
import { randomBytes } from 'crypto';
import { Op } from 'sequelize';

export const movieRouter = Router();

const movieService = new MovieService();

movieRouter.get('/latest', (req: Request, res: Response) => {
    movieService.getAll(30).then(movies => res.json(movies));
});

movieRouter.get('/:id', (req: Request, res: Response) => {
    if (req.params.id && req.params.id > 0) {
        movieService.getById(req.params.id).then(movie => res.json(movie));
    } else {
        const idFilter = [];
        if (req.session.playedMovies) {
            idFilter.push(req.session.playedMovies);
        }

        return Movie.count({
            where: {
                id: {
                    [Op.notIn]: idFilter
                },
                valid: true,
                hidden: false,
                errorCount: {
                    [sequelize.Op.lt]: 5
                }
            }
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
                if (!req.session.playedMovies) {
                    req.session.playedMovies = [];
                }
                req.session.playedMovies.push(movie.id);
                res.json(movie);
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
