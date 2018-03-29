import { Router, Response } from 'express';
import { IRequest } from '../../../http/request';
import * as _ from 'lodash';
import * as moment from 'moment';

import { AuthService, statesError } from './auth.service';
import { IUserDocument } from '../user/user.model';

const router: Router = Router();

router.post('/login', (req: IRequest, res: Response, next) => {
    const userService = new AuthService(req.context.getJWTSecret(), req.context.jwtExpire);
    userService.logUser(req.body.email, req.body.password).then(data => {
        const currentMomentDate = moment();
        const tokenDate = moment(data.token.date);
        const duration = moment.duration(currentMomentDate.diff(tokenDate));

        res.status(200).json({
            token: data.token.token,
            expireTime: data.token.expire,
            date: data.token.date,
            expireIn: data.token.expire - duration.seconds(),
        });
    }).catch((error: any) => {
        if (error.type) {
            let message: string;
            switch (error.type) {
                case statesError.ERR_USER_NOT_FOUND:
                    message = 'User nor found';
                    break;
                case statesError.ERR_PASS_DOESNT_MATCH:
                    message = 'Password doesn\'t match';
                    break;
                default:
                    message = 'Unknown error, please try again our contact us';
            }

            res.status(401).json({message});
            return res.end();
        }
        next(error);
    });
});

router.post('/register', (req: IRequest, res: Response, next: any) => {
    const authService = new AuthService(req.context.getJWTSecret(), req.context.jwtExpire);
    const infoUser = _.pick(req.body, ['email', 'password']);

    if (infoUser.email == undefined || infoUser.password == undefined) {
        res.status(400).json({
            message: 'Missing parameters'
        });
        return ;
    }
    authService.registerUser(infoUser.email, infoUser.password)
        .then((user: IUserDocument) => {
            res.status(201).json(user.toJSON());
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
