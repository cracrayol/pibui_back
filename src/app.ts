import 'reflect-metadata';

import * as MySQLStore from 'express-mysql-session';
import * as fastify from 'fastify';
import * as cookie from 'fastify-cookie';
import * as session from 'fastify-session';
import * as fastifyStatic from 'fastify-static';
import * as cors from 'fastify-cors';
import * as path from 'path';

import { configuration } from './configuration';
import { userRouter } from './routers/user.router';
import { movieRouter } from './routers/movie.router';
import { searchRouter } from './routers/search.router';
import { playlistRouter } from './routers/playlist.router';
import { createConnection, Connection } from 'typeorm';
import { jwtPlugin } from './plugins/jwt.plugin';

export let connection: Connection;

createConnection(configuration.typeOrm).then(conn => {
    connection = conn;

    const app = fastify({});

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
    app.register(searchRouter, { prefix: '/search'});
    app.register(playlistRouter, { prefix: '/playlist'});
    app.register(userRouter);

    try {
        app.listen(configuration.server.listenPort, '::');
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
});
