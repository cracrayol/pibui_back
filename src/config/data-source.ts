import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "../entity/user"
import { Movie } from "../entity/movie"
import { Author } from "../entity/author"
import { Playlist } from "../entity/playlist"
import { Tag } from "../entity/tag"

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "<passowrd>",
    database: "pibui",
    synchronize: false,
    logging: false,
    entities: [User, Movie, Author, Playlist, Tag],
    migrations: ["./migration/**/*.ts", "./migration/**/*.js"],
    subscribers: [],
})
