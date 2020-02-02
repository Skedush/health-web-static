import mdlExtend from '@/utils/model';
import { CommonModelType } from '@/common/model';
import { Effect, Subscription } from 'dva';
import api from '@/services';
import { AnyAction } from 'redux';

const {
  visitDevicePage,
  getDeviceInfo,
  visitRecordExport,
  visitRecordPage,
  deleteDevice,
  updateDevice,
  visitDeviceAdd,
} = api;

export interface VisitDeviceBaseInfo {
  id: number;
  type: string;
  address: string;
  buildUnit: string;
  buildUnitPhone: string;
  operator: string;
  operatorPhone: string;
  tCreateTime: string;
  status: string;
  code: string;
  longitude: string;
  buildDate: string;
  latitude: string;
  name: string;
  brand: string;
  spec: string;
  ip: string;
  port: string;
  deviceUsername: string;
  devicePassword: string;
}

export interface VisitRecordBaseInfo {
  faceImageUrl: string;
  name: string;
  phone: string;
  personName: string;
  buildCode: string;
  unitCode: string;
  houseCode: string;
  authTime: string;
  direction: string;
  recordTime: string;
}

export interface VisitState {
  dataList: VisitDeviceBaseInfo[];
  recordList: VisitRecordBaseInfo[];
  modeifyData: VisitDeviceBaseInfo;
}

export interface VisitModelType extends CommonModelType {
  namespace: 'visit';
  state: VisitState;
  effects: {
    getDeviceList: Effect;
    deleteVisitDevice: Effect;
    addVisitDevice: Effect;
    editVisitDevice: Effect;
    exportVisitRecord: Effect;
    getVisitRecordList: Effect;
    getDevice: Effect;
  };
  reducers: {};
  subscriptions?: { setup: Subscription };
}

const UnitModel: VisitModelType = {
  namespace: 'visit',

  state: {
    modeifyData: {} as VisitDeviceBaseInfo,
    dataList: [],
    recordList: [],
  },

  effects: {
    *getDeviceList(action, { call, put }) {
      const { data } = yield call(visitDevicePage, action.pageOption);
      return data;
    },
    *getDevice(action, { call }) {
      const { data } = yield call(getDeviceInfo, { id: action.id });
      return data;
    },
    *deleteVisitDevice(action, { call }) {
      const { data } = yield call(deleteDevice, action.deleteList);
      return data;
    },
    *addVisitDevice(action, { call }) {
      return yield call(visitDeviceAdd, action.data);
    },
    *editVisitDevice(action, { call }) {
      return yield call(updateDevice, action.data);
    },
    *exportVisitRecord(action, { call, put }) {
      const { data } = yield call(visitRecordExport, action.pageOption);
      yield put({ type: 'updateRecordList', recordList: data.content });
    },
    *getVisitRecordList(action, { call }) {
      yield call(visitRecordPage, action.data);
    },
  },

  reducers: {
    updateRecordList(state: any, { recordList }: AnyAction) {
      return {
        recordList,
      };
    },
  },
};

export default mdlExtend(UnitModel);
