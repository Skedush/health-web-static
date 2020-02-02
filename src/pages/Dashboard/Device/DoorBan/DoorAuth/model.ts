// import { stringify } from 'qs';
// import store from 'store';
import api from '@/services/index';
// import config from '@/utils/config';
import mdlExtend from '@/utils/model';
import { CommonModelType } from '@/common/model';
import { Effect, Subscription } from 'dva';

const {
  getPersonAuth,
  getPersonAuthInfo,
  addPersonAuth,
  deletePersonAuth,
  addPersonDeviceAuth,
  updatePersonDeviceAuth,
  deletePersonDeviceAuth,
  getDeviceDoorList,
} = api;

export interface DoorAuthState {
  doorAuthData?: { [propName: string]: any };
  doorAuthInfo?: any[];
  deviceDoorList?: any[];
}

export interface DoorAuthModelType extends CommonModelType {
  namespace: 'doorAuth';
  state: DoorAuthState;
  effects: {
    getPersonAuth: Effect;
    getPersonAuthInfo: Effect;
    addPersonAuth: Effect;
    deletePersonAuth: Effect;
    addPersonDeviceAuth: Effect;
    updatePersonDeviceAuth: Effect;
    deletePersonDeviceAuth: Effect;
    getDeviceDoorList: Effect;
  };
  reducers: {};
  subscriptions?: { setup: Subscription };
}

const DoorAuthModel: DoorAuthModelType = {
  namespace: 'doorAuth',

  state: {
    doorAuthData: {},
    doorAuthInfo: [],
    deviceDoorList: [],
  },

  effects: {
    *getPersonAuth({ payload }, { call, put }) {
      const res = yield call(getPersonAuth, payload);
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            doorAuthData: res.data,
          },
        });
      }
    },

    *getDeviceDoorList({ payload }, { call, put }) {
      const res = yield call(getDeviceDoorList, payload);
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            deviceDoorList: res.data,
          },
        });
      }
    },

    *getPersonAuthInfo({ payload }, { call, put }) {
      const res = yield call(getPersonAuthInfo, payload);
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            doorAuthInfo: res.data,
          },
        });
      }
    },

    *addPersonAuth({ payload }, { call, put }) {
      yield call(addPersonAuth, payload);
    },

    *deletePersonAuth({ payload }, { call, put }) {
      yield call(deletePersonAuth, payload);
    },

    *addPersonDeviceAuth({ payload }, { call, put }) {
      yield call(addPersonDeviceAuth, payload);
    },

    *updatePersonDeviceAuth({ payload }, { call, put }) {
      yield call(updatePersonDeviceAuth, payload);
    },

    *deletePersonDeviceAuth({ payload }, { call, put }) {
      yield call(deletePersonDeviceAuth, payload);
    },
  },

  reducers: {},
};

export default mdlExtend(DoorAuthModel);
