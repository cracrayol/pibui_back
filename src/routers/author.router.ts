import { FastifyInstance } from 'fastify';
import { AuthorController } from '../controllers/author.controller';

async function routes(fastify: FastifyInstance) {

    const authorController = new AuthorController();

    fastify.get('/', { preValidation: [fastify.authenticateNoError] }, authorController.get);

    fastify.post('/', { preValidation: [fastify.authenticate, fastify.isAdmin] }, authorController.create);

    fastify.put('/:id', { preValidation: [fastify.authenticate, fastify.isAdmin] }, authorController.update);

    fastify.delete('/:id', { preValidation: [fastify.authenticate, fastify.isAdmin] }, authorController.delete);
}

export const authorRouter = routes;
