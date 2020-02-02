import { Request, Response } from 'express';
import { ResponseWarpper } from './_utils';
import api from '../src/services/api';

const { getHelpFile } = api;
// const { apiPrefix } = Constant;

export default {
  // eslint-disable-next-line max-lines-per-function
  [getHelpFile](req: Request, res: Response) {
    console.log('req: ', req.query);
    const data = [
      {
        id: 1,
        icon: 'guide_village',
        image: '@/assets/images/help7.png',
        name: '小区基础信息录入',
        url: 'http://192.168.50.157:8000/static/loginImage.74180118.png',
      },
      {
        id: 2,
        icon: 'guide_person',
        image: '@/assets/images/help1.png',
        name: '人员登记使用指南',
        url: '"http://127.0.0.1:8080/public/person/common/201911221729433.png"',
      },
      {
        image: '@/assets/images/help2.png',
        name: '车辆登记使用指南',
        id: 3,
        url: '"http://127.0.0.1:8080/public/person/common/201911221729433.png"',
      },
      {
        image: '@/assets/images/help3.png',
        name: '人员通行证下发使用指南',
        id: 4,
        url: '"http://127.0.0.1:8080/public/person/common/201911221729433.png"',
      },
      {
        image: '@/assets/images/help6.png',
        name: '创建账号使用指南',
        url: '"http://127.0.0.1:8080/public/person/common/201911221729433.png"',
        id: 5,
      },
      {
        image: '@/assets/images/help5.png',
        name: '车辆通行证下发使用指南',
        id: 6,
        url: '"http://127.0.0.1:8080/public/person/common/201911221729433.png"',
      },
      {
        image: '@/assets/images/help4.png',
        name: '停车场使用指南',
        id: 7,
        url: '"http://127.0.0.1:8080/public/person/common/201911221729433.png"',
      },
    ];
    if (data) {
      res.json(ResponseWarpper.success(data));
    } else {
      res.json(ResponseWarpper.failed('Not Found'));
    }
  },
};
