import { Request, Response } from 'express';
import { ResponseWarpper } from './_utils';
import api from '../src/services/api';

const {
  personAdd,
  personPage,
  personUpdate,
  logoutPerson,
  personCheck,
  buildingList,
  carAdd,
  personImport,
  personTemplateDownload,
  icCardAdd,
  icCardDelete,
  icCardInfo,
  getCarProvince,
  getCarArea,
  addChild,
  editChild,
  deleteChild,
  icCardIssued,
  addProperty,
  addProvisional,
  updateAuthCar,
  issuedCarAuthTime,
  updateProperty,
  updateProvisional,
  getAuthTime,
  getWard,
  getCountryList,
  parkingList,
  reletPerson,
  getPersonLicenceInfo,
} = api;
// const { apiPrefix } = Constant;

export default {
  // eslint-disable-next-line max-lines-per-function
  [personPage](req: Request, res: Response) {
    const data = {
      content: [
        {
          authorizeExpireTime: '2019-11-21',
          birthday: '2019-11-21',
          bpImageUrl: null,
          buildingCode: '3',
          buildingId: 191,
          checkDate: null,
          domicile: 'rwerwewet',
          foreign: false,
          guardianId: null,
          guardianName: null,
          houseCode: '18',
          houseId: 139,
          idCard: '5134**********4605',
          name: '43234',
          nation: 'wrewr',
          nationality: '中国',
          occupation: '',
          occupationStr: '',
          personId: 410,
          personVillageId: 448,
          phone: '15463445445',
          remark: '',
          rentTime: '2019-11-07',
          sex: '1',
          subId: 405,
          tCreateTime: '2019-11-20 17:02:08',
          tcreateTime: '2019-11-20T17:02:08',
          temporaryResidencePermit: null,
          type: '2',
          typeStr: '租户',
          unitCode: '2',
          unitId: 110,
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
    if (data) {
      res.json(ResponseWarpper.success(data));
    } else {
      res.json(ResponseWarpper.failed('Not Found'));
    }
  },

  [personAdd](req: Request, res: Response) {
    res.json(ResponseWarpper.success(true));
  },
  [personUpdate](req: Request, res: Response) {
    res.json(ResponseWarpper.success(true));
  },
  [logoutPerson](req: Request, res: Response) {
    res.json(ResponseWarpper.success(true));
  },
  [addChild](req: Request, res: Response) {
    res.json(ResponseWarpper.success(true));
  },
  [editChild](req: Request, res: Response) {
    res.json(ResponseWarpper.success(true));
  },
  [deleteChild](req: Request, res: Response) {
    res.json(ResponseWarpper.success(true));
  },
  [personCheck](req: Request, res: Response) {
    res.json(ResponseWarpper.success(true));
  },
  [buildingList](req: Request, res: Response) {
    res.json(ResponseWarpper.success([]));
  },
  [carAdd](req: Request, res: Response) {
    res.json(ResponseWarpper.success(true));
  },
  [personImport](req: Request, res: Response) {
    res.json(ResponseWarpper.success(true));
  },
  [personTemplateDownload](req: Request, res: Response) {
    res.json(ResponseWarpper.success([]));
  },
  [icCardAdd](req: Request, res: Response) {
    res.json(ResponseWarpper.success({}));
  },
  [icCardDelete](req: Request, res: Response) {
    res.json(ResponseWarpper.success(true));
  },
  [icCardInfo](req: Request, res: Response) {
    res.json(ResponseWarpper.success({}));
  },
  [getCarProvince](req: Request, res: Response) {
    res.json(ResponseWarpper.success({}));
  },
  [getCarArea](req: Request, res: Response) {
    res.json(ResponseWarpper.success([]));
  },
  [icCardIssued](req: Request, res: Response) {
    res.json(ResponseWarpper.success([]));
  },
  [addProperty](req: Request, res: Response) {
    res.json(ResponseWarpper.success({}));
  },
  [addProvisional](req: Request, res: Response) {
    res.json(ResponseWarpper.success({}));
  },
  [updateAuthCar](req: Request, res: Response) {
    res.json(ResponseWarpper.success(true));
  },
  [issuedCarAuthTime](req: Request, res: Response) {
    res.json(ResponseWarpper.success(true));
  },
  [updateProperty](req: Request, res: Response) {
    res.json(ResponseWarpper.success(true));
  },
  [updateProvisional](req: Request, res: Response) {
    res.json(ResponseWarpper.success(true));
  },
  [getAuthTime](req: Request, res: Response) {
    res.json(ResponseWarpper.success({}));
  },
  [getWard](req: Request, res: Response) {
    res.json(ResponseWarpper.success({}));
  },
  [getCountryList](req: Request, res: Response) {
    res.json(ResponseWarpper.success([]));
  },
  [parkingList](req: Request, res: Response) {
    res.json(ResponseWarpper.success([]));
  },
  [reletPerson](req: Request, res: Response) {
    res.json(ResponseWarpper.success(true));
  },
  [getPersonLicenceInfo](req: Request, res: Response) {
    const data = [{ id: 177, licenceId: 510, passWayType: '2', value: '24858008' }];
    res.json(ResponseWarpper.success(data));
  },
};
