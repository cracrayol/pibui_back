import { connection } from '../app';
import { User } from '../entity/user';

export class UserService {

    /**
     * Get a user from his internal ID.
     * @param id User's ID
     * @returns A promise
     */
    getById(id: number) {
        return connection.createQueryBuilder(User, 'user')
            .where('user.id = :id', { id })
            .getOne();
    }

    /**
     * Get a user from his email.
     * @param email User's email
     * @returns A promise
     */
    getByEmail(email: string) {
        return connection.createQueryBuilder(User, 'user')
            .where('user.email = :email', { email })
            .getOne();
    }
}
