import { Request, Response } from 'express';
import { ResponseWarpper } from './_utils';
import api from '../src/services/api';

const {
  unitPage,
  unitAdd,
  unitDelete,
  unitUpdate,
  setUnitMgmt,
  unitGet,
  unitImport,
  unitList,
} = api;

let list = [
  {
    id: 0,
    buildingCode: 'null',
    code: '01112',
    buildDay: null,
    liaisonName: null,
    liaisonPhone: null,
    houseCount: 0,
  },
  {
    id: 1,
    buildingCode: 'null',
    code: '0113',
    buildDay: null,
    liaisonName: null,
    liaisonPhone: null,
    houseCount: 0,
  },
  {
    id: 2,
    buildingCode: 'null',
    code: '0111',
    buildDay: null,
    liaisonName: null,
    liaisonPhone: null,
    houseCount: 0,
  },
];

export default {
  [unitUpdate](req: Request, res: Response) {
    const id: any = req.param('id');
    const code: any = req.param('code');
    list = list.map(item => {
      if (id === item.id) {
        return {
          ...item,
          code,
        };
      } else {
        return item;
      }
    });
    res.json(ResponseWarpper.success({}));
  },
  [unitDelete](req: Request, res: Response) {
    res.json(ResponseWarpper.success({}));
  },
  [unitAdd](req: Request, res: Response) {
    console.log('req: ', req.body);
    const data = { id: 11 };
    res.json(ResponseWarpper.success(data));
  },
  [unitImport](req: Request, res: Response) {
    console.log('req: ', req);
    res.json(ResponseWarpper.success({}));
  },
  [unitGet](req: Request, res: Response) {
    console.log('req: ', req.params);
    const data = {
      id: 6,
      buildingCode: '1',
      code: 'A',
      buildDay: '2018-12-12',
      liaisonName: '张三',
      liaisonPhone: '1389657567',
      aboveNum: 10,
      underNum: 2,
      doorCount: 2,
      elevatorCount: 2,
    };
    res.json(ResponseWarpper.success(data));
  },
  [setUnitMgmt](req: Request, res: Response) {
    console.log('req: ', req.body);

    res.json(ResponseWarpper.success({}));
  },
  [unitPage](req: Request, res: Response) {
    console.log('req: ', req.query);
    const pageData = {
      content: [
        {
          id: 1,
          buildingCode: '1栋',
          code: '01112',
          aboveNum: 10,
          underNum: 2,
          elevatorCount: 2,
          chargePersonName: '张三',
          houseCount: 0,
        },
        {
          id: 2,
          buildingCode: '1栋',
          code: '0113',
          aboveNum: 10,
          underNum: 2,
          elevatorCount: 2,
          chargePersonName: '张三',
          houseCount: 0,
        },
        {
          id: 3,
          buildingCode: '1栋',
          code: '0111',
          aboveNum: 10,
          underNum: 2,
          elevatorCount: 2,
          chargePersonName: '张三',
          houseCount: 0,
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
    if (pageData) {
      res.json(ResponseWarpper.success(pageData));
    } else {
      res.json(ResponseWarpper.failed('Not Found'));
    }
  },
  [unitList](req: Request, res: Response) {
    console.log('req: ', req.query);
    const data = {
      buildingCode: '1',
      buildingName: '1栋',
      unitCount: 2,
      unitList: [
        {
          id: 11,
          code: '1',
          name: '1单元',
          aboveNum: 10,
          underNum: 2,
          elevatorCount: 2,
          doorCount: 2,
          liaisonImage: 'http://192.168.70.45:8080/public//201911062004574.png',
          liaisonId: 42,
          liaisonName: '陈安乐',
          liaisonPhone: '15252525255',
        },
        {
          id: 12,
          code: '2',
          name: '2单元',
          aboveNum: 10,
          underNum: 2,
          elevatorCount: 2,
          doorCount: 2,
          liaisonImage: 'http://192.168.70.45:8080/public//201911062004574.png',
          liaisonId: 42,
          liaisonName: '陈安乐',
          liaisonPhone: '15252525255',
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
