import { Router, Request, Response } from 'express';
import { Movie } from '../models/movie';
import { sequelize } from '../instances/sequelize';
import { Author } from '../models/author';
import { Tag } from '../models/tag';
import { MovieService } from '../services/movie.service';

export const movieRouter = Router();

const movieService = new MovieService();

movieRouter.get('/latest', (req: Request, res: Response) => {
    movieService.getAll(30).then(movies => res.json(movies));
});

movieRouter.get('/:id', (req: Request, res: Response) => {
    if (req.params.id && req.params.id > 0) {
        movieService.getById(req.params.id).then(movie => res.json(movie));
    } else {
        movieService.getRandom().then(movie => res.json(movie));
    }
});
