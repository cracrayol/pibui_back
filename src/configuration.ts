import { ConnectionOptions } from 'typeorm';

export const configuration = {
    server: {
        'listenPort': 4300
    },
    jwt: {
        secret: '<your secret key>',
        saltRounds: 12
    },
    session: {
        maxAge: 86400,
        secret: '<a secret with minimum length of 32 characters>'
    },
    sessionStore: {
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: '',
        database: 'pibui'
    },
    cors: {
        origin: 'http://127.0.0.1:4200',
        credentials: true
    },
    /*youtube: {
        apiKey: '<Your_Youtube_API_Key>'
    },*/
    typeOrm: <ConnectionOptions>{
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: '',
        database: 'pibui',
        synchronize: true,
        logging: true,
        entities: [
            __dirname + '/entity/**/*.ts',
            __dirname + '/entity/**/*.js'
        ],
        migrations: [
            __dirname + '/migration/**/*.ts',
            __dirname + '/migration/**/*.js'
        ],
        subscribers: [
            __dirname + '/subscriber/**/*.ts',
            __dirname + '/subscriber/**/*.js'
        ]
    }
};
