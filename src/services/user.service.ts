import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { connection } from '../index';
import { User } from '../entity/user';
import { configuration } from '../configuration';
import { Playlist } from '../entity/playlist';

export class UserService {
    register({ email, password }: User) {
        return bcrypt.hash(password, configuration.jwt.saltRounds)
            .then(hash => {
                const user = new User();
                user.email = email;
                user.password = hash;
                return user.save();
            });
    }

    login({ email }: User) {
        return connection.createQueryBuilder(User, 'user')
            .where('user.email = :email', { email })
            .getOne().then(u => {
                const { id, email } = u!;
                return {
                    token: jwt.sign({ id, email }, configuration.jwt.secret, { expiresIn: configuration.session.maxAge }),
                    expiresIn: configuration.session.maxAge,
                    user: { id, email }
                };
            });
    }

    getById(id: number) {
        return connection.createQueryBuilder(User, 'user')
            .where('user.id = :id', { id })
            .getOne();
    }

    getByEmail(email: string) {
        return connection.createQueryBuilder(User, 'user')
            .where('user.email = :email', { email })
            .getOne();
    }
}
