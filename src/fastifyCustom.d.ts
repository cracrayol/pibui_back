/**
 * Fastify module augmentation in order to add session and user object to the request object
 */
import fastify from "fastify";
import { User } from "./entity/user";

declare module 'fastify' {
    interface FastifyInstance {
        authenticate: any;
        authenticateNoError: any;
        isAdmin: any;
    }

    interface Session {
        playedMovies: number[]
    }
    
}

declare module '@fastify/jwt' {
    interface FastifyJWT {
        user: User
    }
}

export default fastify;