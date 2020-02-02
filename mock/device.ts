import { Request, Response } from 'express';
import { ResponseWarpper } from './_utils';
import api from '../src/services/api';

const { getDevice, getDeviceInfo, updateDevice, deleteDevice } = api;
// const { apiPrefix } = Constant;

export default {
  // eslint-disable-next-line max-lines-per-function

  [getDevice](req: Request, res: Response) {
    console.log('req: ', req.query);
    const data = {
      content: [
        {
          id: 1,
          type: 'string',
          typeStr: 'string',
          name: 'string',
          address: 'string',
          buildUnit: 'string',
          buildUnitStr: 'string',
          buildDate: '2019-09-05T09:18:25.362Z',
          operator: 'string',
          operatorStr: 'string',
          operatorPhone: 'string',
          status: 'string',
          statusStr: 'string',
        },
      ],
      pageable: {
        sort: {
          sorted: true,
          unsorted: false,
          empty: false,
        },
        offset: 0,
        pageNumber: 0,
        pageSize: 10,
        paged: true,
        unpaged: false,
      },
      last: true,
      totalPages: 1,
      totalElements: 21,
      size: 10,
      number: 0,
      sort: {
        sorted: true,
        unsorted: false,
        empty: false,
      },
      numberOfElements: 21,
      first: true,
      empty: false,
    };
    if (data) {
      res.json(ResponseWarpper.success(data));
    } else {
      res.json(ResponseWarpper.failed('Not Found'));
    }
  },

  [getDeviceInfo](req: Request, res: Response) {
    console.log('req: ', req.query);
    const data = {
      id: 1,
      name: 'string',
      type: 0,
      typeStr: 'string',
      ip: 'string',
      port: 'string',
      longitude: 'string',
      latitude: 'string',
      deviceUsername: 'string',
      devicePassword: 'string',
      address: 'string',
      brand: 'string',
      spec: 'string',
      buildUnit: 0,
      buildUnitStr: 'string',
      buildUnitPhone: 'string',
      buildDate: '2019-09-05T09:17:03.688Z',
      operator: 0,
      operatorStr: 'string',
      operatorPhone: 'string',
    };
    if (data) {
      res.json(ResponseWarpper.success(data));
    } else {
      res.json(ResponseWarpper.failed('Not Found'));
    }
  },

  [updateDevice](req: Request, res: Response) {
    console.log('req: ', req.body);
    const data = 1;
    if (data) {
      res.json(ResponseWarpper.success(data));
    } else {
      res.json(ResponseWarpper.failed('Not Found'));
    }
  },

  [deleteDevice](req: Request, res: Response) {
    console.log('req: ', req.body);
    const data = { error: 0, success: 1, msg: '测试' };
    if (data) {
      res.json(ResponseWarpper.success(data));
    } else {
      res.json(ResponseWarpper.failed('Not Found'));
    }
  },
};
