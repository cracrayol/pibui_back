import { PlaylistService } from '../services/playlist.service';
import { Playlist } from '../entity/playlist';
import { FastifyInstance } from 'fastify';

async function routes(fastify: FastifyInstance, options) {

    const playlistService = new PlaylistService();

    fastify.get('/', async (req, res) => {
        if (req.user) {
            const playlists = await playlistService.getAll(req.user.id)
            res.send(playlists);
        } else {
            res.send([]);
        }
    });

    fastify.put('/:id', async (req, res) => {
        if (req.user) {
            const playlist = await playlistService.getById(req.params.id);

            const playlistRequest = <Playlist>req.body;

            playlist.name = playlistRequest.name;
            playlist.public = playlistRequest.public;
            playlist.allowedTags = playlistRequest.allowedTags;
            playlist.mandatoryTags = playlistRequest.mandatoryTags;
            playlist.forbiddenTags = playlistRequest.forbiddenTags;

            await playlist.save();
            res.send(playlist);
        } else {
            res.send([]);
        }
    });

    fastify.post('/', async (req, res) => {
        if (req.user) {
            const playlist = new Playlist();
            const playlistRequest = <Playlist>req.body;

            playlist.name = playlistRequest.name;
            playlist.user = req.user;
            playlist.save();
            res.send(playlist);
        } else {
            res.send([]);
        }
    });

    fastify.delete('/:id', async (req, res) => {
        if (req.user) {
            const playlist = await playlistService.getById(req.params.id);
            await playlist.remove();
            res.send([]);
        } else {
            res.send([]);
        }
    });
}

export const playlistRouter = routes;
