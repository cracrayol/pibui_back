import { Router, Request, Response } from 'express';
import { PlaylistService } from '../services/playlist.service';
import { IncomingHttpHeaders } from 'http';
import * as jwt from 'express-jwt';
import { configuration } from '../configuration';
import { Playlist } from '../entity/playlist';
import { connection } from '..';

export const playlistRouter = Router();

const playlistService = new PlaylistService();

playlistRouter.get('/', jwt({ secret: configuration.jwt.secret, credentialsRequired: false }), (req: Request, res: Response) => {
    if (req.user) {
        playlistService.getAll(req.user.id).then(playlists => res.json(playlists));
    } else {
        res.json([]);
    }
});

playlistRouter.put('/:id', jwt({ secret: configuration.jwt.secret, credentialsRequired: false }), (req: Request, res: Response) => {
    if (req.user) {
        playlistService.getById(req.params.id).then(playlist => {
            const playlistRequest = <Playlist>req.body;
            console.log(playlistRequest);
            playlist.name = playlistRequest.name;
            playlist.public = playlistRequest.public;
            playlist.allowedTags = playlistRequest.allowedTags;
            playlist.mandatoryTags = playlistRequest.mandatoryTags;
            playlist.forbiddenTags = playlistRequest.forbiddenTags;
            playlist.save().then(_ => res.json(playlist));
        });
    } else {
        res.json([]);
    }
});

playlistRouter.post('/', jwt({ secret: configuration.jwt.secret, credentialsRequired: false }), (req: Request, res: Response) => {
    if (req.user) {
        const playlist = new Playlist();
        const playlistRequest = <Playlist>req.body;

        playlist.name = playlistRequest.name;
        playlist.user = req.user;
        playlist.save().then(_ => res.json(playlist));
    } else {
        res.json([]);
    }
});

playlistRouter.delete('/:id', jwt({ secret: configuration.jwt.secret, credentialsRequired: false }), (req: Request, res: Response) => {
    if (req.user) {
        playlistService.getById(req.params.id).then(playlist => {
            playlist.remove().then(_ => res.json([]));
        });
    } else {
        res.json([]);
    }
});
