import { Request, Response } from 'express';
import { ResponseWarpper } from './_utils';
import api from '../src/services/api';

const { getCarBanAuthSetting, updateCarBanAuthSetting } = api;
// const { apiPrefix } = Constant;

export default {
  // eslint-disable-next-line max-lines-per-function
  [getCarBanAuthSetting](req: Request, res: Response) {
    console.log('req: ', req.query);
    const data = {
      authState: true,
      autoAuth: true,
      authTimeType: '2',
    };
    if (data) {
      res.json(ResponseWarpper.success(data));
    } else {
      res.json(ResponseWarpper.failed('Not Found'));
    }
  },

  [updateCarBanAuthSetting](req: Request, res: Response) {
    console.log('req: ', req.query);
    const data = 1;
    if (data) {
      res.json(ResponseWarpper.success(data));
    } else {
      res.json(ResponseWarpper.failed('Not Found'));
    }
  },
};
