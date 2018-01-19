// src/services/user.service.ts

import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import * as Bluebird from 'Bluebird';
import { Movie } from '../models/movie';
import { sequelize } from '../instances/sequelize';
import { Author } from '../models/author';
import { Tag } from '../models/tag';
import { UserService } from './user.service';
import { Playlist } from '../models/playlist';

export class PlaylistService {

    getAll(userId: number) {
        return Playlist.findAll({
            where: {
                userId
            },
            order: [['name', 'ASC']],
            include: [Tag]
        });
    }
}
