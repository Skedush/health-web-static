import { Request, Response } from 'express';
import { ResponseWarpper } from './_utils';
import api from '../src/services/api';

const {
  parkingList,
  getParkingCarList,
  getNotInParkingCar,
  bindingParkingForCar,
  unbindingParkingForCar,
  getCarForId,
  updateParkingSetting,
  addParkingItem,
  getParkingById,
  deleteParking,
  getParkingItem,
} = api;
// const { apiPrefix } = Constant;

export default {
  // eslint-disable-next-line max-lines-per-function
  [parkingList](req: Request, res: Response) {
    console.log('req: ', req.query);
    const data = [
      { id: 1, name: '固定停车场', fee: '0', feeStr: '否', type: '1', typeStr: '固定车位' },
      { id: 2, name: '公共停车场', fee: '0', feeStr: '否', type: '2', typeStr: '公共车位' },
    ];
    if (data) {
      res.json(ResponseWarpper.success(data));
    } else {
      res.json(ResponseWarpper.failed('Not Found'));
    }
  },

  // eslint-disable-next-line max-lines-per-function
  [getParkingItem](req: Request, res: Response) {
    console.log('req: ', req.query);
    const data = {
      content: [
        {
          code: '1',
          parkingState: '1',
          parkingStateStr: '未停车',
          startTime: null,
          endTime: null,
          saleState: '1',
          saleStateStr: '未租售',
          carCount: 0,
          carList: null,
          parkingSpaceId: 1,
          authEnd: false,
          name: null,
          phone: null,
        },
        {
          code: '2',
          parkingState: '1',
          parkingStateStr: '未停车',
          startTime: '2019-12-17',
          endTime: '2119-12-17',
          saleState: '2',
          saleStateStr: '销售',
          carCount: 1,
          carList: ['浙C26KZ0'],
          parkingSpaceId: 2,
          authEnd: false,
          name: '234',
          phone: '14353534321',
        },
        {
          code: '3',
          parkingState: '1',
          parkingStateStr: '未停车',
          startTime: null,
          endTime: null,
          saleState: '1',
          saleStateStr: '未租售',
          carCount: 0,
          carList: null,
          parkingSpaceId: 3,
          authEnd: false,
          name: null,
          phone: null,
        },
        {
          code: '4',
          parkingState: '1',
          parkingStateStr: '未停车',
          startTime: null,
          endTime: null,
          saleState: '1',
          saleStateStr: '未租售',
          carCount: 0,
          carList: null,
          parkingSpaceId: 4,
          authEnd: false,
          name: null,
          phone: null,
        },
        {
          code: '5',
          parkingState: '1',
          parkingStateStr: '未停车',
          startTime: null,
          endTime: null,
          saleState: '1',
          saleStateStr: '未租售',
          carCount: 0,
          carList: null,
          parkingSpaceId: 5,
          authEnd: false,
          name: null,
          phone: null,
        },
        {
          code: '6',
          parkingState: '1',
          parkingStateStr: '未停车',
          startTime: null,
          endTime: null,
          saleState: '1',
          saleStateStr: '未租售',
          carCount: 0,
          carList: null,
          parkingSpaceId: 6,
          authEnd: false,
          name: null,
          phone: null,
        },
        {
          code: '7',
          parkingState: '1',
          parkingStateStr: '未停车',
          startTime: null,
          endTime: null,
          saleState: '1',
          saleStateStr: '未租售',
          carCount: 0,
          carList: null,
          parkingSpaceId: 7,
          authEnd: false,
          name: null,
          phone: null,
        },
        {
          code: '8',
          parkingState: '1',
          parkingStateStr: '未停车',
          startTime: null,
          endTime: null,
          saleState: '1',
          saleStateStr: '未租售',
          carCount: 0,
          carList: null,
          parkingSpaceId: 8,
          authEnd: false,
          name: null,
          phone: null,
        },
      ],
      pageable: {
        sort: {
          unsorted: false,
          sorted: true,
          empty: false,
        },
        pageNumber: 0,
        pageSize: 10,
        offset: 0,
        unpaged: true,
        paged: true,
      },
      totalPages: 0,
      totalElements: 12,
      last: true,
      first: true,
      sort: {
        unsorted: true,
        sorted: true,
        empty: true,
      },
      numberOfElements: 12,
      size: 12,
      number: 0,
      empty: true,
    };

    if (data) {
      res.json(ResponseWarpper.success(data));
    } else {
      res.json(ResponseWarpper.failed('Not Found'));
    }
  },

  [getNotInParkingCar](req: Request, res: Response) {
    console.log('req111111111: ', req.query);
    const data = {
      content: [
        {
          licensePlate: 'string',
          name: 'string',
          phone: 'string',
          brand: 'string',
          color: 'string',
          spec: 'string',
          checkDate: '2019-11-14T07:09:54.618Z',
          type: 'string',
          typeStr: 'string',
          commentContent: 'string',
          carId: 0,
        },
      ],
      pageable: {
        sort: {
          unsorted: false,
          sorted: true,
          empty: false,
        },
        pageNumber: 0,
        pageSize: 10,
        offset: 0,
        unpaged: true,
        paged: true,
      },
      totalPages: 0,
      totalElements: 12,
      last: true,
      first: true,
      sort: {
        unsorted: true,
        sorted: true,
        empty: true,
      },
      numberOfElements: 12,
      size: 12,
      number: 0,
      empty: true,
    };

    if (data) {
      res.json(ResponseWarpper.success(data));
    } else {
      res.json(ResponseWarpper.failed('Not Found'));
    }
  },

  [getParkingCarList](req: Request, res: Response) {
    console.log('req222222222: ', req.query);
    const data = {
      content: [
        {
          licensePlate: '浙C99999',
          name: '建省三',
          phone: '15252521548',
          brand: '未知',
          color: '未知',
          type: '4',
          typeStr: '其他车辆',
          carId: 208,
        },
        {
          licensePlate: '浙C32435',
          name: '234',
          phone: '14363453243',
          brand: '未知',
          color: '未知',
          type: '1',
          typeStr: '业主车辆',
          carId: 207,
        },
        {
          licensePlate: '浙C53421',
          name: '234',
          phone: '14353534321',
          brand: '未知',
          color: '未知',
          type: '1',
          typeStr: '业主车辆',
          carId: 206,
        },
        {
          licensePlate: '浙C46345',
          name: '543',
          phone: '15443535353',
          brand: '未知',
          color: '未知',
          type: '2',
          typeStr: '物业车辆',
          carId: 205,
        },
        {
          licensePlate: '浙C42355',
          name: '5325',
          phone: '15745543534',
          brand: '未知',
          color: '未知',
          type: '1',
          typeStr: '业主车辆',
          carId: 204,
        },
        {
          licensePlate: '藏F23532',
          name: 'we',
          phone: '14574355434',
          brand: '未知',
          color: '未知',
          type: '1',
          typeStr: '业主车辆',
          carId: 203,
        },
      ],
      pageable: {
        sort: {
          unsorted: false,
          sorted: true,
          empty: false,
        },
        pageNumber: 0,
        pageSize: 0,
        offset: 0,
        unpaged: true,
        paged: true,
      },
      totalPages: 0,
      totalElements: 0,
      last: true,
      first: true,
      sort: {
        unsorted: true,
        sorted: true,
        empty: true,
      },
      numberOfElements: 0,
      size: 0,
      number: 0,
      empty: true,
    };
    if (data) {
      res.json(ResponseWarpper.success(data));
    } else {
      res.json(ResponseWarpper.failed('Not Found'));
    }
  },

  [getCarForId](req: Request, res: Response) {
    console.log('req: ', req.query);
    const data = {
      personId: 1,
      carId: 1,
      licensePlate: '浙C12322',
      ownerName: '老王',
      brand: '丰田',
      color: '黄色',
      ownerPhone: '15224005566',
      type: '1',
      typeStr: '业主车辆',
      carVillageId: 1,
      remark: '备注',
    };
    if (data) {
      res.json(ResponseWarpper.success(data));
    } else {
      res.json(ResponseWarpper.failed('Not Found'));
    }
  },

  [bindingParkingForCar](req: Request, res: Response) {
    console.log('req: ', req.body);
    const data = {
      success: 4,
      error: 0,
      message: '',
    };
    if (data) {
      res.json(ResponseWarpper.success(data));
    } else {
      res.json(ResponseWarpper.failed('Not Found'));
    }
  },

  [unbindingParkingForCar](req: Request, res: Response) {
    console.log('req: ', req.body);
    const data = 1;
    if (data) {
      res.json(ResponseWarpper.success(data));
    } else {
      res.json(ResponseWarpper.failed('Not Found'));
    }
  },

  [updateParkingSetting](req: Request, res: Response) {
    console.log('req: ', req.body);
    const data = 1;
    if (data) {
      res.json(ResponseWarpper.success(data));
    } else {
      res.json(ResponseWarpper.failed('Not Found'));
    }
  },

  [addParkingItem](req: Request, res: Response) {
    console.log('req: ', req.body);
    const data = 1;
    if (data) {
      res.json(ResponseWarpper.success(data));
    } else {
      res.json(ResponseWarpper.failed('Not Found'));
    }
  },

  [deleteParking](req: Request, res: Response) {
    console.log('req: ', req.body);
    const data = 1;
    if (data) {
      res.json(ResponseWarpper.success(data));
    } else {
      res.json(ResponseWarpper.failed('Not Found'));
    }
  },

  [getParkingById](req: Request, res: Response) {
    console.log('req: ', req.body);
    const data = {
      id: 1,
      name: '名字',
      fee: '1',
      feeStr: '是',
      type: '2',
      typeStr: '公共停车位',
    };
    if (data) {
      res.json(ResponseWarpper.success(data));
    } else {
      res.json(ResponseWarpper.failed('Not Found'));
    }
  },
};
