import { Request, Response } from "express";
import AuthService from "../auth.service";
import { IUserDocument } from "../../user/user.model";

const authService = new AuthService(process.env.SECRET);

// TODO: Use passport instead of custom middleware
export function authentication(req: Request, res: Response, next: any) {
    const token = req.header("X-AUTH");

    authService.decodeUserFromToken(token)
        .then(user => {
            req.user = user;
            req.token = token;
            next();
        }).catch((e) => {
            res.status(401).json({
                message: "You are not authorized"
            });
        });
}
