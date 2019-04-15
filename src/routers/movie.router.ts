import { FastifyInstance } from 'fastify';
import { randomBytes } from 'crypto';

import { connection } from '../app';

import { MovieService } from '../services/movie.service';
import { PlaylistService } from '../services/playlist.service';
import { UserService } from '../services/user.service';

import { Movie } from '../entity/movie';

async function routes(fastify: FastifyInstance, options) {

    const movieService = new MovieService();
    const userService = new UserService();
    const playlistService = new PlaylistService();

    fastify.get('/latest', async (req, res) => {
        return await movieService.getAll(30);
    });

    fastify.get('/:id', async (req, res) => {
        if (req.params.id && req.params.id > 0) {
            // Get a specific movie
            const movie = await movieService.getById(req.params.id);
            try {
                await movieService.checkVideoState(movie);
                // movie seems OK => send it
                if (!req.session.playedMovies) {
                    req.session.playedMovies = [];
                }
                req.session.playedMovies.push(movie.id);
                res.send(movie);
            } catch (e) {
                // Increment error count and return a random movie
                movie.errorCount++;
                movie.save();

                return await getRandomMovie(req);
            }
        } else {
            // return a random movie
            return await getRandomMovie(req);
        }
    });

    /**
     * Return a random movie based on parameters in the request
     * @param req The request
     */
    async function getRandomMovie(req) {
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
            const user = await userService.getById(req.user.id);
            const playlist = await playlistService.getById(user.currentPlaylistId);
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
        }
        return await getMovie(query, idFilter, req.session);
    }

    /**
     * Return a movie based on the given query and update session
     * @param query The query to execute
     * @param idFilter Content of the idFilter query parameter
     * @param session The session
     */
    async function getMovie(query: String, idFilter: number[], session) {
        const result = await connection.createQueryBuilder(Movie, 'movie').select('COUNT(*)', 'count')
            .where(query, { idFilter })
            .getRawOne();
        const movieId = await connection.createQueryBuilder(Movie, 'movie')
                .where(query, { idFilter })
                .offset(rand(0, result.count) - 1)
                .orderBy('movie.id', 'ASC')
                .limit(1)
                .getOne();
        const movie = await movieService.getById(movieId.id);
        try {
            await movieService.checkVideoState(movie);
            if (!session.playedMovies) {
                session.playedMovies = [];
            }
            session.playedMovies.push(movie.id);
            return movie;
        } catch (exception) {
            movie.errorCount++;
            movie.save();

            return await getMovie(query, idFilter, session);
        }
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
}

export const movieRouter = routes;
