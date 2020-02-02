import { Request, Response } from 'express';
import { ResponseWarpper } from './_utils';
import api from '../src/services/api';

const { getPersonRecord, exportPersonRecord } = api;
// const { apiPrefix } = Constant;

export default {
  // eslint-disable-next-line max-lines-per-function
  [getPersonRecord](req: Request, res: Response) {
    console.log('req: ', req.query);
    const data = {
      content: [
        {
          id: 1,
          url: 'string',
          name: 'string',
          phone: 'string',
          personType: 'string',
          address: 'string',
          transitType: 'string',
          transitWay: 'string',
          createTime: '2019-09-05T11:13:04.882Z',
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

  [exportPersonRecord](req: Request, res: Response) {
    console.log('req: ', req.query);
    const data = 1;
    if (data) {
      res.json(ResponseWarpper.success(data));
    } else {
      res.json(ResponseWarpper.failed('Not Found'));
    }
  },
};
