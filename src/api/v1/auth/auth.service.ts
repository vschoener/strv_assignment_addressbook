import * as bcrypt from 'bcrypt-nodejs';
import * as _ from 'lodash';
import * as jwt from 'jsonwebtoken';

import { User, IUserDocument } from '../user/user.model';
import UserService from '../user/user.service';
import IUserToken from './iuser.token';

export default class AuthService {
    constructor(private secret: string) {}

    // Simple login process, could be improved using OAUTH(2) for example
    async logUser(email: string, password: string) {
        return User.findOne({
            email
        }).then((user: IUserDocument) => {
            if (!user) {
                return {state: false, error: 'User not found'};
            } else if (!bcrypt.compareSync(password, user.password)) {
                return {state: false, error: "Password doesn't match"};
            }

            const tokenInfo = _.find(user.tokens, { access: 'auth' });

            return { state: true, token: tokenInfo.token };
        });
    }

    async registerUser(email: string, password: string) {
        const user = new User({
            email,
            password: bcrypt.hashSync(password)
        });

        return user.save().then(() => {
            const access: string = 'auth';
            let token: string;
            try {
                token = this.generateAuthToken(user, access);
            } catch (err) {
                return user.remove().then(() => {
                    throw Error(err);
                });
            }

            user.tokens = user.tokens.concat([{access, token}]);

            return user.save().then(() => { return { user, token }; });
        });
    }

    generateAuthToken(user: IUserDocument, access: string): string {
        const token = jwt.sign({
            _id: user._id.toHexString(),
            access
        }, this.secret).toString();

        return token;
    }

    async decodeUserFromToken(token: string) {
        try {
            // Cast as  <IUserToken> because this is the format to ensure the data
            const dataToken: IUserToken = <IUserToken> await jwt.verify(token, this.secret);
            dataToken.token = token;
            return UserService.findUserFromToken(dataToken);
        } catch (err) {
            throw err;
        }
    }
}
