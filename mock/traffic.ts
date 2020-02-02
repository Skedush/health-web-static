import { Request, Response } from 'express';
import { ResponseWarpper } from './_utils';
import api from '../src/services/api';

const { getPositionList, getPositionDeviceList, positionUnbind, positionBind } = api;
// const { apiPrefix } = Constant;

export default {
  // eslint-disable-next-line max-lines-per-function
  [getPositionList](req: Request, res: Response) {
    console.log('req: ', req.query);
    const data = {
      id: 1,
      name: '哈哈小区',
      type: '1',
      parentId: null,
      sort: 1,
      villageId: 1,
      children: [
        {
          id: 2,
          name: '1栋',
          type: '2',
          parentId: 1,
          sort: 1,
          villageId: 1,
          children: [
            {
              id: 6,
              name: '1单元',
              type: '3',
              parentId: 2,
              sort: 1,
              villageId: 1,
              children: [],
            },
            {
              id: 7,
              name: '2单元',
              type: '3',
              parentId: 2,
              sort: 2,
              villageId: 1,
              children: [],
            },
          ],
        },
        {
          id: 3,
          name: '2栋',
          type: '2',
          parentId: 1,
          sort: 2,
          villageId: 1,
          children: [
            {
              id: 8,
              name: '1单元',
              type: '3',
              parentId: 3,
              sort: 1,
              villageId: 1,
              children: [],
            },
            {
              id: 9,
              name: '2单元',
              type: '3',
              parentId: 3,
              sort: 2,
              villageId: 1,
              children: [],
            },
          ],
        },
        {
          id: 4,
          name: '东门出入口',
          type: '4',
          parentId: 1,
          sort: 3,
          villageId: 1,
          children: [],
        },
        {
          id: 5,
          name: '公共停车场',
          type: '5',
          parentId: 1,
          sort: 4,
          villageId: 1,
          children: [],
        },
      ],
    };
    if (data) {
      res.json(ResponseWarpper.success(data));
    } else {
      res.json(ResponseWarpper.failed('Not Found'));
    }
  },
  // 道闸
  [getPositionDeviceList](req: Request, res: Response) {
    console.log('req: ', req.body);
    const data = [
      {
        id: 191,
        name: '设备1',
        type: '2',
        typeStr: '门禁',
        status: 1,
        statusStr: '运行中',
      },
      {
        id: 192,
        name: '设备2',
        type: '2',
        typeStr: '门禁',
        status: 2,
        statusStr: '运行中',
      },
      {
        id: 193,
        name: '设备1',
        type: '1',
        typeStr: '道闸',
        status: 1,
        statusStr: '运行中',
      },
      {
        id: 194,
        name: '设备1',
        type: '1',
        typeStr: '道闸',
        status: 2,
        statusStr: '运行中',
      },
      {
        id: 195,
        name: '设备1',
        type: '1',
        typeStr: '道闸',
        status: 1,
        statusStr: '运行中',
      },
      {
        id: 196,
        name: '设备1',
        type: '1',
        typeStr: '道闸',
        status: 1,
        statusStr: '运行中',
      },
      {
        id: 197,
        name: '设备2',
        type: '2',
        typeStr: '门禁',
        status: 1,
        statusStr: '运行中',
      },
      {
        id: 198,
        name: '设备3',
        type: '2',
        typeStr: '门禁',
        status: 1,
        statusStr: '运行中',
      },
      {
        id: 199,
        name: '设备4',
        type: '2',
        typeStr: '门禁',
        status: 1,
        statusStr: '运行中',
      },
    ];
    if (data) {
      res.json(ResponseWarpper.success(data));
    } else {
      res.json(ResponseWarpper.failed('Not Found'));
    }
  },

  [positionUnbind](req: Request, res: Response) {
    const data = true;
    if (data) {
      res.json(ResponseWarpper.success(data));
    } else {
      res.json(ResponseWarpper.failed('Not Found'));
    }
  },

  [positionBind](req: Request, res: Response) {
    console.log('req: ', req);
    const data = {
      success: 2,
      error: 0,
      message: [],
    };
    if (data) {
      res.json(ResponseWarpper.success(data));
    } else {
      res.json(ResponseWarpper.failed('Not Found'));
    }
  },
};
