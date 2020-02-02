// import { stringify } from 'qs';
// import store from 'store';
import api from '@/services/index';
// import config from '@/utils/config';
import mdlExtend from '@/utils/model';
import { CommonModelType } from '@/common/model';
import { Effect, Subscription } from 'dva';

const { getCarPass, getCarPassById, updateCarPassAuth } = api;

export interface CarPassState {
  carPassList?: { [propName: string]: any };
  carPassData: any;
}

export interface CarPassModelType extends CommonModelType {
  namespace: 'carPass';
  state: CarPassState;
  effects: {
    getCarPass: Effect;
    getCarPassById: Effect;
    updateCarPassAuth: Effect;
  };
  reducers: {};
  subscriptions?: { setup: Subscription };
}

const CarPassModel: CarPassModelType = {
  namespace: 'carPass',

  state: {
    carPassList: {},
    carPassData: {},
  },

  effects: {
    *getCarPass({ payload }, { call, put }) {
      const res = yield call(getCarPass, payload);
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            carPassList: res.data,
          },
        });
      }
    },

    *getCarPassById({ payload }, { call, put }) {
      const res = yield call(getCarPassById, payload);
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            carPassData: res.data,
          },
        });
      }
    },

    *updateCarPassAuth({ payload }, { call, put }) {
      const res = yield call(updateCarPassAuth, payload);
      if (res && res.data) {
        return res.data;
      }
    },
  },

  reducers: {},
};

export default mdlExtend(CarPassModel);
