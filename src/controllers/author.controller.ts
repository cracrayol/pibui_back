import { FastifyRequest } from 'fastify';
import { Author } from '../entity/author';
import { AuthorService } from '../services/author.service';

export class AuthorController {

    authorService = new AuthorService();

    search = async (req:FastifyRequest<{Params:{name:string}}>) => {
        return await this.authorService.getByNameLike(req.params.name != null ? req.params.name : '');
    }

    get = async (req:FastifyRequest<{Querystring:{start:number,take:number, sort?: string, order?: 'DESC'|'ASC'}}>) => {
        return await this.authorService.get(req.query.start, req.query.take, req.query.sort, req.query.order);
    }

    create = async (req:FastifyRequest<{Params:{id:number}, Body: Author}>) => {
        const author = new Author();
        const authorRequest = req.body;

        author.name = authorRequest.name;
        author.subname = authorRequest.subname;

        return await author.save();
    }

    update = async (req:FastifyRequest<{Params:{id:number}, Body: Author}>): Promise<Author|Error> => {
        const author = await this.authorService.getById(req.params.id);
        
        if (!author) {
            return new Error('BAD_AUTHOR_ID');
        }

        author.name = req.body.name;
        author.subname = req.body.subname;

        return await author.save();
    }

    delete = async (req:FastifyRequest<{Params:{id:number}}>) => {
        const author = await this.authorService.getById(req.params.id);

        if (!author) {
            return new Error('BAD_AUTHOR_ID');
        }
        
        return await author.remove();
    }

}
