/**
 * Fastify module augmentation in order to add session and user object to the request object
 */
import { DefaultQuery, DefaultParams, DefaultHeaders, DefaultBody } from "fastify";
import { IncomingMessage, ServerResponse, Server } from "http";

declare module 'fastify' {
    interface FastifyRequest<
        HttpRequest,
        Query = DefaultQuery,
        Params = DefaultParams,
        Headers = DefaultHeaders,
        Body = DefaultBody
        > {
        session: any;
        user: any;
    }

    interface FastifyInstance<HttpServer = Server, HttpRequest = IncomingMessage, HttpResponse = ServerResponse>
    {
        authenticate: any;
        authenticateNoError: any;
    }
}