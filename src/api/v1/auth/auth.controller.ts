import { Router, Request, Response } from "express";
import * as _ from "lodash";

import { User, UserSchema, IUserDocument } from "./../user/user.model";
import AuthService from "./auth.service";

const userService = new AuthService(process.env.SECRET);
const router: Router = Router();

router.post("/login", (req: Request, res: Response, next) => {
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

router.post("/register", (req: Request, res: Response, next: any) => {
    const infoUser = _.pick(req.body, ["email", "password"]);
    if (infoUser.email == undefined || infoUser.password == undefined) {
        res.status(400).json({
            message: "Missing parameters"
        });
        return ;
    }
    userService.registerUser(infoUser.email, infoUser.password)
        .then((result) => {
            res.header("x-auth", result.token);
            res.status(201).json(result.user.toJSON());
        }).catch((err) => {
            // I could catch the error in the service and add an error management
            // But I'm not sure if it's the best choice here.
            if (err.name === "BulkWriteError" && err.code === 11000) {
                // Duplicated user
                return res.status(422).send({ message: "User already exist!" });
            }

            next(err);
        });
});

export const AuthController: Router = router;
