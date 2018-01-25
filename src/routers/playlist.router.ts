import { Router, Request, Response } from 'express';
import { PlaylistService } from '../services/playlist.service';
import { IncomingHttpHeaders } from 'http';
import * as jwt from 'express-jwt';

export const playlistRouter = Router();

const playlistService = new PlaylistService();

playlistRouter.get('/', jwt({ secret: '0.rfyj3n9nzh', credentialsRequired: false}), (req: Request, res: Response) => {
    if (req.user) {
        playlistService.getAll(req.user.id).then(playlists => res.json(playlists));
    } else {
        res.json([]);
    }
});