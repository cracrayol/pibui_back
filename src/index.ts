import 'reflect-metadata';

import * as express from 'express';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import * as session from 'express-session';
import * as MySQLStore from 'express-mysql-session';

import { userRouter } from './routers/user.router';
import { movieRouter } from './routers/movie.router';
import { searchRouter } from './routers/search.router';
import { playlistRouter } from './routers/playlist.router';
import { createConnection, Connection } from 'typeorm';

export let connection: Connection;

createConnection().then(conn => {
    connection = conn;

    const app = express();
    const port = 4300;
    app.use(session({
        secret: 'keyboard cat',
        store: new MySQLStore({
            host: 'localhost',
            port: 3306,
            user: 'root',
            password: '',
            database: 'pibui'
        }),
        resave: false, // we support the touch method so per the express-session docs this should be set to false
        proxy: true,
        saveUninitialized: false
    }));

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cors({
        origin: 'http://127.0.0.1:4200',
        credentials: true
    }));

    app.use('/movie', movieRouter);
    app.use('/search', searchRouter);
    app.use('/playlist', playlistRouter);
    app.use('/', userRouter);

    app.listen(port, () => {
        console.log(`App is listening on port ${port}`);
    });
});
