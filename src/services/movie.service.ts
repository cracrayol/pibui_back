import { connection } from '../index';
import { Movie } from '../entity/movie';

export class MovieService {

    getAll(limit?: number) {
        return connection.createQueryBuilder(Movie, 'movie')
            .where('movie.valid = 1 AND movie.hidden = 0 AND movie.errorCount < 5')
            .leftJoinAndSelect('movie.tags', 'tag')
            .leftJoinAndSelect('movie.author', 'author')
            .take(limit)
            .orderBy('movie.validDate', 'DESC')
            .getMany();
    }

    getById(id: number) {
        return connection.createQueryBuilder(Movie, 'movie')
            .where('movie.valid = 1 AND movie.hidden = 0 AND movie.errorCount < 5 AND movie.id = :id', { id })
            .leftJoinAndSelect('movie.tags', 'tag')
            .leftJoinAndSelect('movie.author', 'author')
            .getOne();
    }
}
