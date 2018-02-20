import * as bcrypt from "bcrypt-nodejs";
import * as _ from "lodash";
import * as jwt from "jsonwebtoken";

import { User, UserSchema, IUserDocument } from "./../user/user.model";
import UserService from "../user/user.service";
import IUserToken from "./iuser.token";

const userService = new UserService();

export default class AuthService {
    constructor(private secret: string) {}

    async logUser(email: string, password: string) {
        return User.findOne({
            email
        }).then((user: IUserDocument) => {
            if (!user) {
                return {state: false, error: "User not found"};
            } else if (!bcrypt.compareSync(password, user.password)) {
                return {state: false, error: "Password doesn't match"};
            }

            const tokenInfo = _.find(user.tokens, { access: "auth" });

            return { state: true, token: tokenInfo.token };
        });
    }

    async registerUser(email: string, password: string) {
        const user = new User({
            email,
            password: bcrypt.hashSync(password)
        });

        return user.save().then(() => {
            const access: string = "auth";
            const token: string = this.generateAuthToken(user, access);

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
        let dataToken;

        try {
            dataToken = <IUserToken>jwt.verify(token, this.secret);
            dataToken.token = token;
        } catch (err) {
            throw new Error(err);
        }

        return userService.findUserFromToken(dataToken);
    }
}
