import { connection } from '../app';
import { Playlist } from '../entity/playlist';

export class PlaylistService {

    /**
     * Get all the playlists of the specified user ID
     * @param userId The user internal ID
     * @returns A promise
     */
    getAll(userId: number) {
        return connection.createQueryBuilder(Playlist, 'playlist')
            .where('playlist.userId = :userId', { userId })
            .leftJoinAndSelect('playlist.forbiddenTags', 'forbiddenTags')
            .leftJoinAndSelect('playlist.allowedTags', 'allowedTags')
            .leftJoinAndSelect('playlist.mandatoryTags', 'mandatoryTags')
            .orderBy('playlist.name', 'ASC')
            .getMany();
    }

    /**
     * Get a playlist from his internal ID
     * @param id Playlist's internal ID
     * @returns A promise
     */
    getById(id: number) {
        return connection.createQueryBuilder(Playlist, 'playlist')
            .where('playlist.id = :id', { id })
            .leftJoinAndSelect('playlist.forbiddenTags', 'forbiddenTags')
            .leftJoinAndSelect('playlist.allowedTags', 'allowedTags')
            .leftJoinAndSelect('playlist.mandatoryTags', 'mandatoryTags')
            .getOne();
    }
}
