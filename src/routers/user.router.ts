import { UserService } from '../services/user.service';
import { User } from '../entity/user';
import { FastifyInstance } from 'fastify';
import * as bcrypt from 'bcryptjs';

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
            res.status(422).send({'statusCode': 422, 'error': 'Bad Request', 'message': 'invalid email or password'});
    });

    fastify.get('/user/:id', (req, res) => {
        if (req.user && parseInt(req.user.id, 10) === parseInt(req.params.id, 10)) {
            userService.getById(req.user.id).then(user => {
                res.send(user);
            });
        } else {
            res.send([]);
        }
    });

    fastify.put('/user/:id', async(req, res) => {
        if (req.user && parseInt(req.user.id, 10) === parseInt(req.params.id, 10)) {
            const user = await userService.getById(req.user.id);

            const userRequest = <User>req.body;
            user.currentPlaylistId = userRequest.currentPlaylistId;

            await user.save();
            res.send(user);
        } else {
            res.send([]);
        }
    });

    fastify.delete('/user/:id', async (req, res) => {
        if (req.user && parseInt(req.user.id, 10) === parseInt(req.params.id, 10)) {
            const user = await userService.getById(req.user.id);
            return user.remove();
        } else {
            res.send([]);
        }
    });
}

export const userRouter = routes;
