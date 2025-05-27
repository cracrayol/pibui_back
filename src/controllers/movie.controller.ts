import { FastifyReply, FastifyRequest, Session } from 'fastify';
import { MovieService } from '../services/movie.service';
import { Movie } from '../entity/movie';
import { PlaylistService } from '../services/playlist.service';
import { TagService } from '../services/tag.service';
import { Tag } from '../entity/tag';
import { Author } from '../entity/author';

export class MovieController {

    movieService = new MovieService();
    playlistService = new PlaylistService();
    tagService = new TagService();

    getList = async (req: FastifyRequest<{ Querystring: { filter: string, start: number, take: number, sort?: string, order?: 'DESC' | 'ASC' } }>) => {
        return await this.movieService.get(req.query.filter, req.query.start, req.query.take, req.query.sort, req.query.order);
    };

    get = async (req: FastifyRequest<{ Params: { id: number }, Querystring: {lastOnError: string} }>, res: FastifyReply) => {
        if (!req.session.playedMovies) {
            req.session.playedMovies = [];
        } else if(req.session.playedMovies.length >= 500) {
            req.session.playedMovies.splice(0,1);
        }

        if(req.query.lastOnError === 'true' && req.session.playedMovies.length > 0) {
            const movie = await this.movieService.getById(req.session.playedMovies.pop());
            movie.errorCount++;
            if(movie.errorCount >= 5) {
                await movie.softRemove();
            } else {
                await movie.save();
            }
        }

        if (req.params.id && req.params.id > 0) {
            // Get a specific movie
            const movie = await this.movieService.getById(req.params.id);

            if (movie === null) {
                res.send(new Error('BAD_MOVIE_ID'));
                return;
            }
            
            req.session.playedMovies.push(movie.id);
            return movie;
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

    create = async (req: FastifyRequest<{Body: Movie}>) => {
        if (!req.user.isAdmin) {
            return new Error('NOT_ALLOWED');
        }

        const movie = new Movie();
        movie.title = req.body.title;
        movie.subtitle = req.body.subtitle;
        movie.linkId = req.body.linkId;

        if (req.body.author.id == null) {
            const author = new Author();
            author.name = req.body.author.name;
            author.subname = '';
            movie.author = await author.save();
        } else {
            movie.author = req.body.author;
        }

        movie.tags = [];
        for (let tag of req.body.tags) {
            if (tag.id == null) {
                const newTag = new Tag();
                newTag.name = tag.name;

                tag = await newTag.save();
            }
            movie.tags.push(tag);
        }

        movie.errorCount = 0;
        movie.user = req.user;

        return await movie.save();
    }

    update = async (req: FastifyRequest<{ Params: { id: number } }>) => {
        if (!req.user.isAdmin) {
            return new Error('NOT_ALLOWED');
        }

        const movie = await this.movieService.getById(req.params.id);

        if (!movie) {
            return new Error('BAD_MOVIE_ID');
        }

        const movieRequest = <Movie>req.body;

        movie.title = movieRequest.title;
        movie.subtitle = movieRequest.subtitle;
        movie.linkId = movieRequest.linkId;
        movie.author = movieRequest.author;

        movie.tags = [];
        for (let tag of movieRequest.tags) {
            if (tag.id == null) {
                const newTag = new Tag();
                newTag.name = tag.name;
                tag = await newTag.save();
            }
            movie.tags.push(tag);
        }

        return await movie.save();
    }

    delete = async (req: FastifyRequest<{ Params: { id: number } }>) => {
        if (!req.user.isAdmin) {
            return new Error('NOT_ALLOWED');
        }

        const movie = await this.movieService.getById(req.params.id);

        if (!movie) {
            return new Error('BAD_MOVIE_ID');
        }

        return await movie.softRemove();
    }

    searchTags = async (req: FastifyRequest<{ Params: { name: string } }>) => {
        return await this.tagService.getByNameLike(req.params.name != null ? req.params.name : '');
    }

    /**
     * Return a random movie based on parameters in the request
     * @param req The request
     */
    private async getRandomMovie(req: FastifyRequest) {
        let conditions:string[] = [];

        // Filter movies to exclude already viewed movies
        const idFilter: number[] = [];
        if (req.session.playedMovies) {
            idFilter.concat(req.session.playedMovies);
        }
        if (idFilter.length > 0) {
            conditions.push('movie.id NOT IN :idFilter');
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
                    conditions.push('movie.id NOT IN (SELECT movieId FROM movie_tag WHERE tagId IN (' + tags.join(',') + '))');
                }
                if (playlist.allowedTags && playlist.allowedTags.length > 0) {
                    const tags: number[] = [];
                    playlist.allowedTags.forEach(tag => {
                        tags.push(tag.id);
                    });
                    conditions.push('movie.id IN (SELECT movieId FROM movie_tag WHERE tagId IN (' + tags.join(',') + '))');
                }
                if (playlist.mandatoryTags && playlist.mandatoryTags.length > 0) {
                    playlist.mandatoryTags.forEach(tag => {
                        conditions.push('EXISTS (SELECT * FROM movie_tag WHERE tagId = ' + tag.id + ' AND movieId = movie.id)');
                    });
                }
            }
        }

        let movie = await this.movieService.getRandomFiltered(conditions.join(' AND '), idFilter);

        if (movie === null) {
            req.session.playedMovies = [];
            movie = await this.movieService.getRandomFiltered(conditions.join(' AND '), []);
        }

        req.session.playedMovies.push(movie.id);
        return movie;
    }

}
