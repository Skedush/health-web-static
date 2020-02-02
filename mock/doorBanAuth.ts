import { Request, Response } from 'express';
import { ResponseWarpper } from './_utils';
import api from '../src/services/api';

const { getDoorBanAuthSetting, updateDoorBanAuthSetting } = api;
// const { apiPrefix } = Constant;

export default {
  // eslint-disable-next-line max-lines-per-function
  [getDoorBanAuthSetting](req: Request, res: Response) {
    console.log('req: ', req.query);
    const data = {
      authState: true,
      passWay: ['1', '2'],
      autoAuth: true,
      setting: [
        { key: '1', value: '2', bigDoor: true, unitDoor: true },
        { key: '3', value: '1', unitDoor: true },
        { key: '4', value: '7', bigDoor: true },
      ],
    };
    if (data) {
      res.json(ResponseWarpper.success(data));
    } else {
      res.json(ResponseWarpper.failed('Not Found'));
    }
  },

  [updateDoorBanAuthSetting](req: Request, res: Response) {
    console.log('req: ', req.query);
    const data = 1;
    if (data) {
      res.json(ResponseWarpper.success(data));
    } else {
      res.json(ResponseWarpper.failed('Not Found'));
    }
  },
};
