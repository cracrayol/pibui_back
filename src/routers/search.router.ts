import { connection } from '../app';
import { Movie } from '../entity/movie';
import { FastifyInstance } from 'fastify';

async function routes(fastify: FastifyInstance, options) {

    fastify.get('/:search', (req, res) => {

        connection.createQueryBuilder(Movie, 'movie')
            .leftJoinAndSelect('movie.author', 'author')
            .where('movie.valid = 1 AND (MATCH(title) AGAINST(:search IN NATURAL LANGUAGE MODE) OR MATCH(name) AGAINST(:search IN NATURAL LANGUAGE MODE))',
                { search: req.params.search })
            .getMany().then(result => {
                res.send(result.sort((a, b) => {
                    return a.title.localeCompare(b.title);
                }));
            });
    });
}

export const searchRouter = routes;
