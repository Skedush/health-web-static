// import { stringify } from 'qs';
// import store from 'store';
import api from '@/services/index';
// import config from '@/utils/config';
import mdlExtend from '@/utils/model';
import { CommonModelType } from '@/common/model';
import { Effect, Subscription } from 'dva';
import { PersonBaseInfo } from './person';

const { getLicencePage, getLicenceInfo, passWayAllLicence } = api;

interface IAuthPersonData {
  id: number;
  licenceNo: string;
  name: string;
  phone: string;
  createTime: string;
}

interface IDeviceAuth {
  id: number;
  deviceName: string;
  state: string;
  stateStr: string;
  authStartDate: string;
  authEndDate: string;
}

export interface IPasswayList {
  id: string;
  passWayType: string;
  value: any;
  licenceId?: any;
  [key: string]: any;
}

export interface IPersonDetail {
  type: string;
  detailList: PersonBaseInfo[];
  passWayList: IPasswayList[];
}

export interface IAuthData {
  pmPassCardAuthList: any;
  licenceDetailResp: IAuthPersonData;
  personLicenseNoAuthList: IDeviceAuth[];
  personDetailList: IPersonDetail[];
  pmPersonPassWayList: IPasswayList[];
  personTypeList: IPersonType[];
  [key: string]: any;
}

interface IPersonType {
  id: string;
  type: string;
  typeStr: string;
  value?: string;
  key?: string;
}
export interface DoorBanModelType extends CommonModelType {
  namespace: 'passport';
  state: {};
  effects: {
    getLicencePage: Effect;
    getLicenceInfo: Effect;
    passWayAllLicence: Effect;
  };
  reducers: {};
  subscriptions?: { setup: Subscription };
}

const DoorBanModel: DoorBanModelType = {
  namespace: 'passport',

  state: {},

  effects: {
    *getLicencePage(action, { call, put }) {
      const { data } = yield call(getLicencePage, action.data);
      return data;
    },
    *getLicenceInfo({ payload }, { call, put }) {
      const { data } = yield call(getLicenceInfo, payload);
      return data;
    },
    *passWayAllLicence(action, { call }) {
      const { data } = yield call(passWayAllLicence, action.data);
      return data;
    },
  },

  reducers: {},
};

export default mdlExtend(DoorBanModel);
