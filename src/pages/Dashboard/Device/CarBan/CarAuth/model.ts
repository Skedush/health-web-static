// import { stringify } from 'qs';
// import store from 'store';
import api from '@/services/index';
// import config from '@/utils/config';
import mdlExtend from '@/utils/model';
import { CommonModelType } from '@/common/model';
import { Effect, Subscription } from 'dva';

const { getCarAuth, getCarAuthInfo, addCarAuth, deleteCarAuth, updateCarAuth } = api;

export interface CarAuthState {
  carAuthData?: { [propName: string]: any };
  carAuthInfo?: { [propName: string]: any };
}

export interface CarAuthModelType extends CommonModelType {
  namespace: 'carAuth';
  state: CarAuthState;
  effects: {
    getCarAuth: Effect;
    getCarAuthInfo: Effect;
    addCarAuth: Effect;
    deleteCarAuth: Effect;
    updateCarAuth: Effect;
  };
  reducers: {};
  subscriptions?: { setup: Subscription };
}

const CarAuthModel: CarAuthModelType = {
  namespace: 'carAuth',

  state: {
    carAuthData: {},
  },

  effects: {
    *getCarAuth({ payload }, { call, put }) {
      const res = yield call(getCarAuth, payload);
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            carAuthData: res.data,
          },
        });
      }
    },
    *getCarAuthInfo({ payload }, { call, put }) {
      const res = yield call(getCarAuthInfo, payload);
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            carAuthInfo: res.data,
          },
        });
      }
    },

    *addCarAuth({ payload }, { call, put }) {
      yield call(addCarAuth, payload);
    },
    *deleteCarAuth({ payload }, { call, put }) {
      yield call(deleteCarAuth, payload);
    },
    *updateCarAuth({ payload }, { call, put }) {
      yield call(updateCarAuth, payload);
    },
  },

  reducers: {},
};

export default mdlExtend(CarAuthModel);
