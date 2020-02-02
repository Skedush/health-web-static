import { Request, Response } from 'express';
import { ResponseWarpper } from './_utils';
import api from '../src/services/api';

const {
  getPersonAuth,
  getPersonAuthInfo,
  addPersonAuth,
  deletePersonAuth,
  getPersonLicenceInfo,
  deletePersonDeviceAuth,
  getLicenceInfo,
  getLicencePage,
} = api;
// const { apiPrefix } = Constant;

export default {
  // eslint-disable-next-line max-lines-per-function
  [getPersonAuth](req: Request, res: Response) {
    console.log('req: ', req.query);
    const data = {
      content: [
        {
          id: 1,
          name: 'string',
          type: 'string',
          typeStr: 'string',
          phone: 'string',
          url: 'string',
          authState: 'string',
          authStateStr: 'string',
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

  [getPersonAuthInfo](req: Request, res: Response) {
    console.log('req: ', req.query);
    const data = [
      {
        id: 0,
        name: 'string',
        authStartDate: '2019-09-05T09:27:55.099Z',
        authEndDate: '2019-09-05T09:27:55.099Z',
      },
    ];
    if (data) {
      res.json(ResponseWarpper.success(data));
    } else {
      res.json(ResponseWarpper.failed('Not Found'));
    }
  },

  [addPersonAuth](req: Request, res: Response) {
    console.log('req: ', req.body);
    const data = 1;
    if (data) {
      res.json(ResponseWarpper.success(data));
    } else {
      res.json(ResponseWarpper.failed('Not Found'));
    }
  },
  [deletePersonAuth](req: Request, res: Response) {
    console.log('req: ', req.body);
    const data = 1;
    if (data) {
      res.json(ResponseWarpper.success(data));
    } else {
      res.json(ResponseWarpper.failed('Not Found'));
    }
  },
  [deletePersonDeviceAuth](req: Request, res: Response) {
    console.log('req: ', req.body);
    const data = 1;
    if (data) {
      res.json(ResponseWarpper.success(data));
    } else {
      res.json(ResponseWarpper.failed('Not Found'));
    }
  },
  [getPersonLicenceInfo](req: Request, res: Response) {
    res.json(
      ResponseWarpper.success({
        licenceList: [
          {
            id: 1,
            passWayType: '1',
            value: 123211,
          },
        ],
      }),
    );
  },
  // eslint-disable-next-line max-lines-per-function
  [getLicenceInfo](req: Request, res: Response) {
    res.json(
      ResponseWarpper.success({
        licenceDetail: {
          id: 1,
          licenceNo: '321412',
          name: 'zs',
          phone: 15222222222,
          createTime: '2019-09-09 19:09',
        },
        deviceAuthList: [
          {
            id: 1,
            name: 'ceshi',
            authState: 1,
            authStateStr: '已授权',
            authStartDate: '2019-01-01',
            authEndDate: '2119-01-01',
          },
        ],
        personDetailList: [
          {
            personDetail: {
              type: '1',
              detailList: [
                {
                  id: 1,
                  address: '房屋地址',
                  authorizeExpireTime: '2019-09-09',
                  rentTime: '2019-09-09',
                  name: 'ceshi',
                  phone: '1522222222',
                  registerTime: '2019-09-09',
                  position: null,
                  type: '1',
                  typeStr: null,
                  remark: null,
                },
              ],
              passWayList: [
                {
                  id: 1,
                  passWayType: '1',
                  value: '123211',
                },
              ],
            },
          },
          {
            personDetail: {
              type: '1',
              detailList: [
                {
                  id: 1,
                  address: null,
                  authorizeExpireTime: null,
                  rentTime: null,
                  name: null,
                  phone: null,
                  registerTime: '2019-09-09',
                  position: '职业',
                  type: '4',
                  typeStr: null,
                  remark: '备注',
                },
              ],
              passWayList: [
                {
                  id: 1,
                  passWayType: '1',
                  value: '123211',
                },
              ],
            },
          },
          {
            personDetail: {
              type: '1',
              detailList: [
                {
                  id: 1,
                  address: null,
                  authorizeExpireTime: null,
                  rentTime: null,
                  name: null,
                  phone: null,
                  registerTime: '2019-09-09',
                  position: '职业',
                  type: '1',
                  typeStr: '快递员',
                  remark: '备注',
                },
              ],
              passWayList: [
                {
                  id: 1,
                  passWayType: '1',
                  value: '123211',
                },
              ],
            },
          },
        ],
      }),
    );
  },
  [getLicencePage](req: Request, res: Response) {
    res.json(
      ResponseWarpper.success({
        content: [
          {
            id: 73,
            licenceNo: '1321412',
            name: '张三',
            phone: 1522222222,
            createTime: '2019-08-01 19:15',
            authState: '1(授权状态)',
            authStateStr: '授权状态数据字典',
          },
          {
            id: 74,
            licenceNo: '1321412',
            name: '张三',
            phone: 1522222222,
            createTime: '2019-08-01 19:15',
            authState: '1(授权状态)',
            authStateStr: '授权状态数据字典',
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
        totalElements: 5,
        size: 10,
        number: 0,
        sort: {
          sorted: true,
          unsorted: false,
          empty: false,
        },
        numberOfElements: 5,
        first: true,
        empty: false,
      }),
    );
  },
};
