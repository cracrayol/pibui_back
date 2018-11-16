import { connection } from '../app';
import { Playlist } from '../entity/playlist';

export class PlaylistService {

    getAll(userId: number) {
        return connection.createQueryBuilder(Playlist, 'playlist')
            .where('playlist.userId = :userId', { userId })
            .leftJoinAndSelect('playlist.forbiddenTags', 'forbiddenTags')
            .leftJoinAndSelect('playlist.allowedTags', 'allowedTags')
            .leftJoinAndSelect('playlist.mandatoryTags', 'mandatoryTags')
            .orderBy('playlist.name', 'ASC')
            .getMany();
    }

    getById(id: number) {
        return connection.createQueryBuilder(Playlist, 'playlist')
            .where('playlist.id = :id', { id })
            .leftJoinAndSelect('playlist.forbiddenTags', 'forbiddenTags')
            .leftJoinAndSelect('playlist.allowedTags', 'allowedTags')
            .leftJoinAndSelect('playlist.mandatoryTags', 'mandatoryTags')
            .getOne();
    }
}
