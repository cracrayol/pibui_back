import { connection } from '../app';
import { Movie } from '../entity/movie';
import { google } from 'googleapis';
import { configuration } from '../configuration';

const youtube = google.youtube({
    version: 'v3',
    auth: configuration.youtube.apiKey
});

export class MovieService {

    /**
     * Return all the movies, ordered by validation date
     * @param limit Limit the number of results
     * @returns A promise
     */
    getAll(limit?: number) {
        return connection.createQueryBuilder(Movie, 'movie')
            .where('movie.valid = 1 AND movie.hidden = 0 AND movie.errorCount < 5')
            .leftJoinAndSelect('movie.tags', 'tag')
            .leftJoinAndSelect('movie.author', 'author')
            .take(limit)
            .orderBy('movie.validDate', 'DESC')
            .getMany();
    }

    /**
     * Get a movie from his internal ID.
     * @param id Movie's id
     * @returns A promise
     */
    getById(id: number) {
        return connection.createQueryBuilder(Movie, 'movie')
            .where('movie.valid = 1 AND movie.hidden = 0 AND movie.errorCount < 5 AND movie.id = :id', { id })
            .leftJoinAndSelect('movie.tags', 'tag')
            .leftJoinAndSelect('movie.author', 'author')
            .getOne();
    }

    /**
     * Check the given movie.
     * @param movie Movie to check
     * @returns A promise that is resolved if check is OK, else is rejected
     */
    async checkVideoState(movie: Movie) {
        if (movie.linkType === 'youtube') {
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
        } else {
            throw new Error('Invalid linkType value for movie.');
        }
    }
}
