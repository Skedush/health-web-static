import { Request, Response } from 'express';
import { ResponseWarpper } from './_utils';
import api from '../src/services/api';

const { getCarPass, getCarPassById, updateCarPassAuth } = api;
// const { apiPrefix } = Constant;

export default {
  // eslint-disable-next-line max-lines-per-function
  [getCarPass](req: Request, res: Response) {
    console.log('req: ', req.query);
    const data = {
      content: [
        {
          id: 1,
          carId: 0,
          authState: '1',
          authStateStr: '未授权',
          licensePlate: '浙c1231',
          code: '352343534',
          name: '张三',
          phone: '15666669999',
          createTime: '2013-12-23',
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

  [getCarPassById](req: Request, res: Response) {
    console.log('req: ', req.params);
    const data = {
      passId: 1,
      code: '11111111',
      carId: 1,
      licensePlate: '浙C12322',
      name: '老王',
      phone: '15224005566',
      type: '1',
      typeStr: '业主车辆',
      createTime: '2019-01-01',
      parkingLotCarList: [
        {
          parkingName: '停车场1',
          parkingLotType: '1',
          parkingLotTypeStr: '固定停车场',
          parkingSpcaeCarList: [
            { code: 'A1-1', authStartDate: '2019-5-12', authEndDate: '2019-9-23' },
          ],
        },
        {
          parkingName: '停车场2',
          parkingLotType: '1',
          parkingLotTypeStr: '固定停车场',
          parkingSpcaeCarList: [
            { code: 'A1-1', authStartDate: '2019-5-12', authEndDate: '2019-9-23' },
          ],
        },
        {
          parkingName: '停车场3',
          parkingLotType: '1',
          parkingLotTypeStr: '固定停车场',
          parkingSpcaeCarList: [
            { code: 'A1-1', authStartDate: '2019-5-12', authEndDate: '2019-9-23' },
          ],
        },
      ],
      deviceList: [
        {
          deviceName: '大门道闸1',
          authStartDate: '2011-06-23',
          authEndDate: '2020-10-12',
          authState: '2',
          authStateStr: '已授权',
        },
        {
          deviceName: '大门道闸2',
          authStartDate: '2011-06-23',
          authEndDate: '2020-10-12',
          authState: '2',
          authStateStr: '已授权',
        },
        {
          deviceName: '大门道闸3',
          authStartDate: '2011-06-23',
          authEndDate: '2020-10-12',
          authState: '2',
          authStateStr: '已授权',
        },
      ],
    };
    if (data) {
      res.json(ResponseWarpper.success(data));
    } else {
      res.json(ResponseWarpper.failed('Not Found'));
    }
  },

  [updateCarPassAuth](req: Request, res: Response) {
    console.log('req: ', req.body);
    const data = { success: 2, error: 1, message: '错误1' };
    if (data) {
      res.json(ResponseWarpper.success(data));
    } else {
      res.json(ResponseWarpper.failed('Not Found'));
    }
  },
};
