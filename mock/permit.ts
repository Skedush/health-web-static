import { Request, Response } from 'express';
import { ResponseWarpper } from './_utils';
import api from '../src/services/api';

const {
  getPermitList,
  addPermit,
  updatePermit,
  deletePermit,
  personBindingPermit,
  getPositionLists,
  personUnbindingPermit,
  carBindingPermit,
  carUnbindingPermit,
  modifyPersonPermitTime,
  modifyCarPermitTime,
  getPersonPermitList,
  getCarPermitList,
  updatePersonPermit,
  updateCarPermit,
  getPersonAuthBaseInfo,
  getCarAuthBaseInfo,
  deleteTodo,
  recoverPersonPermit,
  recoverCarPermit,
  getUncheckedPermitList,
  getSelectPermitList,
  updateAllPersonPermit,
  updateAllCarPermit,
  batchUpdatePersonPermit,
} = api;
// const { apiPrefix } = Constant;

export default {
  // eslint-disable-next-line max-lines-per-function
  [getPermitList](req: Request, res: Response) {
    const data = {
      success: true,
      code: 0,
      msg: null,
      ext: null,
      value: {
        content: [
          {
            id: 1,
            name: '通行证名字',
            customize: 1,
            type: '1',
            typeStr: '车辆通行证',
            expirationDate: '321',
            customizeDay: '312',
            passPositionList: [
              {
                passPositionId: '1',
                passPositionName: '通行点名字',
              },
              {
                passPositionId: '1',
                passPositionName: '通行点名字',
              },
            ],
          },
          {
            id: 1,
            name: '通行证名字',
            customize: 1,
            type: '1',
            typeStr: '车辆通行证',
            expirationDate: '321',
            customizeDay: '312',
            passPositionList: [
              {
                passPositionId: '1',
                passPositionName: '通行点名字',
              },
              {
                passPositionId: '1',
                passPositionName: '通行点名字',
              },
            ],
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
        totalElements: 5,
        size: 10,
        number: 0,
        sort: {
          sorted: true,
          unsorted: false,
          empty: false,
        },
        numberOfElements: 5,
        first: true,
        empty: false,
      },
    };
    res.json(ResponseWarpper.success(data));
  },
  [addPermit](req: Request, res: Response) {
    res.json(ResponseWarpper.success(true));
  },
  [updatePermit](req: Request, res: Response) {
    res.json(ResponseWarpper.success(true));
  },
  [deletePermit](req: Request, res: Response) {
    res.json(ResponseWarpper.success(true));
  },
  [personBindingPermit](req: Request, res: Response) {
    res.json(ResponseWarpper.success(true));
  },
  [getPositionLists](req: Request, res: Response) {
    res.json(ResponseWarpper.success([]));
  },
  [personUnbindingPermit](req: Request, res: Response) {
    res.json(ResponseWarpper.success(true));
  },
  [carBindingPermit](req: Request, res: Response) {
    res.json(ResponseWarpper.success(true));
  },
  [carUnbindingPermit](req: Request, res: Response) {
    res.json(ResponseWarpper.success(true));
  },
  [modifyPersonPermitTime](req: Request, res: Response) {
    res.json(ResponseWarpper.success(true));
  },
  [modifyCarPermitTime](req: Request, res: Response) {
    res.json(ResponseWarpper.success(true));
  },
  [getPersonPermitList](req: Request, res: Response) {
    res.json(ResponseWarpper.success([]));
  },
  [getCarPermitList](req: Request, res: Response) {
    res.json(ResponseWarpper.success([]));
  },
  [updatePersonPermit](req: Request, res: Response) {
    res.json(ResponseWarpper.success(true));
  },
  [updateCarPermit](req: Request, res: Response) {
    res.json(ResponseWarpper.success(true));
  },
  [getPersonAuthBaseInfo](req: Request, res: Response) {
    const data = {
      pmPassCardAuthList: [
        {
          id: 42,
          name: '物业通行证',
          authStartDate: '2020-01-19',
          authEndDate: '2020-01-26',
          state: null,
          passPositionList: [{ passPositionId: 119, passPositionName: '物业办公室' }],
        },
      ],
      personDetailList: [
        {
          type: '4',
          detailList: [
            {
              id: 86,
              personId: 709,
              address: null,
              authorizeExpireTime: null,
              rentTime: null,
              name: '蒙古自',
              phone: '13757736616',
              registerTime: '2020-01-19',
              position: '1',
              positionStr: '保安',
              remark: '',
              type: '4',
              typeStr: '物业人员',
              houseName: null,
              housePhone: null,
              buildingName: null,
            },
          ],
        },
      ],
      personLicenseNoAuthList: [
        {
          deviceName: '物业办公室门禁设备入口',
          authStartDate: '2020-01-19',
          authEndDate: '2020-01-26',
          state: '1',
          stateStr: '已授权',
        },
      ],
      pmPersonPassWayList: [{ id: 177, licenceId: 510, passWayType: '2', value: '24858008' }],
      personTypeList: [{ id: 86, type: '4', typeStr: '物业人员' }],
    };
    res.json(ResponseWarpper.success(data));
  },
  [getCarAuthBaseInfo](req: Request, res: Response) {
    const data = {
      passId: 157,
      code: '00000059',
      carId: 354,
      licensePlate: '浙C95022',
      name: '川省眉',
      phone: '15252521548',
      type: '4',
      typeStr: '其他车辆',
      createTime: '2020-01-19',
      parkingLotCarList: [
        {
          parkingLotName: '公共停车场',
          parkingLotType: '2',
          parkingLotTypeStr: '公共车位',
          parkingSpaceCarList: [],
        },
      ],
      deviceList: [],
      passCardList: [
        {
          id: 44,
          name: '车辆通行证物业',
          authStartDate: '2020-01-19',
          authEndDate: '2020-02-19',
          state: null,
          passPositionList: [
            { passPositionId: 131, passPositionName: '2单元' },
            { passPositionId: 130, passPositionName: '1单元' },
            { passPositionId: 129, passPositionName: '10栋' },
            { passPositionId: 128, passPositionName: '9栋' },
            { passPositionId: 127, passPositionName: '8栋' },
          ],
        },
      ],
    };
    res.json(ResponseWarpper.success(data));
  },
  [deleteTodo](req: Request, res: Response) {
    res.json(ResponseWarpper.success(true));
  },
  [recoverPersonPermit](req: Request, res: Response) {
    res.json(ResponseWarpper.success([]));
  },
  [recoverCarPermit](req: Request, res: Response) {
    res.json(ResponseWarpper.success([]));
  },
  [getUncheckedPermitList](req: Request, res: Response) {
    res.json(ResponseWarpper.success([]));
  },
  [getSelectPermitList](req: Request, res: Response) {
    res.json(ResponseWarpper.success([]));
  },
  [updateAllPersonPermit](req: Request, res: Response) {
    res.json(ResponseWarpper.success([]));
  },
  [updateAllCarPermit](req: Request, res: Response) {
    res.json(ResponseWarpper.success([]));
  },
  [batchUpdatePersonPermit](req: Request, res: Response) {
    res.json(ResponseWarpper.success([]));
  },
};
