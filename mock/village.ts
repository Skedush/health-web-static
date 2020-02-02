import { Request, Response } from 'express';
import { ResponseWarpper } from './_utils';
import api from '../src/services/api';

const { villageInfo, updateVillageInfo } = api;

const data = {
  image: 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png', // 场景照
  name: 'cc嘉园', // 小区名
  buildDay: '2019-03-03 19:23:20', // 小区建设时间
  construction: '12', // 承建商
  constructionPhone: '12323424853', // 承建商电话
  operate: '23', // 运营商
  operatePhone: '18324343434', // 运营商电话
  city: '1', // 市
  province: '2', // 省
  county: '1', // 区
  address: '瑶溪街道', // 详细地址
  policeImage: 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png', // 民警照片
  policeAddress: '温州鹿城惠民路', // 民警地址
  policeCompany: '惠民路警所', // 民警单位
  policeName: '梁可可',
  policePhone: '15669739697',
  policeCode: '222222', // 民警号
};

export default {
  [updateVillageInfo](req: Request, res: Response) {
    const data = req.params;
    console.log(data);
    // {
    //   "image": "http://lkk.png",
    //   "name": "cc嘉园",
    //   "provinceId": " 浙江省",
    //   'buildDay': '2019-03-03 19:23:20',
    //   "cityId": "温州市",
    //   "countyId": "龙湾区",
    //   "address": "瑶溪街道",
    //   "construction": "cc承建商",
    //   "constructionPhone": "cc承建商联系方式",
    //   "operate": "cc运营商",
    //   "operatePhone": "cc运营商联系方式"
    // }
  },
  [villageInfo](req: Request, res: Response) {
    res.json(ResponseWarpper.success(data));
  },
};
