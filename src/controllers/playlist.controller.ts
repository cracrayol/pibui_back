import { FastifyRequest } from 'fastify';
import { PlaylistService } from '../services/playlist.service';
import { Playlist } from '../entity/playlist';
import { User } from '../entity/user';

export class PlaylistController {

    playlistService = new PlaylistService();

    get = async (req:FastifyRequest<{Params:{search:string}}>) => {
        return await this.playlistService.getAll(req.user.id);
    }

    create = async (req:FastifyRequest<{Body:Playlist}>) => {
        const playlist = new Playlist();
        playlist.name = req.body.name;
        playlist.public = req.body.public ? req.body.public : false;
        playlist.allowedTags = req.body.allowedTags;
        playlist.mandatoryTags = req.body.mandatoryTags;
        playlist.forbiddenTags = req.body.forbiddenTags;
        playlist.user = <User> req.user;
        return await playlist.save();
    }

    update = async (req:FastifyRequest<{Params:{id:number}}>) => {
        const playlist = await this.playlistService.getById(req.params.id, true);

        if (!playlist) {
            return new Error('BAD_PLAYLIST_ID');
        } else if (playlist.user.id !== req.user.id) {
            return new Error('NOT_ALLOWED');
        }

        const playlistRequest = <Playlist>req.body;

        playlist.name = playlistRequest.name;
        playlist.public = playlistRequest.public ? playlistRequest.public : false;
        playlist.allowedTags = playlistRequest.allowedTags;
        playlist.mandatoryTags = playlistRequest.mandatoryTags;
        playlist.forbiddenTags = playlistRequest.forbiddenTags;

        return await playlist.save();
    }

    delete = async (req:FastifyRequest<{Params:{id:number}}>) => {
        const playlist = await this.playlistService.getById(req.params.id, true);

        if (!playlist) {
            return new Error('BAD_PLAYLIST_ID');
        } else if (playlist.user.id !== req.user.id) {
            return new Error('NOT_ALLOWED');
        }

        await playlist.softRemove();
    }

}
