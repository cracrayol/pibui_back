import { Router, Request, Response } from 'express';
import { randomBytes } from 'crypto';
import { PlaylistService } from '../services/playlist.service';
import { IncomingHttpHeaders } from 'http';
import { UserService } from '../services/user.service';
import * as jwt from 'express-jwt';

export const playlistRouter = Router();

const playlistService = new PlaylistService();
const userService = new UserService();

function getTokenFromHeaders(headers: IncomingHttpHeaders) {
    const header = headers.authorization as string;
    if (!header) {
        return header;
    }
    return header.split(' ')[1];
}

playlistRouter.get('/', jwt({ secret: '0.rfyj3n9nzh', credentialsRequired: false}), (req: Request, res: Response) => {
    if (req.user) {
        playlistService.getAll(req.user.id).then(playlists => res.json(playlists));
    } else {
        res.json([]);
    }
});
