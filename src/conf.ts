import { ConnectionOptions } from 'typeorm';

export const configuration = {
    express: {
        'listenPort': 4300
    },
    session: {
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
            __dirname + '/entity/**/*.ts'
        ],
        migrations: [
            __dirname + '/migration/**/*.ts'
        ],
        subscribers: [
            __dirname + '/subscriber/**/*.ts'
        ]
    }
};
