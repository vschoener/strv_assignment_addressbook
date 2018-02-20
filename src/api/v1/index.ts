import { Router } from "express";

import { HomeController } from "./home/home.controller";
import { AuthController } from "./auth/auth.controller";
import { UserController } from "./user/user.controller";

const router: Router = Router();



router.use("/", HomeController);
router.use("/auth", AuthController);
router.use("/users", UserController);

export = router;
