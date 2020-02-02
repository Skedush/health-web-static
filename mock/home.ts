/* eslint-disable max-lines-per-function */
import { Request, Response } from 'express';
import { ResponseWarpper } from './_utils';
import api from '../src/services/api';

const { getHomeQuickEntry, getAdministrator, getHomeTableList } = api;
// const { apiPrefix } = Constant;

export default {
  [getHomeQuickEntry](req: Request, res: Response) {
    console.log('req: ', req.query);
    const data = {
      communityName: '天鹅湖小区',
      communityId: 1,
      communityDescribe: '大伟家',
      houseRegistration: '住户登记',
      houseId: 1,
      houseDescribe: '陈大伟',
      carRegistration: '车辆登记',
      carId: 1,
      carDescribe:
        '大伟的车，别看了你买不起,大伟的车，别看了你买不起大伟的车，别看了你买不起大伟的车，别看了你买不起',
      accessAuthorization: '门禁授权',
      accessID: 1,
      accessDescribe: '啦啦啦啦啦啦',
      carAuthorization: '车辆授权',
      carAuthorizationId: 1,
      carAuthorizationDescribe: '嘿嘿嘿嘿',
    };
    if (data) {
      res.json(ResponseWarpper.success(data));
    } else {
      res.json(ResponseWarpper.failed('Not Found'));
    }
  },

  [getAdministrator](req: Request, res: Response) {
    const data = {
      id: 1,
      name: '嘉晟锦苑',
      houseCount: 326,
      householdCount: 764,
      carCount: 244,
    };
    if (data) {
      res.json(ResponseWarpper.success(data));
    } else {
      res.json(ResponseWarpper.failed('Not Found'));
    }
  },

  [getHomeTableList](req: Request, res: Response) {
    const data = [
      {
        id: 10,
        name: '张军',
        type: '1',
        value: '住户',
        address: '测试单位02居民单元1203',
        messageType: 1,
        message: '租户到期',
        time: '2019-05-25 00:00:00',
      },
      {
        id: 9,
        name: '宋新',
        type: '1',
        value: '住户',
        address: '二栋二单元1502',
        messageType: 1,
        message: '租户到期',
        time: '2019-05-25 00:00:00',
      },
      {
        id: 8,
        name: '张凯博',
        type: '1',
        value: '住户',
        address: '测试单位02居民单元1805',
        messageType: 1,
        message: '租户到期',
        time: '2019-05-25 00:00:00',
      },
      {
        id: 7,
        name: '霍明伟',
        type: '1',
        value: '住户',
        address: '二栋一单元1203',
        messageType: 1,
        message: '租户到期',
        time: '2019-05-25 00:00:00',
      },
      {
        id: 6,
        name: '韩超',
        type: '1',
        value: '住户',
        address: '测试单位02居民单元1203',
        messageType: 1,
        message: '租户到期',
        time: '2019-05-25 00:00:00',
      },
      {
        id: 5,
        name: '李鑫',
        type: '1',
        value: '住户',
        address: '测试单位02居民单元1805',
        messageType: 1,
        message: '租户到期',
        time: '2019-05-25 00:00:00',
      },
      {
        id: 4,
        name: '韩建霞',
        type: '1',
        value: '住户',
        address: '二栋二单元1502',
        messageType: 1,
        message: '租户到期',
        time: '2019-05-25 00:00:00',
      },
      {
        id: 3,
        name: '津A12345',
        type: '1',
        value: '业主车辆',
        address: null,
        messageType: 2,
        message: '车辆授权到期',
        time: '2019-01-01 00:00:00',
      },
      {
        id: 2,
        name: '浙C864AK',
        type: '1',
        value: '业主车辆',
        address: null,
        messageType: 2,
        message: '车辆授权到期',
        time: '2019-01-01 00:00:00',
      },
      {
        id: 1,
        name: '123',
        type: '3',
        value: '访客机',
        address: '',
        messageType: 3,
        message: '设备告警',
        time: '2019-01-04 00:00:00',
      },
      {
        id: 11,
        name: '访客机',
        type: '3',
        value: '2',
        address: '',
        messageType: 3,
        message: '设备告警',
        time: '2019-01-07 00:00:00',
      },
      {
        id: 12,
        name: '门禁机',
        type: '2',
        value: '车辆道闸',
        address: '',
        messageType: 3,
        message: '设备告警',
        time: '2019-01-08 00:00:00',
      },
    ];
    if (data) {
      res.json(ResponseWarpper.success(data));
    } else {
      res.json(ResponseWarpper.failed('Not Found'));
    }
  },
  // [deleteCommunityPerson](req: Request, res: Response) {
  //   console.log('req: ', req);
  //   const data = 1;
  //   if (data) {
  //     res.json(ResponseWarpper.success(data));
  //   } else {
  //     res.json(ResponseWarpper.failed('Not Found'));
  //   }
  // },
};
