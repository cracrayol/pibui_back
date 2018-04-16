import { Router, Request, Response } from 'express';
import { matchedData } from 'express-validator/filter';
import { validationResult } from 'express-validator/check';
import { userRules } from '../rules/user.rules';
import { UserService } from '../services/user.service';
import { User } from '../entity/user';
import { configuration } from '../configuration';
import * as jwt from 'express-jwt';

export const userRouter = Router();

const userService = new UserService();

userRouter.post('/register', userRules['forRegister'], (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json(errors.array());
    }
    const payload = matchedData(req) as User;
    const user = userService.register(payload);
    return user.then(u => res.json(u));
});

userRouter.post('/login', userRules['forLogin'], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json(errors.array());
    }
    const payload = matchedData(req) as User;
    return userService.login(payload).then(t => res.json(t));
});

userRouter.get('/user/:id', jwt({ secret: configuration.jwt.secret, credentialsRequired: false }), (req: Request, res: Response) => {
    if (req.user && parseInt(req.user.id, 10) === parseInt(req.params.id, 10)) {
        userService.getById(req.user.id).then(user => {
            res.json(user);
        });
    } else {
        res.json([]);
    }
});

userRouter.put('/user/:id', jwt({ secret: configuration.jwt.secret, credentialsRequired: false }), (req: Request, res: Response) => {
    if (req.user && parseInt(req.user.id, 10) === parseInt(req.params.id, 10)) {
        userService.getById(req.user.id).then(user => {
            console.log(user);
            const userRequest = <User>req.body;

            user.currentPlaylistId = userRequest.currentPlaylistId;

            user.save().then(_ => res.json(user));
        });
    } else {
        res.json([]);
    }
});
