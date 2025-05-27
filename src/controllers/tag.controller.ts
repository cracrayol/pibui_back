import { FastifyRequest } from 'fastify';
import { Tag } from '../entity/tag';
import { TagService } from '../services/tag.service';

export class TagController {

    tagService = new TagService();

    get = async (req:FastifyRequest<{Querystring:{filter: string, start:number,take:number, sort?: string, order?: 'DESC'|'ASC'}}>) => {
        return await this.tagService.get(req.query.filter, req.query.start, req.query.take, req.query.sort, req.query.order);
    }

    create = async (req:FastifyRequest<{Body: Tag}>) => {
        if (!req.user.isAdmin) {
            return new Error('NOT_ALLOWED');
        }

        const tag = new Tag();
        tag.name = req.body.name;

        return await tag.save();
    }

    update = async (req:FastifyRequest<{Params:{id:number}, Body: Tag}>): Promise<Tag|Error> => {
        if (!req.user.isAdmin) {
            return new Error('NOT_ALLOWED');
        }

        const tag = await this.tagService.getById(req.params.id);
        
        if (!tag) {
            return new Error('BAD_TAG_ID');
        }

        tag.name = req.body.name;

        return await tag.save();
    }

    delete = async (req:FastifyRequest<{Params:{id:number}}>) => {
        if (!req.user.isAdmin) {
            return new Error('NOT_ALLOWED');
        }
        
        const tag = await this.tagService.getById(req.params.id);

        if (!tag) {
            return new Error('BAD_TAG_ID');
        }
        
        return await tag.softRemove();
    }

}
