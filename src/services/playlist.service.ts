import { connection } from '../index';
import { Playlist } from '../entity/playlist';

export class PlaylistService {

    getAll(userId: number) {
        return connection.createQueryBuilder(Playlist, 'playlist')
            .where('playlist.userId = :id', { userId })
            .leftJoinAndSelect('playlist.tags', 'tag')
            .orderBy('name', 'ASC')
            .getMany();
    }

    getById(id: number) {
        return connection.createQueryBuilder(Playlist, 'playlist')
            .where('playlist.id = :id', { id })
            .leftJoinAndSelect('playlist.tags', 'tag')
            .getOne();
    }
}
