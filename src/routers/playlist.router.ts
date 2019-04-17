import { PlaylistService } from '../services/playlist.service';
import { Playlist } from '../entity/playlist';
import { FastifyInstance } from 'fastify';

async function routes(fastify: FastifyInstance, options) {

    const playlistService = new PlaylistService();

    fastify.get('/', { preValidation: [fastify.authenticate] }, async (req, res) => {
        const playlists = await playlistService.getAll(req.user.id);
        res.send(playlists);
    });

    fastify.put('/:id', { preValidation: [fastify.authenticate] }, async (req, res) => {
        const playlist = await playlistService.getById(req.params.id, true);

        if (!playlist) {
            res.send(new Error('BAD_PLAYLIST_ID'));
            return;
        } else if (playlist.user.id !== req.user.id) {
            res.send(new Error('NOT_ALLOWED'));
            return;
        }

        const playlistRequest = <Playlist>req.body;

        playlist.name = playlistRequest.name;
        playlist.public = playlistRequest.public;
        playlist.allowedTags = playlistRequest.allowedTags;
        playlist.mandatoryTags = playlistRequest.mandatoryTags;
        playlist.forbiddenTags = playlistRequest.forbiddenTags;

        await playlist.save();
        res.send(playlist);
    });

    fastify.post('/', { preValidation: [fastify.authenticate] }, async (req, res) => {
        const playlist = new Playlist();
        const playlistRequest = <Playlist>req.body;

        playlist.name = playlistRequest.name;
        playlist.user = req.user;
        playlist.save();
        res.send(playlist);
    });

    fastify.delete('/:id', { preValidation: [fastify.authenticate] }, async (req, res) => {
        const playlist = await playlistService.getById(req.params.id, true);

        if (!playlist) {
            res.send(new Error('BAD_PLAYLIST_ID'));
            return;
        } else if (playlist.user.id !== req.user.id) {
            res.send(new Error('NOT_ALLOWED'));
            return;
        }

        await playlist.remove();
        res.send();
    });
}

export const playlistRouter = routes;
