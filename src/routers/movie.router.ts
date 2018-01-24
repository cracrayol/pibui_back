import { Router, Request, Response } from 'express';
import { MovieService } from '../services/movie.service';
import { randomBytes } from 'crypto';
import { connection } from '../index';
import { Movie } from '../entity/movie';

export const movieRouter = Router();

const movieService = new MovieService();

movieRouter.get('/latest', (req: Request, res: Response) => {
    movieService.getAll(30).then(movies => res.json(movies));
});

movieRouter.get('/:id', (req: Request, res: Response) => {
    if (req.params.id && req.params.id > 0) {
    } else {
        const idFilter = [];
        if (req.session.playedMovies) {
            idFilter.push(req.session.playedMovies);
        }

        return connection.createQueryBuilder(Movie, 'movie').select('COUNT(*)', 'count')
            .where('movie.valid = 1 AND movie.hidden = false AND movie.errorCount < 5')
            .getRawOne().then((result: { count: number }) => {
                connection.createQueryBuilder(Movie, 'movie')
                    .where('movie.valid = 1 AND movie.hidden = false AND movie.errorCount < 5')
                    .offset(rand(0, result.count) - 1)
                    .orderBy('movie.id', 'ASC')
                    .limit(1)
                    .getOne().then((movieId: { id: number }) => {
                        movieService.getById(movieId.id).then(movie => {
                            if (!req.session.playedMovies) {
                                req.session.playedMovies = [];
                            }
                            req.session.playedMovies.push(movie.id);
                            res.json(movie);
                        });
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
