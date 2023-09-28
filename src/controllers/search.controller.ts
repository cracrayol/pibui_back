import { FastifyRequest } from 'fastify';
import { SearchService } from '../services/search.service';

export class SearchController {

    searchService = new SearchService();

    search = async (req:FastifyRequest<{Params:{search:string}}>) => {
        return await this.searchService.search(req.params.search);
    }

}
