import { Router } from 'express';

import { HomeController } from './home/home.controller';
import { AuthController } from './auth/auth.controller';
import { UserController } from './user/user.controller';
import { ContactController } from './contact/contact.controller';
import authentication from './auth/middleware/authentication';

const router: Router = Router();

router.use('/', HomeController);
router.use('/auth', AuthController);
router.use('/contacts', authentication, ContactController);
router.use('/users', UserController);

export = router;
