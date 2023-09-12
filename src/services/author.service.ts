import { connection } from '../app';
import { Author } from '../entity/author';

export class AuthorService {

    /**
     * Get an author from his internal ID.
     * @param id Author's id
     * @returns A promise
     */
    getById(id: number) {
        return connection.createQueryBuilder(Author, 'author')
            .where('author.id = :id', { id })
            .getOne();
    }

    /**
     * Return all the movies, ordered by validation date
     * @param limit Limit the number of results
     * @returns A promise
     */
    get(start: number, limit: number, sort?: string, order?:'ASC'|'DESC') {
         let builder = connection.createQueryBuilder(Author, 'author')
            .skip(start)
            .take(limit);

        if(sort !== undefined && sort !== null && sort.trim() != ''
             && order !== undefined && order !== null && order.trim() != '') {
            builder = builder.orderBy(sort, order);
        }            

        return builder.getMany();
    }
}
