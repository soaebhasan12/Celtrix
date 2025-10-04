// Your all User Controller Code Goes Here
import { Request, Response } from 'express';

import { SendResponse } from '../../../utils/SendResponse.utils';
import userUtils from './user.utils';

class UserController {
  async getUser(req: Request, res: Response) {
    try {
      let finUser = await userUtils.FIND_USER_BY_ID();
      SendResponse.success(res, finUser, 200);
    } catch (error: any) {
      console.log(error);
      SendResponse.error(res, error.message, 500);
    }
  }
}

export default new UserController();
