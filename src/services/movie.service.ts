import { connection } from '../app';
import { Movie } from '../entity/movie';
import { Page } from '../utils/page';
import { rand } from '../utils/random';

export class MovieService {

    /**
     * Return all the movies, ordered by validation date
     * @param limit Limit the number of results
     * @returns A promise
     */string
    async get(filter: string, start: number, limit: number, sort?: string, order?:'ASC'|'DESC', notValidated?: string) {
         let builder = connection.createQueryBuilder(Movie, 'movie');

         builder.leftJoinAndSelect('movie.tags', 'tag')
            .leftJoinAndSelect('movie.author', 'author')
            .where('validated = ' + (notValidated === 'true' ? '0' : '1'))
            .skip(start)
            .take(limit);
        
        if(filter != '') {
            builder = builder.andWhere('(MATCH(movie.title) AGAINST(:filter IN BOOLEAN MODE) OR MATCH(author.name) AGAINST(:filter IN BOOLEAN MODE))',
                { filter })
        }

        if(sort !== undefined && sort !== null && sort.trim() != ''
             && order !== undefined && order !== null && order.trim() != '') {
            builder = builder.orderBy(sort, order);
        }            

        return new Page(await builder.getManyAndCount());
    }

    /**
     * Get a movie from his internal ID.
     * @param id Movie's id
     * @returns A promise
     */
    getById(id: number) {
        return connection.createQueryBuilder(Movie, 'movie')
            .where('movie.id = :id', { id })
            .leftJoinAndSelect('movie.tags', 'tag')
            .leftJoinAndSelect('movie.author', 'author')
            .getOne();
    }

    async getRandomFiltered(where: string, filteredIds: number[]) {
        const result = await connection.createQueryBuilder(Movie, 'movie').select('COUNT(*)', 'count')
            .where(where, { filteredIds })
            .getRawOne();

        return await connection.createQueryBuilder(Movie, 'movie')
            .where(where, { filteredIds })
            .leftJoinAndSelect('movie.tags', 'tag')
            .leftJoinAndSelect('movie.author', 'author')
            .take(1)
            .skip(rand(0, result.count) - 1)
            .orderBy('movie.id', 'ASC')
            .getOne();
    }
}
