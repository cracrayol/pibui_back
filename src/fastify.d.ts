/**
 * Fastify module augmentation in order to add session and user object to the request object
 */

import fastify from "fastify";
import { Movie } from "./entity/movie";

declare module 'fastify' {
    interface FastifyInstance {
        authenticate: any;
        authenticateNoError: any;
    }

    interface UserType {
        id: number
    }

    interface Session {
        playedMovies: number[]
    }
    
}

export default fastify;