import { connection } from '../app';
import { Movie } from '../entity/movie';
import { rand } from '../utils/random';
//import { google } from 'googleapis';
//import { configuration } from '../configuration';

/*const youtube = google.youtube({
    version: 'v3',
    auth: configuration.youtube.apiKey
});*/

export class MovieService {

    /**
     * Return all the movies, ordered by validation date
     * @param limit Limit the number of results
     * @returns A promise
     */
    get(start: number, limit: number, sort?: string, order?:'ASC'|'DESC', all?: boolean) {
         let builder = connection.createQueryBuilder(Movie, 'movie');

         if(!all) {
            builder = builder.where('movie.valid = 1 AND movie.errorCount < 5');
         }
            
         builder.leftJoinAndSelect('movie.tags', 'tag')
            .leftJoinAndSelect('movie.author', 'author')
            .skip(start)
            .take(limit);

        if(sort !== undefined && sort !== null && sort.trim() != ''
             && order !== undefined && order !== null && order.trim() != '') {
            builder = builder.orderBy(sort, order);
        }            

        return builder.getMany();
    }

    /**
     * Get a movie from his internal ID.
     * @param id Movie's id
     * @returns A promise
     */
    getById(id: number) {
        return connection.createQueryBuilder(Movie, 'movie')
            .where('movie.id = :id', { id })
            .leftJoinAndSelect('movie.tags', 'tag')
            .leftJoinAndSelect('movie.author', 'author')
            .getOne();
    }

    async getRandomFiltered(where: string, filteredIds: number[]) {
        const result = await connection.createQueryBuilder(Movie, 'movie').select('COUNT(*)', 'count')
            .where(where, { filteredIds })
            .getRawOne();

        return await connection.createQueryBuilder(Movie, 'movie')
            .where(where, { filteredIds })
            .leftJoinAndSelect('movie.tags', 'tag')
            .leftJoinAndSelect('movie.author', 'author')
            .take(1)
            .skip(rand(0, result.count) - 1)
            .orderBy('movie.id', 'ASC')
            .getOne();
    }

    /**
     * Check the given movie.
     * @param movie Movie to check
     * @returns A promise that is resolved if check is OK, else is rejected
     */
    /*async checkVideoState(movie: Movie) {
        const youtubeMovie = await youtube.videos.list({
            id: movie.linkId,
            part: 'status'
        });
        if (!youtubeMovie ||
            youtubeMovie.data.items.length === 0 ||
            !youtubeMovie.data.items[0].status.embeddable ||
            youtubeMovie.data.items[0].status.privacyStatus === 'private') {
            throw new Error('Movie blocked.');
        }
    }*/
}
