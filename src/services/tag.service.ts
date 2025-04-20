import { connection } from '../app';
import { Tag } from '../entity/tag';

export class TagService {

    async getByNameLike(name: string) {
        return await connection.createQueryBuilder(Tag, 'tag')
            .where('name LIKE :name',
                { name: '%' + name + '%' })
            .orderBy('tag.name')
            .getMany();
    }
}
