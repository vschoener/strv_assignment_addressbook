import { Router, Response } from 'express';
import { IRequest } from '../../../http/request';

import authentication from '../auth/middleware/authentication';

const router: Router = Router();

// This process is not asked in the exercise
// Route to test middleware
router.get('/me', authentication, (req: IRequest, res: Response) => {
    res.status(200).json(req.user.toJSON());
});

export const UserController: Router = router;
