import { PlaylistService } from '../services/playlist.service';
import { Playlist } from '../entity/playlist';
import { FastifyInstance } from 'fastify';

async function routes(fastify: FastifyInstance, options) {

    const playlistService = new PlaylistService();

    fastify.get('/', (req, res) => {
        if (req.user) {
            playlistService.getAll(req.user.id).then(playlists => res.send(playlists));
        } else {
            res.send([]);
        }
    });

    fastify.put('/:id', (req, res) => {
        if (req.user) {
            playlistService.getById(req.params.id).then(playlist => {
                const playlistRequest = <Playlist>req.body;
                console.log(playlistRequest);
                playlist.name = playlistRequest.name;
                playlist.public = playlistRequest.public;
                playlist.allowedTags = playlistRequest.allowedTags;
                playlist.mandatoryTags = playlistRequest.mandatoryTags;
                playlist.forbiddenTags = playlistRequest.forbiddenTags;
                playlist.save().then(_ => res.send(playlist));
            });
        } else {
            res.send([]);
        }
    });

    fastify.post('/', (req, res) => {
        if (req.user) {
            const playlist = new Playlist();
            const playlistRequest = <Playlist>req.body;

            playlist.name = playlistRequest.name;
            playlist.user = req.user;
            playlist.save().then(_ => res.send(playlist));
        } else {
            res.send([]);
        }
    });

    fastify.delete('/:id', (req, res) => {
        if (req.user) {
            playlistService.getById(req.params.id).then(playlist => {
                playlist.remove().then(_ => res.send([]));
            });
        } else {
            res.send([]);
        }
    });
}

export const playlistRouter = routes;
