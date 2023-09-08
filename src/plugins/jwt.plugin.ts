import { FastifyInstance, FastifyRegister, FastifyReply, FastifyRequest } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import fastifyJwt from '@fastify/jwt';
import { configuration } from '../config/configuration';

async function plugin(fastify: FastifyInstance) {

    fastify.register(fastifyJwt, configuration.jwt);

    fastify.decorate('authenticate', async function (request: FastifyRequest, reply: FastifyReply) {
        try {
            await request.jwtVerify();
        } catch (err) {
            reply.send(err);
        }
    });

    fastify.decorate('authenticateNoError', async function (request: FastifyRequest) {
        try {
            await request.jwtVerify();
        } catch (err) {
        }
    });
}

export const jwtPlugin = fastifyPlugin(plugin);
