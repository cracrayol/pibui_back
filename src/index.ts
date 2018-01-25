import 'reflect-metadata';

import * as express from 'express';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import * as session from 'express-session';
import * as MySQLStore from 'express-mysql-session';

import { configuration } from './configuration';
import { userRouter } from './routers/user.router';
import { movieRouter } from './routers/movie.router';
import { searchRouter } from './routers/search.router';
import { playlistRouter } from './routers/playlist.router';
import { createConnection, Connection } from 'typeorm';

export let connection: Connection;

createConnection(configuration.typeOrm).then(conn => {
    connection = conn;

    const app = express();

    app.use(express.static('public'));
    app.use(session({
        secret: 'keyboard cat',
        store: new MySQLStore(configuration.sessionStore),
        resave: false, // we support the touch method so per the express-session docs this should be set to false
        proxy: true,
        saveUninitialized: false,
        cookie: {
            maxAge: configuration.session.maxAge * 1000
        }
    }));

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cors(configuration.cors));

    app.use('/movie', movieRouter);
    app.use('/search', searchRouter);
    app.use('/playlist', playlistRouter);
    app.use('/', userRouter);

    app.listen(configuration.express.listenPort, () => {
        console.log(`App is listening on port ${configuration.express.listenPort}`);
    });
});
