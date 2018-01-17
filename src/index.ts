import * as express from 'express';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';

import { userRouter } from './routers/user.router';
import { movieRouter } from './routers/movie.router';
import { tokenGuard } from './middlewares/token-guard';
const app = express();
const port = 4300;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use('/movie', movieRouter);
app.use('/', userRouter);

// Unprotected Get
app.get('/some-resource', (req, res, next) => {
    res.json('Hello World');
})
app.use(tokenGuard());

// Protected Get
app.get('/some-protected-resource', (req, res, next) => {
    res.json('Protected Hello World');
});

app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
});