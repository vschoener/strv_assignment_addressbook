import IUserToken from "../auth/iuser.token";
import { User } from "./user.model";

export default class UserService {
    findUserFromToken (token: IUserToken) {
        return User.findOne({
            "_id": token._id,
            "tokens.token": token.token,
            "tokens.access": token.access
        });
    }
}
