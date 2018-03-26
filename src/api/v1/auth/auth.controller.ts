import { Router, Response } from 'express';
import { IRequest } from '../../../http/request';
import * as _ from 'lodash';

import AuthService from './auth.service';

const router: Router = Router();

router.post('/login', (req: IRequest, res: Response, next) => {
    const userService = new AuthService(req.context.getJWTSecret());
    userService.logUser(req.body.email, req.body.password).then(data => {
        if (!data.state) {
            res.status(401);
            res.json({message: data.error});
            return ;
        }
        res.status(200).json({
            token: data.token
        });
    }).catch(err => next(err));
});

router.post('/register', (req: IRequest, res: Response, next: any) => {
    const userService = new AuthService(req.context.getJWTSecret());
    const infoUser = _.pick(req.body, ['email', 'password']);

    if (infoUser.email == undefined || infoUser.password == undefined) {
        res.status(400).json({
            message: 'Missing parameters'
        });
        return ;
    }
    userService.registerUser(infoUser.email, infoUser.password)
        .then((result) => {
            res.header('x-auth', result.token);
            res.status(201).json(result.user.toJSON());
        }).catch((err) => {
            // I could catch the error in the service and add an error management
            // But I'm not sure if it's the best choice here.
            if (err.name === 'BulkWriteError' && err.code === 11000) {
                // Duplicated user
                return res.status(422).send({ message: 'User already exist!' });
            }

            next(err);
        });
});

export const AuthController: Router = router;
