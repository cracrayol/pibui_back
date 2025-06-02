import { connection } from '../app';
import { Tag } from '../entity/tag';
import { Page } from '../utils/page';

export class TagService {

    async getByNameLike(name: string) {
        return await connection.createQueryBuilder(Tag, 'tag')
            .where('name LIKE :name',
                { name: '%' + name + '%' })
            .orderBy('tag.name')
            .getMany();
    }
    
    /**
     * Get a tag from his internal ID.
     * @param id Tag's id
     * @returns A promise
     */
    getById(id: number) {
        return connection.createQueryBuilder(Tag, 'tag')
            .where('tag.id = :id', { id })
            .getOne();
    }
    
    /**
     * Return all the tags
     * @param limit Limit the number of results
     * @returns A promise
     */
    async get(filter: string, start: number, limit: number, sort?: string, order?: 'ASC' | 'DESC') {
        let builder = connection.createQueryBuilder(Tag, 'tag')
            .skip(start)
            .take(limit);

        if(filter != '') {
            builder = builder.where('MATCH(tag.name) AGAINST(:filter IN BOOLEAN MODE)',
                { filter })
        }

        if (sort !== undefined && sort !== null && sort.trim() != ''
            && order !== undefined && order !== null && order.trim() != '') {
            builder = builder.orderBy(sort, order);
        }

        return new Page(await builder.getManyAndCount());
    }
}
