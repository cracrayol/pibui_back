import { FastifyInstance } from 'fastify';
import { UserController } from '../controllers/user.controller';

async function routes(fastify: FastifyInstance) {

    const userController = new UserController();

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
                        minLength: 4
                    }
                }
            }
        }
    }, userController.create);

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
                        minLength: 4
                    }
                }
            }
        }
    }, userController.login);

    /*fastify.get('/user/:id', { preValidation: [fastify.authenticate] }, async (req: FastifyRequest<{ Params: { id: number } }>, res) => {
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
    });*/

    fastify.put('/user/:id', { preValidation: [fastify.authenticate] }, userController.update);

    fastify.delete('/user/:id', { preValidation: [fastify.authenticate] }, userController.delete);
}

export const userRouter = routes;
