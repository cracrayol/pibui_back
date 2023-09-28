import { FastifyInstance } from 'fastify';
import { PlaylistController } from '../controllers/playlist.controller';

async function routes(fastify: FastifyInstance) {

    const playlistController = new PlaylistController();

    fastify.get('/', { preValidation: [fastify.authenticate] }, playlistController.get);

    fastify.put('/:id', { preValidation: [fastify.authenticate] }, playlistController.update);

    fastify.post('/', { preValidation: [fastify.authenticate] }, playlistController.create);

    fastify.delete('/:id', { preValidation: [fastify.authenticate] }, playlistController.delete);
}

export const playlistRouter = routes;
