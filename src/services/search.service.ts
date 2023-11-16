import { connection } from '../app';
import { Movie } from '../entity/movie';
import { Page } from '../utils/page';

export class SearchService {

    async search(search: string) {
        return new Page(await connection.createQueryBuilder(Movie, 'movie')
            .leftJoinAndSelect('movie.author', 'author')
            .where('movie.valid = 1 AND (MATCH(title) AGAINST(:search IN NATURAL LANGUAGE MODE) OR MATCH(name) AGAINST(:search IN NATURAL LANGUAGE MODE))',
                { search })
            .orderBy('movie.title')
            .getManyAndCount());
    }

}
