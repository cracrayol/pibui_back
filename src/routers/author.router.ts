import { FastifyInstance } from 'fastify';
import { UserService } from '../services/user.service';
import { AuthorService } from '../services/author.service';
import { Author } from '../entity/author';
import { connection } from '../app';

async function routes(fastify: FastifyInstance, options) {

    const authorService = new AuthorService();
    const userService = new UserService();

    fastify.get('/search/:name', (req, res) => {
        connection.createQueryBuilder(Author, 'author')
            .where('name LIKE :name',
                { name: '%' + req.params.name + '%' })
            .getMany().then(result => {
                res.send(result.sort((a, b) => {
                    return a.name.localeCompare(b.name);
                }));
            });
    });

    fastify.put('/:id', { preValidation: [fastify.authenticate] }, async (req, res) => {
        const author = await authorService.getById(req.params.id);
        const user = await userService.getById(req.user.id);

        if (!author) {
            res.send(new Error('BAD_AUTHOR_ID'));
            return;
        } else if (!user) {
            res.send(new Error('BAD_USER_ID'));
            return;
        } else if (!user.isAdmin) {
            res.send(new Error('NOT_ALLOWED'));
            return;
        }

        const authorRequest = <Author>req.body;

        author.name = authorRequest.name;
        author.subname = authorRequest.subname;

        await author.save();
        res.send(author);
    });
}

export const authorRouter = routes;
