import { UserService } from '../services/user.service';
import { User } from '../entity/user';
import { FastifyInstance } from 'fastify';
import * as bcrypt from 'bcryptjs';
import { configuration } from '../configuration';

async function routes(fastify: FastifyInstance, options) {

    const userService = new UserService();

    fastify.post('/register', {
        schema: {
            body: {
                type: 'object',
                required: [
                    'email',
                    'password'
                ],
                properties: {
                    email: {
                        type: 'string',
                        format: 'email'
                    },
                    password: {
                        type: 'string',
                        minLength: 8
                    }
                }
            }
        }
    }, async (req, res) => {
        return userService.register(req.body);
    });

    fastify.post('/login', {
        schema: {
            body: {
                type: 'object',
                required: [
                    'email',
                    'password'
                ],
                properties: {
                    email: {
                        type: 'string',
                        format: 'email'
                    },
                    password: {
                        type: 'string',
                        minLength: 8
                    }
                }
            }
        }
    }, async (req, res) => {
        const user = await userService.getByEmail(req.body.email);
        if (user !== undefined) {
            const valid = await bcrypt.compare(req.body.password, user.password);
            if (valid) {
                return userService.login(req.body);
            }
        }
        res.status(422).send({ 'statusCode': 422, 'error': 'Bad Request', 'message': 'invalid email or password' });
    });

    fastify.get('/user/:id', { preValidation: [fastify.authenticate] }, async (req, res) => {
        if (req.user && parseInt(req.user.id, 10) === parseInt(req.params.id, 10)) {
            const user = await userService.getById(req.user.id);
            res.send(user);
        } else {
            res.send(new Error('BAD_USER_ID'));
        }
    });

    fastify.put('/user/:id', { preValidation: [fastify.authenticate] }, async (req, res) => {
        if (req.user && parseInt(req.user.id, 10) === parseInt(req.params.id, 10)) {
            const user = await userService.getById(req.user.id);

            const userRequest = <User>req.body;
            user.currentPlaylistId = userRequest.currentPlaylistId;

            await user.save();
            res.send(user);
        } else {
            res.send(new Error('BAD_USER_ID'));
        }
    });

    fastify.put('/user/:id/changePassword', {
        preValidation: [fastify.authenticate],
        schema: {
            body: {
                type: 'object',
                required: [
                    'oldPassword',
                    'newPassword'
                ],
                properties: {
                    oldPassword: {
                        type: 'string',
                        minLength: 8
                    },
                    newPassword: {
                        type: 'string',
                        minLength: 8
                    }
                }
            }
        }
    }, async (req, res) => {
        if (req.user && parseInt(req.user.id, 10) === parseInt(req.params.id, 10)) {
            const user = await userService.getById(req.user.id);

            const valid = await bcrypt.compare(req.body.oldPassword, user.password);
            if (valid) {
                user.password = await bcrypt.hash(req.body.newPassword, configuration.jwt.saltRounds);
                await user.save();
                res.send(user);
            } else {
                res.send(new Error('BAD_USER_PASSWORD'));
            }
        } else {
            res.send(new Error('BAD_USER_ID'));
        }
    });

    fastify.delete('/user/:id', { preValidation: [fastify.authenticate] }, async (req, res) => {
        if (req.user && parseInt(req.user.id, 10) === parseInt(req.params.id, 10)) {
            const user = await userService.getById(req.user.id);
            return user.remove();
        } else {
            res.send(new Error('BAD_USER_ID'));
        }
    });
}

export const userRouter = routes;
