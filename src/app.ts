
import session from '@fastify/session';
import cookie from '@fastify/cookie';
import fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import jwt from '@fastify/jwt';
import cors from '@fastify/cors';
import * as path from 'path';
import * as expressSession from "express-session";
import expressMySqlSession from "express-mysql-session";

import { configuration } from './config/configuration';
import { AppDataSource } from './config/data-source';
import { userRouter } from './routers/user.router';
import { movieRouter } from './routers/movie.router';
import { authorRouter } from './routers/author.router';
import { playlistRouter } from './routers/playlist.router';
import { tagRouter } from './routers/tag.router';
import { authPlugin } from './plugins/auth.plugin';

export const connection = AppDataSource;

AppDataSource.initialize().then(() => {

    const app = fastify({});
    const MySQLStore = expressMySqlSession(expressSession);

    /**
     * Plugins
     */

    app.register(fastifyStatic, {
        root: path.join(__dirname, 'static')
    });
    app.get('/play/:id', function (req, reply) {
        reply.sendFile('index.html');
    })
    app.get('/admin/*', function (req, reply) {
        reply.sendFile('index.html');
    })

    app.register(cookie, configuration.cookie);
    app.register(session, {
        secret: configuration.session.secret,
        store: new MySQLStore(configuration.sessionStore),
        saveUninitialized: false,
        cookie: {
            maxAge: configuration.session.maxAge * 1000,
            secure: 'auto'
        }
    });

    app.register(jwt, configuration.jwt);
    app.register(authPlugin);
    app.register(cors, configuration.cors);

    /**
     * Routes
     */

    app.register(movieRouter, { prefix: '/movie'});
    app.register(authorRouter, { prefix: '/author'});
    app.register(playlistRouter, { prefix: '/playlist'});
    app.register(tagRouter, { prefix: '/tag'});
    app.register(userRouter);

    try {
        app.listen(configuration.server);
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
});
