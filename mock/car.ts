import { Request, Response } from 'express';
import { ResponseWarpper } from './_utils';
import api from '../src/services/api';

const { carPage, carAdd, carDelete, carUpdate, getCarProvince, getCarArea } = api;

let list = [
  {
    ownerName: '陈二狗',
    type: '业主车辆',
    licensePlate: '浙C172326',
    brand: '陈二狗',
    color: '业主车辆',
    checkDate: '2019-09-09T06:05:05.903Z',
    id: 4,
    spec: '浙C17232',
  },
  {
    ownerName: '陈二狗',
    type: '业主车辆',
    licensePlate: '浙C172325',
    id: 1,
    checkDate: '2019-09-09T06:05:05.903Z',
    brand: '陈二狗',
    color: '业主车辆',
    spec: '浙C17232',
  },
  {
    ownerName: '陈二狗',
    type: '业主车辆',
    id: 2,
    licensePlate: '浙C172321',
    brand: '陈二狗',
    color: '业主车辆',
    checkDate: '2019-09-09T06:05:05.903Z',
    spec: '浙C17232',
  },
  {
    ownerName: '陈二狗',
    id: 3,
    type: '业主车辆',
    licensePlate: '浙C172323',
    brand: '陈二狗',
    checkDate: '2019-09-09T06:05:05.903Z',
    color: '业主车辆',
    spec: '浙C17232',
  },
];

function queryList(field, value, list: any[]) {
  if (list) {
    list.filter(item => {
      return item[field] ? item[field].includes(value) : true;
    });
    return list;
  } else {
    return list;
  }
}

let currentId: number = 5;

export default {
  [getCarProvince](req: Request, res: Response) {
    console.log('req: ', req.query);
    const data = [
      '辽',
      '宁',
      '青',
      '黑',
      '苏',
      '京',
      '皖',
      '云',
      '空',
      '湘',
      '陕',
      '晋',
      '渝',
      '闽',
      '川',
      '藏',
      '新',
      '军',
      '冀',
      '海',
      '赣',
      '浙',
      '贵',
      '津',
      '甘',
      '鄂',
      '沪',
      '粤',
      '蒙',
      '鲁',
      '豫',
      '桂',
      'WJ01',
      '琼',
      '吉',
    ];
    if (data) {
      res.json(ResponseWarpper.success(data));
    } else {
      res.json(ResponseWarpper.failed('Not Found'));
    }
  },

  [getCarArea](req: Request, res: Response) {
    console.log('req: ', req.query);
    const data = [
      'A',
      'B',
      'C',
      'D',
      'E',
      'F',
      'G',
      'H',
      'J',
      'K',
      'L',
      'M',
      'N',
      'P',
      'Q',
      'R',
      'S',
      'T',
      'U',
      'V',
      'W',
      'X',
      'Y',
      'Z',
    ];

    if (data) {
      res.json(ResponseWarpper.success(data));
    } else {
      res.json(ResponseWarpper.failed('Not Found'));
    }
  },

  [carUpdate](req: Request, res: Response) {
    const editData = req.body;
    list = list.map(item => {
      if (editData.id === item.id) {
        return editData;
      } else {
        return item;
      }
    });
    res.json(ResponseWarpper.success({}));
  },
  [carDelete](req: Request, res: Response) {
    const ids = req.body;
    const data: any[] = [];
    list.forEach(item => {
      if (!(ids.indexOf(item.id) > -1)) {
        data.push(item);
      }
    });
    list = data;
    res.json(ResponseWarpper.success({}));
  },
  [carAdd](req: Request, res: Response) {
    const addData = req.body;
    addData.id = ++currentId;
    list.push(addData);
    res.json(ResponseWarpper.success({}));
  },
  [carPage](req: Request, res: Response) {
    const {
      query: { page, size, licensePlate, ownerName, type },
    } = req;
    let listDate: any[] = list;
    listDate = queryList('licensePlate', licensePlate, listDate);
    listDate = queryList('ownerName', ownerName, listDate);
    listDate = queryList('type', type, listDate);
    console.log(listDate);
    const pageData = {
      content: listDate.slice(+page * +size, +page * +size + +size),
      pageable: {
        sort: {
          unsorted: false,
          sorted: true,
          empty: false,
        },
        offset: 0,
        pageNumber: page,
        pageSize: size,
        unpaged: false,
        paged: true,
      },
      totalPages: 1,
      last: true,
      totalElements: listDate.length,
      size,
      number: 0,
      numberOfElements: 4,
      first: true,
      sort: {
        unsorted: false,
        sorted: true,
        empty: false,
      },
      empty: false,
    };
    if (pageData) {
      res.json(ResponseWarpper.success(pageData));
    } else {
      res.json(ResponseWarpper.failed('Not Found'));
    }
  },
};
