import { Request, Response } from 'express';
import { ResponseWarpper } from './_utils';
import api from '../src/services/api';

const {
  housePage,
  houseAdd,
  houseDelete,
  houseUpdate,
  houseGet,
  setHouseHold,
  houseList,
  generateAddHouse,
  batchAddHouse,
} = api;

let list = [
  {
    id: 29,
    buildingCode: '0151',
    unitCode: '0113453453465',
    code: '54345',
    useType: 3,
    useTypeStr: '空置',
    floor: 0,
    householdCount: 0,
    personName: null,
    personPhone: null,
    houseUseTypeStr: '空置',
  },
  {
    id: 36,
    buildingCode: '0151',
    unitCode: '0113453453465',
    code: '3101',
    useType: 3,
    useTypeStr: '空置',
    floor: 3,
    householdCount: 0,
    personName: null,
    personPhone: null,
    houseUseTypeStr: '空置',
  },
  {
    id: 39,
    buildingCode: '0151',
    unitCode: '0113453453465',
    code: '3101',
    useType: 3,
    useTypeStr: '空置',
    floor: 3,
    householdCount: 0,
    personName: null,
    personPhone: null,
    houseUseTypeStr: '空置',
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
  [houseGet](req: Request, res: Response) {
    const data = {
      id: 8,
      buildingCode: '018',
      unitCode: '0114',
      code: '0173567356',
      useType: '3',
      useTypeStr: '空置',
      householdCount: 0,
      floor: 0,
      personName: '李四',
      personPhone: 157667676767,
      personDomicile: '浙江省温州市',
      personIdCard: '2345234534',
      houseUseTypeStr: '空置',
    };
    res.json(ResponseWarpper.success(data));
  },
  [houseUpdate](req: Request, res: Response) {
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
  [generateAddHouse](req: Request, res: Response) {
    const data = [
      { id: null, buildingId: 3, unitId: 5, code: '03', name: '03室', floor: 7 },
      { id: null, buildingId: 3, unitId: 5, code: '04', name: '04室', floor: 7 },
      { id: null, buildingId: 3, unitId: 5, code: '05', name: '05室', floor: 7 },
      { id: null, buildingId: 3, unitId: 5, code: '06', name: '06室', floor: 7 },
      { id: null, buildingId: 3, unitId: 5, code: '07', name: '07室', floor: 7 },
      { id: null, buildingId: 3, unitId: 5, code: '03', name: '03室', floor: 8 },
      { id: null, buildingId: 3, unitId: 5, code: '04', name: '04室', floor: 8 },
      { id: null, buildingId: 3, unitId: 5, code: '05', name: '05室', floor: 8 },
      { id: null, buildingId: 3, unitId: 5, code: '06', name: '06室', floor: 8 },
      { id: null, buildingId: 3, unitId: 5, code: '07', name: '07室', floor: 8 },
      { id: null, buildingId: 3, unitId: 5, code: '03', name: '03室', floor: 9 },
      { id: null, buildingId: 3, unitId: 5, code: '04', name: '04室', floor: 9 },
      { id: null, buildingId: 3, unitId: 5, code: '05', name: '05室', floor: 9 },
      { id: null, buildingId: 3, unitId: 5, code: '06', name: '06室', floor: 9 },
      { id: null, buildingId: 3, unitId: 5, code: '07', name: '07室', floor: 9 },
      { id: null, buildingId: 3, unitId: 5, code: '03', name: '03室', floor: 10 },
      { id: null, buildingId: 3, unitId: 5, code: '04', name: '04室', floor: 10 },
      { id: null, buildingId: 3, unitId: 5, code: '05', name: '05室', floor: 10 },
      { id: null, buildingId: 3, unitId: 5, code: '06', name: '06室', floor: 10 },
      { id: null, buildingId: 3, unitId: 5, code: '07', name: '07室', floor: 10 },
      { id: null, buildingId: 3, unitId: 5, code: '03', name: '03室', floor: 11 },
      { id: null, buildingId: 3, unitId: 5, code: '04', name: '04室', floor: 11 },
      { id: null, buildingId: 3, unitId: 5, code: '05', name: '05室', floor: 11 },
      { id: null, buildingId: 3, unitId: 5, code: '06', name: '06室', floor: 11 },
      { id: null, buildingId: 3, unitId: 5, code: '07', name: '07室', floor: 11 },
      { id: null, buildingId: 3, unitId: 5, code: '03', name: '03室', floor: 12 },
      { id: null, buildingId: 3, unitId: 5, code: '04', name: '04室', floor: 12 },
      { id: null, buildingId: 3, unitId: 5, code: '05', name: '05室', floor: 12 },
      { id: null, buildingId: 3, unitId: 5, code: '06', name: '06室', floor: 12 },
      { id: null, buildingId: 3, unitId: 5, code: '07', name: '07室', floor: 12 },
      { id: null, buildingId: 3, unitId: 5, code: '03', name: '03室', floor: 13 },
      { id: null, buildingId: 3, unitId: 5, code: '04', name: '04室', floor: 13 },
      { id: null, buildingId: 3, unitId: 5, code: '05', name: '05室', floor: 13 },
      { id: null, buildingId: 3, unitId: 5, code: '06', name: '06室', floor: 13 },
      { id: null, buildingId: 3, unitId: 5, code: '07', name: '07室', floor: 13 },
      { id: null, buildingId: 3, unitId: 5, code: '03', name: '03室', floor: 14 },
      { id: null, buildingId: 3, unitId: 5, code: '04', name: '04室', floor: 14 },
      { id: null, buildingId: 3, unitId: 5, code: '05', name: '05室', floor: 14 },
      { id: null, buildingId: 3, unitId: 5, code: '06', name: '06室', floor: 14 },
      { id: null, buildingId: 3, unitId: 5, code: '07', name: '07室', floor: 14 },
      { id: null, buildingId: 3, unitId: 5, code: '03', name: '03室', floor: 15 },
      { id: null, buildingId: 3, unitId: 5, code: '04', name: '04室', floor: 15 },
      { id: null, buildingId: 3, unitId: 5, code: '05', name: '05室', floor: 15 },
      { id: null, buildingId: 3, unitId: 5, code: '06', name: '06室', floor: 15 },
      { id: null, buildingId: 3, unitId: 5, code: '07', name: '07室', floor: 15 },
      { id: null, buildingId: 3, unitId: 5, code: '03', name: '03室', floor: 16 },
      { id: null, buildingId: 3, unitId: 5, code: '04', name: '04室', floor: 16 },
      { id: null, buildingId: 3, unitId: 5, code: '05', name: '05室', floor: 16 },
      { id: null, buildingId: 3, unitId: 5, code: '06', name: '06室', floor: 16 },
      { id: null, buildingId: 3, unitId: 5, code: '07', name: '07室', floor: 16 },
      { id: null, buildingId: 3, unitId: 5, code: '03', name: '03室', floor: 17 },
      { id: null, buildingId: 3, unitId: 5, code: '04', name: '04室', floor: 17 },
      { id: null, buildingId: 3, unitId: 5, code: '05', name: '05室', floor: 17 },
      { id: null, buildingId: 3, unitId: 5, code: '06', name: '06室', floor: 17 },
      { id: null, buildingId: 3, unitId: 5, code: '07', name: '07室', floor: 17 },
      { id: null, buildingId: 3, unitId: 5, code: '03', name: '03室', floor: 18 },
      { id: null, buildingId: 3, unitId: 5, code: '04', name: '04室', floor: 18 },
      { id: null, buildingId: 3, unitId: 5, code: '05', name: '05室', floor: 18 },
      { id: null, buildingId: 3, unitId: 5, code: '06', name: '06室', floor: 18 },
      { id: null, buildingId: 3, unitId: 5, code: '07', name: '07室', floor: 18 },
      { id: null, buildingId: 3, unitId: 5, code: '03', name: '03室', floor: 19 },
      { id: null, buildingId: 3, unitId: 5, code: '04', name: '04室', floor: 19 },
      { id: null, buildingId: 3, unitId: 5, code: '05', name: '05室', floor: 19 },
      { id: null, buildingId: 3, unitId: 5, code: '06', name: '06室', floor: 19 },
      { id: null, buildingId: 3, unitId: 5, code: '07', name: '07室', floor: 19 },
      { id: null, buildingId: 3, unitId: 5, code: '03', name: '03室', floor: 20 },
      { id: null, buildingId: 3, unitId: 5, code: '04', name: '04室', floor: 20 },
      { id: null, buildingId: 3, unitId: 5, code: '05', name: '05室', floor: 20 },
      { id: null, buildingId: 3, unitId: 5, code: '06', name: '06室', floor: 20 },
      { id: null, buildingId: 3, unitId: 5, code: '07', name: '07室', floor: 20 },
      { id: null, buildingId: 3, unitId: 5, code: '03', name: '03室', floor: 21 },
      { id: null, buildingId: 3, unitId: 5, code: '04', name: '04室', floor: 21 },
      { id: null, buildingId: 3, unitId: 5, code: '05', name: '05室', floor: 21 },
      { id: null, buildingId: 3, unitId: 5, code: '06', name: '06室', floor: 21 },
      { id: null, buildingId: 3, unitId: 5, code: '07', name: '07室', floor: 21 },
      { id: null, buildingId: 3, unitId: 5, code: '03', name: '03室', floor: 22 },
      { id: null, buildingId: 3, unitId: 5, code: '04', name: '04室', floor: 22 },
      { id: null, buildingId: 3, unitId: 5, code: '05', name: '05室', floor: 22 },
      { id: null, buildingId: 3, unitId: 5, code: '06', name: '06室', floor: 22 },
      { id: null, buildingId: 3, unitId: 5, code: '07', name: '07室', floor: 22 },
    ];
    res.json(ResponseWarpper.success(data));
  },
  [houseDelete](req: Request, res: Response) {
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
  [houseAdd](req: Request, res: Response) {
    const addData = req.body;
    addData.id = ++currentId;
    list.push(addData);
    res.json(ResponseWarpper.success({}));
  },
  [setHouseHold](req: Request, res: Response) {
    console.log('req.body: ', req.body);
    res.json(ResponseWarpper.success({}));
  },
  [batchAddHouse](req: Request, res: Response) {
    console.log('req.body: ', req.body);
    res.json(ResponseWarpper.success({}));
  },

  [housePage](req: Request, res: Response) {
    const {
      query: { page, size, buildingCode, unitCode },
    } = req;
    let listDate: any[] = list;
    listDate = queryList('buildingCode', buildingCode, listDate);
    listDate = queryList('unitCode', unitCode, listDate);
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

  [houseList](req: Request, res: Response) {
    console.log('req.query: ', req.query);
    const data = {
      unitCode: '1',
      unitName: '1栋1单元',
      floorCount: '10',
      houseCount: '3',
      houseList: [
        {
          id: 142,
          code: '11',
          name: '2-11室',
          floor: 2,
          useType: '3',
          useTypeStr: '空置',
          householdCount: 0,
          personName: '123',
        },
        {
          id: 140,
          code: '8',
          name: '2-8室',
          floor: 2,
          useType: '2',
          useTypeStr: '出租',
          householdCount: 0,
          personName: '水电费',
        },
        {
          id: 137,
          code: '3',
          name: '2-3室',
          floor: 2,
          useType: '1',
          useTypeStr: '自住',
          householdCount: 0,
          personName: '公司的人',
        },
      ],
    };
    if (data) {
      res.json(ResponseWarpper.success(data));
    } else {
      res.json(ResponseWarpper.failed('Not Found'));
    }
  },
};
