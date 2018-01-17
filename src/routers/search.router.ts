import { Op } from 'sequelize';
import { Router, Request, Response } from 'express';
import { Movie, MovieModel } from '../models/movie';
import { sequelize } from '../instances/sequelize';
import { Author } from '../models/author';
import { Tag } from '../models/tag';
import { randomBytes } from 'crypto';
import * as Promise from 'bluebird';

export const searchRouter = Router();

searchRouter.get('/:search', (req: Request, res: Response) => {
    const searchList: string[] = req.params.search.split(' ');
    const searchQueries: Promise<MovieModel[]>[] = [];
    searchList.forEach(value => {
        if (value.length < 4) {
            // no search if word if below 4 characters
            return;
        }
        searchQueries.push(Movie.findAll({
            where: {
                title: {
                    [Op.like]: '%' + value + '%'
                },
                valid: true,
                hidden: false
            },
            include: [Author]
        }));
        searchQueries.push(Movie.findAll({
            where: {
                valid: true,
                hidden: false
            },
            include: [{
                model: Author,
                where: {
                    name: {
                        [Op.like]: '%' + value + '%'
                    }
                },
            }]
        }));
    });

    const movieList: Set<MovieModel> = new Set<MovieModel>();
    Promise.all(searchQueries).then(result => {
        result.forEach(resultQuery => {
            resultQuery.forEach(movie => movieList.add(movie));
        });
        const movies = [...movieList];
        res.send(movies.sort((a, b) => {
            return a.title.localeCompare(b.title);
        }));
    });
});
