import * as bcrypt from 'bcrypt-nodejs';
import * as jwt from 'jsonwebtoken';

import { User, IUserDocument } from '../user/user.model';
import UserService from '../user/user.service';
import IUserToken from './iuser.token';

export const statesError = {
    ERR_USER_NOT_FOUND: 'user_not_found',
    ERR_PASS_DOESNT_MATCH: 'password_doesnt_match',
};

export class AuthService {
    private access = 'auth';

    constructor(private secret: string, private expire: number) {}

    /**
     * Simple login process, could be improved using OAUTH(2) for example
     * @param {string} email
     * @param {string} password
     * @returns {"mongoose".Promise<any>}
     */
    logUser(email: string, password: string) {
        return User.findOne({
            email
        }).then(async (user: IUserDocument) => {
            if (!user) {
                throw { type: statesError.ERR_USER_NOT_FOUND };
            } else if (!bcrypt.compareSync(password, user.password)) {
                throw { type: statesError.ERR_PASS_DOESNT_MATCH };
            }

            let tokenInfo = user.tokens.find((token) => token.access === this.access);
            if (!tokenInfo) {
                tokenInfo = await this.generateAndAddTokenToUser(user);
            } else {
                // Maybe better to have a /renew route to handle the expired token
                // and not mix process
                const hasExpired = this.hasTokenExpired(tokenInfo.token);
                if (hasExpired) {
                    tokenInfo = await this.renewToken(user, tokenInfo.token);
                }
            }

            return { state: true, token: tokenInfo };
        });
    }

    /**
     * Register the user
     * @param {string} email
     * @param {string} password
     * @returns {Promise<Bluebird<any>>}
     */
    registerUser(email: string, password: string) {
        const user = new User({
            email,
            password: bcrypt.hashSync(password)
        });

        return user.save().then((user): IUserDocument => user);
    }

    /**
     * Generate and add new token to the user
     * @param {IUserDocument} user
     * @returns {Promise<any>}
     */
    generateAndAddTokenToUser(user: IUserDocument) {
        const token = this.generateAuthToken(user);

        return this.saveUserToken(user, token);
    }

    /**
     * Generate user token
     * @param {IUserDocument} user
     * @returns {string}
     */
    generateAuthToken(user: IUserDocument): string {
        const token = jwt.sign({
            _id: user._id.toHexString(),
            access: this.access,
            expireIn: this.expire,
        }, this.secret, {
            expiresIn: this.expire,
        }).toString();

        return token;
    }

    /**
     * Decode the token
     * @param {string} token
     * @returns {"mongoose".Promise<"mongoose".DocumentQuery<IUserDocument | null, IUserDocument>>}
     */
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

    /**
     * Remove and attach new token to the user
     * @param {IUserDocument} user
     * @param {string} token
     * @returns {Bluebird<any>}
     */
    renewToken(user: IUserDocument, token: string) {
        user.tokens = user.tokens.filter(tokenInfo => tokenInfo.token != token);
        const newToken = this.generateAuthToken(user);

        return this.saveUserToken(user, newToken);
    }

    /**
     * Attach the token to the user
     * @param {IUserDocument} user
     * @param {string} token
     * @returns {Promise<any>}
     */
    async saveUserToken(user: IUserDocument, token: string) {
        const tokenInfo = {
            access: this.access,
            token,
            expire: this.expire,
            date: new Date()
        };

        user.tokens.push(tokenInfo);
        await user.save();
        return tokenInfo;
    }

    /**
     * Check if a token has expired
     * @param {string} token
     * @returns {Promise<boolean>}
     */
    hasTokenExpired(token: string) {
        try {
            jwt.verify(token, this.secret);
        } catch (err) {
            if (err.name == 'TokenExpiredError') {
                return true;
            }
            console.log(err);
            throw err;
        }

        return false;
    }
}
