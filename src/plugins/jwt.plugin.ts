import { FastifyInstance } from 'fastify';
import * as fp from 'fastify-plugin';
import * as jwt from 'fastify-jwt';
import { configuration } from '../configuration';

async function plugin(fastify: FastifyInstance, options, next) {

    fastify.register(jwt, configuration.jwt);

    fastify.decorate('authenticate', async function (request, reply) {
        try {
            await request.jwtVerify();
        } catch (err) {
            reply.send(err);
        }
    });

    fastify.decorate('authenticateNoError', async function (request, reply) {
        try {
            await request.jwtVerify();
        } catch (err) {
        }
    });
}

export const jwtPlugin = fp(plugin);
