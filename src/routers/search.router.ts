import { SearchController } from '../controllers/search.controller';
import { FastifyInstance, FastifyRequest } from 'fastify';

async function routes(fastify: FastifyInstance) {

    const searchController = new SearchController();

    fastify.get('/:search', searchController.search);
}

export const searchRouter = routes;
