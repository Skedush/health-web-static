// import { stringify } from 'qs';
// import store from 'store';
import api from '@/services/index';
// import config from '@/utils/config';
import mdlExtend from '@/utils/model';
import { CommonModelType } from '@/common/model';
import { Effect, Subscription } from 'dva';

const { getDevice, getDeviceInfo, updateDevice, deleteDevice, getDeviceSpec } = api;

export interface DeviceState {
  deviceData: { [propName: string]: any };
  deviceInfo?: { [propName: string]: any };
  deviceSpec?: any[];
}

export interface DeviceModelType extends CommonModelType {
  namespace: 'device';
  state: DeviceState;
  effects: {
    getDevice: Effect;
    getDeviceInfo: Effect;
    updateDevice: Effect;
    deleteDevice: Effect;
    getDeviceSpec: Effect;
  };
  reducers: {};
  subscriptions?: { setup: Subscription };
}

const DeviceModel: DeviceModelType = {
  namespace: 'device',

  state: {
    deviceData: {},
    deviceInfo: {},
  },

  effects: {
    *getDevice({ payload }, { call, put }) {
      const res = yield call(getDevice, payload);
      yield put({
        type: 'updateState',
        payload: {
          deviceData: res.data,
        },
      });
    },

    *getDeviceInfo({ payload }, { call, put }) {
      const res = yield call(getDeviceInfo, payload);
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            deviceInfo: res.data,
          },
        });
      }
      return res;
    },

    *updateDevice({ payload }, { call, put }) {
      const { data } = yield call(updateDevice, payload);
      return data;
    },

    *deleteDevice({ payload }, { call, put }) {
      const { data } = yield call(deleteDevice, payload);
      return data;
    },

    *getDeviceSpec({ payload }, { call, put }) {
      const res = yield call(getDeviceSpec, payload);
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            deviceSpec: res.data,
          },
        });
      }
    },
  },

  reducers: {},
};

export default mdlExtend(DeviceModel);
