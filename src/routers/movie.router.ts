import { FastifyInstance } from 'fastify';
import { MovieController } from '../controllers/movie.controller';

async function routes(fastify: FastifyInstance) {

    const movieController = new MovieController();

    fastify.get('/', movieController.getList);

    fastify.get('/:id', { preValidation: [fastify.authenticateNoError] }, movieController.get);

    fastify.post('/', { preValidation: [fastify.authenticateNoError] }, movieController.create);

    fastify.put('/:id', { preValidation: [fastify.authenticate, fastify.isAdmin] }, movieController.update);

    fastify.delete('/:id', { preValidation: [fastify.authenticate, fastify.isAdmin] }, movieController.delete);

    fastify.get('/tags/:name', movieController.searchTags);
}

export const movieRouter = routes;
