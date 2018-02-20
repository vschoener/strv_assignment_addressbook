import { Router, Request, Response } from "express";
import { authentication } from "../auth/middleware/authentication";

const router: Router = Router();

// Route to test middleware
router.get("/me", authentication, (req: Request, res: Response) => {
    res.status(200).json(req.user.toJSON());
});

export const UserController: Router = router;
