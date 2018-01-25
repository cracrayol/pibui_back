import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { connection } from '../index';
import { User } from '../entity/user';
import { configuration } from '../configuration';

export class UserService {
    private readonly _saltRounds = 12;
    private readonly _jwtSecret = '0.rfyj3n9nzh';

    register({ email, password }: User) {
        return bcrypt.hash(password, this._saltRounds)
            .then(hash => {
                return connection.createQueryBuilder()
                    .insert().into(User)
                    .values([{ email, password: hash }])
                    .execute();
            });
    }

    login({ email }: User) {
        return connection.createQueryBuilder(User, 'user')
            .where('user.email = :email', { email })
            .getOne().then(u => {
                const { id, email } = u!;
                return {
                    token: jwt.sign({ id, email }, this._jwtSecret, { expiresIn: configuration.session.maxAge }),
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
