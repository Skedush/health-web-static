import { Request, Response } from 'express';
import { ResponseWarpper } from './_utils';
import api from '../src/services/api';

const { getCarBlackList, addCarBlackList, updateCarBlackList, deleteCarBlackList } = api;
// const { apiPrefix } = Constant;

export default {
  // eslint-disable-next-line max-lines-per-function
  [getCarBlackList](req: Request, res: Response) {
    console.log('req: ', req.query);
    const data = {
      content: [
        {
          id: 0,
          carPlate: 'string',
          reason: 'string',
          checkTime: '2019-09-05T12:00:24.724Z',
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

  [addCarBlackList](req: Request, res: Response) {
    console.log('req: ', req.body);
    const data = 1;
    if (data) {
      res.json(ResponseWarpper.success(data));
    } else {
      res.json(ResponseWarpper.failed('Not Found'));
    }
  },
  [updateCarBlackList](req: Request, res: Response) {
    console.log('req: ', req.body);
    const data = 1;
    if (data) {
      res.json(ResponseWarpper.success(data));
    } else {
      res.json(ResponseWarpper.failed('Not Found'));
    }
  },
  [deleteCarBlackList](req: Request, res: Response) {
    console.log('req: ', req.body);
    const data = 1;
    if (data) {
      res.json(ResponseWarpper.success(data));
    } else {
      res.json(ResponseWarpper.failed('Not Found'));
    }
  },
};
