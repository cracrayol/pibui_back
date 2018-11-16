import { Router, Request, Response } from 'express';
import { MovieService } from '../services/movie.service';
import { randomBytes } from 'crypto';
import * as jwt from 'express-jwt';
import { connection } from '../app';
import { Movie } from '../entity/movie';
import { Playlist } from '../entity/playlist';
import { configuration } from '../configuration';
import { User } from '../entity/user';
import { UserService } from '../services/user.service';

export const movieRouter = Router();

const movieService = new MovieService();
const userService = new UserService();

movieRouter.get('/latest', (req: Request, res: Response) => {
    movieService.getAll(30).then(movies => res.json(movies));
});

movieRouter.get('/:id', jwt({ secret: configuration.jwt.secret, credentialsRequired: false }), (req: Request, res: Response) => {
    if (req.params.id && req.params.id > 0) {
        movieService.getById(req.params.id).then(movie => res.json(movie));
    } else {
        const idFilter = [];
        if (req.session.playedMovies) {
            idFilter.push(req.session.playedMovies);
        }

        let query = 'movie.valid = 1 AND movie.hidden = false AND movie.errorCount < 5';
        if (idFilter.length > 0) {
            query += ' AND movie.id NOT IN :idFilter';
        }

        console.log(req.user);
        if (req.user) {
            userService.getById(req.user.id).then(user => {
                connection.createQueryBuilder(Playlist, 'playlist').select()
                    .where('playlist.id = ' + user.currentPlaylistId)
                    .leftJoinAndSelect('playlist.forbiddenTags', 'forbiddenTags')
                    .leftJoinAndSelect('playlist.mandatoryTags', 'mandatoryTags')
                    .leftJoinAndSelect('playlist.allowedTags', 'allowedTags').getOne().then(playlist => {
                        if (playlist) {
                            if (playlist.forbiddenTags && playlist.forbiddenTags.length > 0) {
                                const tags = [];
                                playlist.forbiddenTags.forEach(tag => {
                                    tags.push(tag.id);
                                });
                                query += ' AND movie.id NOT IN (SELECT movieId FROM movie_tag WHERE tagId IN (' + tags.join(',') + '))';
                            }
                            if (playlist.allowedTags && playlist.allowedTags.length > 0) {
                                const tags = [];
                                playlist.forbiddenTags.forEach(tag => {
                                    tags.push(tag.id);
                                });
                                query += ' AND id IN (SELECT movieId FROM movie_tag WHERE tagId IN (' + tags.join(',') + '))';
                            }
                            if (playlist.mandatoryTags && playlist.mandatoryTags.length > 0) {
                                playlist.mandatoryTags.forEach(tag => {
                                    query += ' AND EXISTS (SELECT * FROM movie_tag WHERE tagId = ' + tag.id + ' AND movieId = movie.id)';
                                });
                            }
                        }

                        getMovie(query, idFilter, req, res);
                    });
            });
        } else {
            getMovie(query, idFilter, req, res);
        }


    }
});

function getMovie(query: String, idFilter: number[], req: Request, res: Response) {
    connection.createQueryBuilder(Movie, 'movie').select('COUNT(*)', 'count')
        .where(query, { idFilter })
        .getRawOne().then((result: { count: number }) => connection.createQueryBuilder(Movie, 'movie')
            .where(query, { idFilter })
            .offset(rand(0, result.count) - 1)
            .orderBy('movie.id', 'ASC')
            .limit(1)
            .getOne().then((movieId: { id: number }) =>
                movieService.getById(movieId.id).then(movie => {
                    if (!req.session.playedMovies) {
                        req.session.playedMovies = [];
                    }
                    req.session.playedMovies.push(movie.id);
                    res.json(movie);
                })
            )
        );
}

function rand(min = 0, max = 0x7FFFFFFF): number {
    const diff = max - min;
    const bytes = randomBytes(4).readInt32LE(0);
    const fp = (bytes & 0x7FFFFFFF) / 2147483647.0;
    return Math.round(fp * diff) + min;
}
