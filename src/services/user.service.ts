import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { connection } from '../app';
import { User } from '../entity/user';
import { configuration } from '../configuration';
import { Playlist } from '../entity/playlist';

export class UserService {
    /**
     * Create a user account.
     * @param user User object with the email and the password (will be hashed)
     * @returns A promise
     */
    async register({ email, password }: User) {
        const hash = await bcrypt.hash(password, configuration.jwt.saltRounds);

        const user = new User();
        user.email = email;
        user.password = hash;
        user.isAdmin = false;
        return user.save();
    }

    /**
     * create the JWT token for the given user.
     * @param user A user object
     * @returns A promise
     */
    async login({ email }: User) {
        const u = await connection.createQueryBuilder(User, 'user')
            .where('user.email = :email', { email })
            .getOne();
        if(u === null) {
            return null;
        }
        return {
            token: jwt.sign({ id: u.id, email }, configuration.jwt.secret, { expiresIn: configuration.session.maxAge }),
            expiresIn: configuration.session.maxAge,
            user: { id: u.id, email, currentPlaylistId: u.currentPlaylistId, isAdmin: u.isAdmin }
        };
    }

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
