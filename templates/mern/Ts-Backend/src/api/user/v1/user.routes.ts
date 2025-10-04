import { Router } from 'express';
import userController from './user.controller';
let router: Router = Router();

router.get('/findUser', userController.getUser);

export { router as UserRoutes };
