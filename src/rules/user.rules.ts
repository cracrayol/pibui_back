import * as bcrypt from 'bcrypt';
import { check } from 'express-validator/check';
import { UserService } from '../services/user.service';

const userService = new UserService();

export const userRules = {
    forRegister: [
        check('email')
            .isEmail().withMessage('Invalid email format')
            .custom(email => userService.getByEmail(email).then(u => !!!u)).withMessage('Email exists'),
        check('password')
            .isLength({ min: 8 }).withMessage('Invalid password')
    ],
    forLogin: [
        check('email')
            .isEmail().withMessage('Invalid email format')
            .custom(email => userService.getByEmail(email).then(u => !!u)).withMessage('Invalid email or password'),
        check('password')
            .custom((password, { req }) => {
                return userService.getByEmail(req.body.email)
                    .then(u => bcrypt.compare(password, u!.password));
            }).withMessage('Invalid email or password')
    ]
};
