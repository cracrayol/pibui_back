import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import { UserService } from '../services/user.service';

async function plugin(fastify: FastifyInstance) {

    const userService = new UserService();

    fastify.decorate('authenticate', async function (request: FastifyRequest, reply: FastifyReply) {
        try {
            await request.jwtVerify();
            const user = await userService.getById(request.user.id);

            if (!user) {
                throw new Error('BAD_USER_ID');
            }

            request.user = user;
        } catch (err) {
            reply.send(err);
        }
    });

    fastify.decorate('authenticateNoError', async function (request: FastifyRequest) {
        try {
            await request.jwtVerify();
            const user = await userService.getById(request.user.id);

            if (!user) {
                throw new Error('BAD_USER_ID');
            }

            request.user = user;
        } catch (err) {
        }
    });

    fastify.decorate('isAdmin', async function (request: FastifyRequest, reply: FastifyReply) {
        if (!request.user.isAdmin) {
            reply.send(new Error('NOT_ALLOWED'));
        }
    });
}

export const authPlugin = fastifyPlugin(plugin);
