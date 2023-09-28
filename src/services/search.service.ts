import { connection } from '../app';
import { Movie } from '../entity/movie';

export class SearchService {

    async search(search: string) {
        return connection.createQueryBuilder(Movie, 'movie')
            .leftJoinAndSelect('movie.author', 'author')
            .where('movie.valid = 1 AND (MATCH(title) AGAINST(:search IN NATURAL LANGUAGE MODE) OR MATCH(name) AGAINST(:search IN NATURAL LANGUAGE MODE))',
                { search })
            .orderBy('movie.title')
            .getMany();
    }

}
