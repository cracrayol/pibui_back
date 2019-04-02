import { connection } from '../app';
import { Movie } from '../entity/movie';
import { FastifyInstance } from 'fastify';

async function routes(fastify: FastifyInstance, options) {

    fastify.get('/:search', (req, res) => {
        const searchList: string[] = req.params.search.split(' ');
        const searchQueries: Promise<Movie[]>[] = [];
        searchList.forEach(value => {
            if (value.length < 4) {
                // no search if word if below 4 characters
                return;
            }
            searchQueries.push(
                connection.createQueryBuilder(Movie, 'movie')
                    .leftJoinAndSelect('movie.author', 'author')
                    .where('movie.valid = 1 AND movie.hidden = 0 AND (movie.title LIKE :search OR author.name LIKE :search)',
                        { search: '%' + value + '%' })
                    .getMany());
        });

        const movieList: Set<Movie> = new Set<Movie>();
        Promise.all(searchQueries).then(result => {
            result.forEach(resultQuery => {
                resultQuery.forEach(movie => movieList.add(movie));
            });
            const movies = Array.from(movieList);
            res.send(movies.sort((a, b) => {
                return a.title.localeCompare(b.title);
            }));
        });
    });
}

export const searchRouter = routes;
