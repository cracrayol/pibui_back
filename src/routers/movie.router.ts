import { Router, Request, Response } from 'express';
import { MovieService } from '../services/movie.service';
import { PlaylistService } from '../services/playlist.service';
import { UserService } from '../services/user.service';
import { randomBytes } from 'crypto';
import * as jwt from 'express-jwt';
import { connection } from '../app';
import { Movie } from '../entity/movie';
import { Playlist } from '../entity/playlist';
import { configuration } from '../configuration';
import { User } from '../entity/user';

export const movieRouter = Router();

const movieService = new MovieService();
const userService = new UserService();
const playlistService = new PlaylistService();

movieRouter.get('/latest', (req: Request, res: Response) => {
    movieService.getAll(30).then(movies => res.json(movies));
});

movieRouter.get('/:id', jwt({ secret: configuration.jwt.secret, credentialsRequired: false }), (req: Request, res: Response) => {
    if (req.params.id && req.params.id > 0) {
        // Get a specific movie
        movieService.getById(req.params.id).then(movie => {
            movieService.checkVideoState(movie).then(_ => {
                // movie seems OK => send it
                if (!req.session.playedMovies) {
                    req.session.playedMovies = [];
                }
                req.session.playedMovies.push(movie.id);
                res.json(movie);
            }).catch(_ => {
                // Increment error count and return a random movie
                movie.errorCount++;
                movie.save();

                getRandomMovie(req).then(newMovie => res.json(newMovie));
            });
        });
    } else {
        // return a random movie
        getRandomMovie(req).then(movie => res.json(movie));
    }
});

/**
 * Return a random movie based on parameters in the requesr
 * @param req The request
 */
function getRandomMovie(req: Request) {
    return new Promise(function (resolve) {
        let query = 'movie.valid = 1 AND movie.hidden = false AND movie.errorCount < 5';

        // Filter movies to exclude already viewed movies
        const idFilter = [];
        if (req.session.playedMovies) {
            idFilter.push(req.session.playedMovies);
        }
        if (idFilter.length > 0) {
            query += ' AND movie.id NOT IN :idFilter';
        }

        if (req.user) {
            // If user connected, search based on the selected playlist
            userService.getById(req.user.id).then(user => {
                playlistService.getById(user.currentPlaylistId).then(playlist => {
                    if (playlist) {
                        // If user has a playlist selected, complete the query
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

                    getMovie(query, idFilter, req.session).then(movie => resolve(movie));
                });
            });
        } else {
            getMovie(query, idFilter, req.session).then(movie => resolve(movie));
        }
    });
}

/**
 * Return a movie based on the given query and update session
 * @param query The query to execute
 * @param idFilter Content of the idFilter query parameter
 * @param session The session
 */
function getMovie(query: String, idFilter: number[], session) {
    return new Promise(function (resolve) {
        connection.createQueryBuilder(Movie, 'movie').select('COUNT(*)', 'count')
            .where(query, { idFilter })
            .getRawOne().then((result: { count: number }) => connection.createQueryBuilder(Movie, 'movie')
                .where(query, { idFilter })
                .offset(rand(0, result.count) - 1)
                .orderBy('movie.id', 'ASC')
                .limit(1)
                .getOne().then((movieId: { id: number }) =>
                    movieService.getById(movieId.id).then(movie => {
                        movieService.checkVideoState(movie).then(_ => {
                            if (!session.playedMovies) {
                                session.playedMovies = [];
                            }
                            session.playedMovies.push(movie.id);
                            resolve(movie);
                        }).catch(_ => {
                            movie.errorCount++;
                            movie.save();

                            getMovie(query, idFilter, session).then(newMovie => resolve(newMovie));
                        });
                    })
                )
            );
    });
}

/**
 * Return a random integer between min and max
 * @param min The possbile min value
 * @param max The possbile max value
 */
function rand(min = 0, max = 0x7FFFFFFF): number {
    const diff = max - min;
    const bytes = randomBytes(4).readInt32LE(0);
    const fp = (bytes & 0x7FFFFFFF) / 2147483647.0;
    return Math.round(fp * diff) + min;
}
