import { FastifyRequest } from 'fastify';
import { Author } from '../entity/author';
import { AuthorService } from '../services/author.service';

export class AuthorController {

    authorService = new AuthorService();

    get = async (req:FastifyRequest<{Querystring:{filter: string, start:number,take:number, sort?: string, order?: 'DESC'|'ASC'}}>) => {
        return await this.authorService.get(req.query.filter, req.query.start, req.query.take, req.query.sort, req.query.order);
    }

    create = async (req:FastifyRequest<{Body: Author}>) => {
        if (!req.user.isAdmin) {
            return new Error('NOT_ALLOWED');
        }

        const author = new Author();
        author.name = req.body.name;
        author.subname = req.body.subname;

        return await author.save();
    }

    update = async (req:FastifyRequest<{Params:{id:number}, Body: Author}>): Promise<Author|Error> => {
        if (!req.user.isAdmin) {
            return new Error('NOT_ALLOWED');
        }

        const author = await this.authorService.getById(req.params.id);
        
        if (!author) {
            return new Error('BAD_AUTHOR_ID');
        }

        author.name = req.body.name;
        author.subname = req.body.subname;

        return await author.save();
    }

    delete = async (req:FastifyRequest<{Params:{id:number}}>) => {
        if (!req.user.isAdmin) {
            return new Error('NOT_ALLOWED');
        }
        
        const author = await this.authorService.getById(req.params.id);

        if (!author) {
            return new Error('BAD_AUTHOR_ID');
        }
        
        return await author.softRemove();
    }

}
