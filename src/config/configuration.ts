import type  { Options } from 'express-mysql-session';

export const configuration = {
    server: {
        'port': 4300
    },
    jwt: {
        secret: '<your secret key>',
        saltRounds: 12
    },
    session: {
        maxAge: 86400,
        secret: '<a secret with minimum length of 32 characters>'
    },
    sessionStore: <Options> {
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: '<password>',
        database: 'pibui'
    },
    cors: {
        origin: 'http://127.0.0.1:4200',
        credentials: true,
        methods: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE']
    },
    cookie: {
        secret: '<a secret with minimum length of 20 characters>'
    }
};
