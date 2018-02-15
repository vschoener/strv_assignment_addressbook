import { Router, Request, Response } from "express";

const router: Router = Router();

router.get("/", (req: Request, res: Response) => {
    res.json({version: "1.0"});
});

export const HomeController: Router = router;
