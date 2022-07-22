import { UserService } from '../services/user.service';
import { User } from '../entity/user';
import { FastifyInstance, FastifyRequest } from 'fastify';
import * as bcrypt from 'bcryptjs';
import { configuration } from '../configuration';

async function routes(fastify: FastifyInstance) {

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
        return userService.register(<User>req.body);
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
        const reqUser = <User>req.body
        const user = await userService.getByEmail(reqUser.email);
        if (user !== null) {
            const valid = await bcrypt.compare(reqUser.password, user.password);
            if (valid) {
                return userService.login(reqUser);
            }
        }
        res.status(422).send({ 'statusCode': 422, 'error': 'Bad Request', 'message': 'invalid email or password' });
    });

    fastify.get('/user/:id', { preValidation: [fastify.authenticate] }, async (req: FastifyRequest<{ Params: { id: number } }>, res) => {
        if (req.user && req.user.id === req.params.id) {
            const user = await userService.getById(req.user.id);

            if (user === null) {
                res.send(new Error('UNKNOWN_USER'));
                return;
            }
            
            res.send(user);
        } else {
            res.send(new Error('BAD_USER_ID'));
        }
    });

    fastify.put('/user/:id', { preValidation: [fastify.authenticate] }, async (req: FastifyRequest<{ Params: { id: number } }>, res) => {
        if (req.user && req.user.id === req.params.id) {
            const user = await userService.getById(req.user.id);

            if (user === null) {
                res.send(new Error('UNKNOWN_USER'));
                return;
            }

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
    }, async (req: FastifyRequest<{ Params: { id: number }, Body: { oldPassword: string, newPassword: string } }>, res) => {
        if (req.user && req.user.id === req.params.id) {
            const user = await userService.getById(req.user.id);

            if (user === null) {
                res.send(new Error('UNKNOWN_USER'));
                return;
            }

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

    fastify.delete('/user/:id', { preValidation: [fastify.authenticate] }, async (req: FastifyRequest<{ Params: { id: number } }>, res) => {
        if (req.user && req.user.id === req.params.id) {
            const user = await userService.getById(req.user.id);
            
            if (user === null) {
                res.send(new Error('UNKNOWN_USER'));
                return;
            }

            return user.remove();
        } else {
            res.send(new Error('BAD_USER_ID'));
        }
    });
}

export const userRouter = routes;
