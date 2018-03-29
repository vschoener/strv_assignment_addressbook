import IUserToken from '../auth/iuser.token';
import { User } from './user.model';

export default class UserService {

    /**
     * Find the user from his token
     * @param {IUserToken} token
     * @returns {"mongoose".DocumentQuery<IUserDocument | null, IUserDocument>}
     */
    static findUserFromToken(token: IUserToken) {

        if (token.token == undefined) {
            throw new Error('Token missing, did you forget to set it ?');
        }

        return User.findOne({
            '_id': token._id,
            'tokens.token': token.token,
            'tokens.access': token.access
        });
    }
}
