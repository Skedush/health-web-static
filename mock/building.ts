import { Request, Response } from 'express';
import { ResponseWarpper } from './_utils';
import api from '../src/services/api';

const {
  buildingPage,
  buildingAdd,
  buildingDelete,
  buildingUpdate,
  buildingList,
  getBuildingAndUnitTree,
  batchAddBuild,
} = api;

let list = [
  {
    code: '014',
    id: 1,
    unitCount: 0,
    houseCount: 0,
    buildDay: null,
  },
  {
    code: '013栋',
    id: 2,
    unitCount: 0,
    houseCount: 0,
    buildDay: null,
  },
  {
    code: '012栋',
    id: 3,
    unitCount: 0,
    houseCount: 0,
    buildDay: null,
  },
  {
    code: '011栋',
    id: 4,
    unitCount: 0,
    houseCount: 0,
    buildDay: null,
  },
  {
    code: '010栋',
    id: 5,
    unitCount: 0,
    houseCount: 0,
    buildDay: null,
  },
];

export default {
  [getBuildingAndUnitTree](req: Request, res: Response) {
    console.log('req: ', req.query);
    const data = [
      {
        id: 191,
        code: '1',
        name: '1栋',
        children: [
          {
            id: 11,
            code: '1',
            name: '1栋1单元',
          },
        ],
      },
      {
        id: 190,
        code: '3',
        name: '3栋',
        children: [
          {
            id: 109,
            code: '10',
            name: '3栋10单元',
          },
        ],
      },
    ];
    if (data) {
      res.json(ResponseWarpper.success(data));
    } else {
      res.json(ResponseWarpper.failed('Not Found'));
    }
  },
  [buildingUpdate](req: Request, res: Response) {
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
  [buildingDelete](req: Request, res: Response) {
    console.log('req: ', req.body);
    res.json(ResponseWarpper.success({}));
  },
  [buildingAdd](req: Request, res: Response) {
    console.log('req: ', req.body);

    res.json(ResponseWarpper.success({}));
  },

  [batchAddBuild](req: Request, res: Response) {
    console.log('req: ', req.body);

    res.json(ResponseWarpper.success({}));
  },

  [buildingPage](req: Request, res: Response) {
    const {
      query: { page, pageSize, code },
    } = req;
    let listDate: any[] = list;
    if (code) {
      listDate = list.filter(item => {
        return item.code.includes(code);
      });
    }
    const pageData = {
      content: listDate.slice(page * pageSize, page * pageSize + pageSize),
      pageable: {
        sort: {
          unsorted: false,
          sorted: true,
          empty: false,
        },
        offset: 0,
        pageNumber: page,
        pageSize,
        unpaged: false,
        paged: true,
      },
      totalPages: 1,
      last: true,
      totalElements: listDate.length,
      size: pageSize,
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

  [buildingList](req: Request, res: Response) {
    console.log('req: ', req.query);
    const data = [
      {
        id: 162,
        code: '1',
        name: '1栋',
        children: [
          {
            id: 87,
            code: '1',
            name: '1栋1单元',
          },
          { id: 89, code: 'A', name: '1栋A单元', children: [] },
        ],
      },
      {
        id: 181,
        code: '2',
        name: '2栋',
        children: [
          {
            id: 110,
            code: 'B',
            name: '2栋B单元',
            children: [{ id: 149, code: '102', name: '2栋-102室' }],
          },
        ],
      },
      { id: 182, code: '3', name: '3栋', children: [] },
      {
        id: 183,
        code: '4',
        name: '4栋',
        children: [{ id: 118, code: '2', name: '4栋2单元', children: [] }],
      },
      {
        id: 189,
        code: '5',
        name: '5栋',
        children: [
          {
            id: 111,
            code: '1',
            name: '5栋1单元',
          },
          {
            id: 128,
            code: '2',
            name: '5栋2单元',
          },
        ],
      },
      {
        id: 191,
        code: '7',
        name: '7栋',
        children: [
          { id: 122, code: '1', name: '7栋1单元', children: [] },
          { id: 123, code: '2', name: '7栋2单元', children: [] },
        ],
      },
      {
        id: 192,
        code: '8',
        name: '8栋',
        children: [
          {
            id: 124,
            code: '1',
            name: '8栋1单元',
            children: [
              { id: 422, code: '101', name: '8栋-101室' },
              { id: 423, code: '102', name: '8栋-102室' },
            ],
          },
          { id: 125, code: '2', name: '8栋2单元', children: [] },
        ],
      },
      {
        id: 194,
        code: '9',
        name: '9栋',
        children: [
          {
            id: 127,
            code: '1',
            name: '9栋1单元',
          },
          { id: 126, code: '3', name: '9栋3单元', children: [] },
        ],
      },
      { id: 193, code: '12', name: '12栋', children: [] },
    ];
    if (data) {
      res.json(ResponseWarpper.success(data));
    } else {
      res.json(ResponseWarpper.failed('Not Found'));
    }
  },
};
