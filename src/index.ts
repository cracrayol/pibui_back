import * as express from 'express';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import * as session from 'express-session';
import * as sessionSequelize from 'connect-session-sequelize';
import * as jwt from 'express-jwt';

import { userRouter } from './routers/user.router';
import { movieRouter } from './routers/movie.router';
import { sequelize } from './instances/sequelize';
import { searchRouter } from './routers/search.router';
import { playlistRouter } from './routers/playlist.router';

const app = express();
const port = 4300;
const SequelizeStore = sessionSequelize(session.Store);

app.use(session({
    secret: 'keyboard cat',
    store: new SequelizeStore({
        db: sequelize
    }),
    resave: false, // we support the touch method so per the express-session docs this should be set to false
    proxy: true // if you do SSL outside of node.
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
