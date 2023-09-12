/**
 * Fastify module augmentation in order to add session and user object to the request object
 */
import fastify from "fastify";

declare module 'fastify' {
    interface FastifyInstance {
        authenticate: any;
        authenticateNoError: any;
    }

    interface Session {
        playedMovies: number[]
    }
    
}

declare module '@fastify/jwt' {
    interface FastifyJWT {
        user: { id: number }
    }
}

export default fastify;