// import { stringify } from 'qs';
// import store from 'store';
import api from '@/services/index';
// import config from '@/utils/config';
import mdlExtend from '@/utils/model';
import { CommonModelType } from '@/common/model';
import { Effect, Subscription } from 'dva';

const {
  getDeviceCar,
  addDeviceCar,
  getAccessScreenDeviceList,
  getAccessScreenById,
  bindingLED,
  unbindingLED,
} = api;

export interface CarBanState {
  carBanData?: { [propName: string]: any };
  accessScreenDeviceList?: any;
  accessScreenDetail?: any;
}

export interface CarBanModelType extends CommonModelType {
  namespace: 'carBan';
  state: CarBanState;
  effects: {
    getDeviceCar: Effect;
    getAccessScreenById: Effect;
    addDeviceCar: Effect;
    getAccessScreenDeviceList: Effect;
    bindingLED: Effect;
    unbindingLED: Effect;
  };
  reducers: {};
  subscriptions?: { setup: Subscription };
}

const CarBanModel: CarBanModelType = {
  namespace: 'carBan',

  state: {
    carBanData: {},
    accessScreenDeviceList: [],
    accessScreenDetail: {},
  },

  effects: {
    *getDeviceCar({ payload }, { call, put }) {
      const res = yield call(getDeviceCar, payload);
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            carBanData: res.data,
          },
        });
      }
    },

    *getAccessScreenDeviceList({ payload }, { call, put }) {
      const res = yield call(getAccessScreenDeviceList, payload);
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            accessScreenDeviceList: res.data,
          },
        });
      }
    },

    *getAccessScreenById({ payload }, { call, put }) {
      const res = yield call(getAccessScreenById, payload);
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            accessScreenDetail: res.data,
          },
        });
        return res;
      }
    },

    *addDeviceCar({ payload }, { call, put }) {
      const res = yield call(addDeviceCar, payload);
      if (res) {
        return res;
      }
    },

    *bindingLED({ payload }, { call, put }) {
      const res = yield call(bindingLED, payload);
      if (res) {
        return res;
      }
    },

    *unbindingLED({ payload }, { call, put }) {
      const res = yield call(unbindingLED, payload);
      if (res) {
        return res;
      }
    },
  },

  reducers: {},
};

export default mdlExtend(CarBanModel);
