import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { FastifyRequest } from 'fastify';
import { UserService } from '../services/user.service';
import { User } from '../entity/user';
import { configuration } from '../config/configuration';

export class UserController {

    userService = new UserService();

    create = async (req:FastifyRequest<{Body:User}>) => {
        const user = new User();
        user.email = req.body.email;
        user.password = await bcrypt.hash(req.body.password, configuration.jwt.saltRounds);
        user.isAdmin = false;
        return user.save();
    }

    update = async (req:FastifyRequest<{Params:{id: string}, Body:User}>) => {
        if (req.user && req.user.id === parseInt(req.params.id)) {
            const user = await this.userService.getById(req.user.id);

            if (user === null) {
                return new Error('UNKNOWN_USER');
            }

            if(req.body.currentPlaylistId != null) {
                user.currentPlaylistId = req.body.currentPlaylistId;
            }

            if(req.body.oldPassword != null && req.body.password != null) {
                if (await bcrypt.compare(req.body.oldPassword, user.password)) {
                    user.password = await bcrypt.hash(req.body.password, configuration.jwt.saltRounds);
                } else {
                    return new Error('BAD_USER_PASSWORD');
                }
            }

            return await user.save();
        } else {
            return new Error('NOT_ALLOWED');
        }
    }

    login = async (req:FastifyRequest<{Body:User}>) => {
        const user = await this.userService.getByEmail(req.body.email);
        if (user !== null) {
            const valid = await bcrypt.compare(req.body.password, user.password);
            if (valid) {
                return {
                    token: jwt.sign({ id: user.id, email: user.email }, configuration.jwt.secret, { expiresIn: configuration.session.maxAge }),
                    expiresIn: configuration.session.maxAge,
                    user: { id: user.id, email: user.email, currentPlaylistId: user.currentPlaylistId, isAdmin: user.isAdmin }
                };
            }
        }
        return new Error('UNKNOWN_USER');
    }

    delete = async (req:FastifyRequest<{Params:{id:number}}>) => {
        if (req.user && req.user.id === req.params.id) {
            const user = await this.userService.getById(req.user.id);
            
            if (user === null) {
                return new Error('UNKNOWN_USER');
            }

            return user.softRemove();
        } else {
            return new Error('NOT_ALLOWED');
        }
    }

}
