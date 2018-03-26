import { Response } from 'express';

import { IRequest } from '../../../../http/request';
import AuthService from '../auth.service';
import { JsonWebTokenError } from 'jsonwebtoken';


// TODO: Maybe use passport instead of custom middleware
export default function authentication(req: IRequest, res: Response, next: any) {
    const token = req.header('X-AUTH');
    const authService = new AuthService(req.context.getJWTSecret());

    authService.decodeUserFromToken(token)
        .then(user => {
            if (!user) {
                return res.status(403).json({
                    message: 'Access Forbidden',
                });
            }
            req.user = user;
            req.token = token;
            next();
        }).catch((e: JsonWebTokenError) => {
            if (e.name == 'TokenExpiredError') {
                return res.status(422).json({
                    message: 'Your token has expired. Please login again to get a fresh one!'
                  });
            }
            next(e);
        });
}
