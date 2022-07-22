
import session from '@fastify/session';
import cookie from '@fastify/cookie';
import fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import cors from '@fastify/cors';
import * as path from 'path';
import * as expressSession from "express-session";
import expressMySqlSession from "express-mysql-session";

import { configuration } from './configuration';
import { userRouter } from './routers/user.router';
import { movieRouter } from './routers/movie.router';
import { searchRouter } from './routers/search.router';
import { authorRouter } from './routers/author.router';
import { playlistRouter } from './routers/playlist.router';
import { DataSource } from 'typeorm';
import { jwtPlugin } from './plugins/jwt.plugin';

export const connection = new DataSource(configuration.typeOrm);

connection.initialize().then(() => {

    const app = fastify({});
    const MySQLStore = expressMySqlSession(expressSession);

    /**
     * Plugins
     */

    app.register(fastifyStatic, {
        root: path.join(__dirname, 'static')
    });
    app.register(cookie);
    app.register(session, {
        secret: configuration.session.secret,
        store: new MySQLStore(configuration.sessionStore),
        saveUninitialized: false,
        cookie: {
            maxAge: configuration.session.maxAge * 1000
        }
    });
    app.register(jwtPlugin);
    app.register(cors, configuration.cors);

    /**
     * Routes
     */

    app.register(movieRouter, { prefix: '/movie'});
    app.register(authorRouter, { prefix: '/author'});
    app.register(searchRouter, { prefix: '/search'});
    app.register(playlistRouter, { prefix: '/playlist'});
    app.register(userRouter);

    try {
        app.listen({
            port: configuration.server.listenPort
        });
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
});
