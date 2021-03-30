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
}
