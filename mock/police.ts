import { Request, Response } from 'express';
import { ResponseWarpper } from './_utils';
import api from '../src/services/api';

const { getPolice, updatePolice } = api;
// const { apiPrefix } = Constant;

export default {
  // eslint-disable-next-line max-lines-per-function
  [getPolice](req: Request, res: Response) {
    console.log('req: ', req.query);
    const data = {
      id: 73,
      name: '张三',
      image: 'https://avatars1.githubusercontent.com/u/8186664?s=460&v=4',
      policeOrganizationId: 1,
      policeOrganizationName: '公安部',
      code: '1522400',
      phone: '15224005566',
      registerTime: '2019-08-01',
    };
    if (data) {
      res.json(ResponseWarpper.success(data));
    } else {
      res.json(ResponseWarpper.failed('Not Found'));
    }
  },

  [updatePolice](req: Request, res: Response) {
    console.log('req: ', req.query);
    const data = 1;
    if (data) {
      res.json(ResponseWarpper.success(data));
    } else {
      res.json(ResponseWarpper.failed('Not Found'));
    }
  },
};
