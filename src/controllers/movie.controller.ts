import { FastifyReply, FastifyRequest, Session } from 'fastify';
import { MovieService } from '../services/movie.service';
import { Movie } from '../entity/movie';
import { PlaylistService } from '../services/playlist.service';

export class MovieController {

    movieService = new MovieService();
    playlistService = new PlaylistService();

    getList = async (req:FastifyRequest<{Querystring:{start:number,take:number, sort?: string, order?: 'DESC'|'ASC', all?: boolean}}>) => {
        return await this.movieService.get(req.query.start, req.query.take, req.query.sort, req.query.order, req.query.all);
    };

    getLatest = async () => {
        return await this.movieService.get(0, 30);
    };

    get = async (req:FastifyRequest<{Params:{id:number}}>, res: FastifyReply) => {
        if (req.params.id && req.params.id > 0) {
            // Get a specific movie
            const movie = await this.movieService.getById(req.params.id);

            if (movie === null) {
                res.send(new Error('BAD_MOVIE_ID'));
                return;
            }

            //try {
                //await movieService.checkVideoState(movie);
                // movie seems OK => send it
                if (!req.session.playedMovies) {
                    req.session.playedMovies = [];
                }
                req.session.playedMovies.push(movie.id);
                res.send(movie);
            /*} catch (e) {
                // Increment error count and return a random movie
                movie.errorCount++;
                movie.save();

                return await getRandomMovie(req, res);
            }*/
        } else {
            // return a random movie
            const movie = await this.getRandomMovie(req);

            if (movie === null) {
                res.send(new Error('BAD_MOVIE_ID'));
                return;
            }

            return movie;
        }
    }

    create = async (req:FastifyRequest<{Params:{id:number}}>) => {
        const movie = new Movie();
        const movieRequest = <Movie>req.body;

        if(movieRequest.author.id == null) {
            // TODO Author creation
        }

        movie.title = movieRequest.title;
        movie.subtitle = movieRequest.subtitle;
        movie.linkId = movieRequest.linkId;
        movie.valid = movieRequest.valid;
        movie.author = movieRequest.author;
        
        movie.errorCount = 0;
        movie.user = req.user;

        if(movie.valid) {
            movie.validDate = new Date();
        }

        return await movie.save();
    }

    update = async (req:FastifyRequest<{Params:{id:number}}>) => {
        const movie = await this.movieService.getById(req.params.id);

        if (!movie) {
            return new Error('BAD_MOVIE_ID');
        }

        const movieRequest = <Movie>req.body;
        
        if(!movie.valid && movieRequest.valid) {
            movie.validDate = new Date();
        }

        movie.title = movieRequest.title;
        movie.subtitle = movieRequest.subtitle;
        movie.linkId = movieRequest.linkId;
        movie.valid = movieRequest.valid;
        movie.author = movieRequest.author;

        return await movie.save();
    }

    delete = async (req:FastifyRequest<{Params:{id:number}}>) => {
        const movie = await this.movieService.getById(req.params.id);

        if (!movie) {
            return new Error('BAD_MOVIE_ID');
        }
        
        return await movie.remove();
    }

    /**
     * Return a random movie based on parameters in the request
     * @param req The request
     */
    private async getRandomMovie(req: FastifyRequest) {
        let query = 'movie.valid = 1 AND movie.errorCount < 5';

        // Filter movies to exclude already viewed movies
        const idFilter:number[] = [];
        if (req.session.playedMovies) {
            idFilter.concat(req.session.playedMovies);
        }
        if (idFilter.length > 0) {
            // TODO Better management (subrequest ?)
            query += ' AND movie.id NOT IN :idFilter';
        }

        if (req.user) {
            const playlist = await this.playlistService.getById(req.user.currentPlaylistId);
            if (playlist) {
                // If user has a playlist selected, complete the query
                if (playlist.forbiddenTags && playlist.forbiddenTags.length > 0) {
                    const tags: number[] = [];
                    playlist.forbiddenTags.forEach(tag => {
                        tags.push(tag.id);
                    });
                    query += ' AND movie.id NOT IN (SELECT movieId FROM movie_tag WHERE tagId IN (' + tags.join(',') + '))';
                }
                if (playlist.allowedTags && playlist.allowedTags.length > 0) {
                    const tags: number[] = [];
                    playlist.allowedTags.forEach(tag => {
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
        return await this.getMovie(query, idFilter, req.session);
    }

    /**
     * Return a movie based on the given query and update session
     * @param query The query to execute
     * @param idFilter Content of the idFilter query parameter
     * @param session The session
     */
    private async getMovie(query: string, idFilter: number[], session: Session) {
        const movie = await this.movieService.getRandomFiltered(query, idFilter);

        if(movie === null) {
            return null;
        }

        //try {
            //await movieService.checkVideoState(movie);
            if (!session.playedMovies) {
                session.playedMovies = [];
            }
            session.playedMovies.push(movie.id);
            return movie;
        /*} catch (exception) {
            movie.errorCount++;
            movie.save();

            return await getMovie(query, idFilter, session);
        }*/
    }

}
