import { Request } from 'express';
import { Context } from '../context';
import { IUserDocument } from '../api/v1/user/user.model';

export interface IRequest extends Request {
    context: Context;
    user: IUserDocument;
    token: string;
}
