import { Request, Response } from 'express';
import { ResponseWarpper } from './_utils';
import api from '../src/services/api';

const { getIcCardList, addIcCard, iussedIcCardAuth, updateIcCard, deleteIcCard } = api;

export default {
  // eslint-disable-next-line max-lines-per-function
  [getIcCardList](req: Request, res: Response) {
    const data = {
      content: [
        {
          id: 1,
          icCardNo: '“6782634657263”',
          personName: '梁可可',
          certificationStatus: 1,
          personPhone: '“15677889988',
          authorizeStartDate: '“2019-11-01”',
          authorizeEndDate: '“2019-11-01”',
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
        unpaged: false,
        paged: true,
      },
      totalPages: 1,
      last: true,
      totalElements: 5,
      size: 10,
      number: 0,
      numberOfElements: 5,
      first: true,
      sort: {
        sorted: true,
        unsorted: false,
        empty: false,
      },
      empty: false,
    };
    console.log(data);
    if (data) {
      res.json(ResponseWarpper.success(data));
    } else {
      res.json(ResponseWarpper.failed('Not Found'));
    }
  },

  [addIcCard](req: Request, res: Response) {
    // const requestData = {
    //   icCardNo: '27236475',
    //   personName: null,
    //   personPhone: null,
    //   personIdCard: null,
    //   personId: 0,
    // };
    const data = true;
    if (data) {
      res.json(ResponseWarpper.success(data));
    } else {
      res.json(ResponseWarpper.failed('Not Found'));
    }
  },
  [iussedIcCardAuth](req: Request, res: Response) {
    // const requestData = {
    //   id: '1',
    //   authorizeStartDate: '2019-11-01',
    //   authorizeEndDate: '2019-11-01',
    // };
    res.json(ResponseWarpper.success(true));
  },
  [updateIcCard](req: Request, res: Response) {
    // const requestData = {
    //   id: 5,
    //   personName: 'lkk',
    //   personPhone: null,
    //   personIdCard: null,
    //   personId: 1,
    // };
    res.json(ResponseWarpper.success(true));
  },
  [deleteIcCard](req: Request, res: Response) {
    // const data = {
    //   success: 1,
    //   error: 0,
    //   message: [],
    // };
    res.json(ResponseWarpper.success(true));
  },
};
