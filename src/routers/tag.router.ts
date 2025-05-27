import { FastifyInstance } from 'fastify';
import { TagController } from '../controllers/tag.controller';

async function routes(fastify: FastifyInstance) {

    const tagController = new TagController();

    fastify.get('/', { preValidation: [fastify.authenticateNoError] }, tagController.get);

    fastify.post('/', { preValidation: [fastify.authenticate, fastify.isAdmin] }, tagController.create);

    fastify.put('/:id', { preValidation: [fastify.authenticate, fastify.isAdmin] }, tagController.update);

    fastify.delete('/:id', { preValidation: [fastify.authenticate, fastify.isAdmin] }, tagController.delete);
}

export const tagRouter = routes;
