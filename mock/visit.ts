import { Request, Response } from 'express';
import { ResponseWarpper } from './_utils';
import api from '../src/services/api';

const { visitRecordPage } = api;
// const { apiPrefix } = Constant;

export default {
  // eslint-disable-next-line max-lines-per-function
  [visitRecordPage](req: Request, res: Response) {
    console.log('req: ', req.query);
    const data = {
      content: [
        {
          faceImageUrl: 'string',
          name: 'string',
          phone: 'string',
          personName: 'string',
          buildCode: 'string',
          unitCode: 'string',
          recordTime: '2019-11-20T01:40:02.935Z',
          houseCode: 'string',
          authTime: 'string',
          direction: 'string',
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
      totalElements: 11,
      size: 10,
      number: 0,
      sort: {
        sorted: true,
        unsorted: false,
        empty: false,
      },
      numberOfElements: 11,
      first: true,
      empty: false,
    };
    if (data) {
      res.json(ResponseWarpper.success(data));
    } else {
      res.json(ResponseWarpper.failed('Not Found'));
    }
  },
};
