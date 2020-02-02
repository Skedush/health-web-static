// import { stringify } from 'qs';
// import store from 'store';
import api from '@/services/index';
// import config from '@/utils/config';
import mdlExtend from '@/utils/model';
import { CommonModelType } from '@/common/model';
import { Effect, Subscription } from 'dva';

const { getCourier, addCourier, updateCourier, deleteCourier } = api;

export interface CourierState {
  courierData?: { [propName: string]: any };
}

export interface CourierModelType extends CommonModelType {
  namespace: 'courier';
  state: CourierState;
  effects: {
    getCourier: Effect;
    addCourier: Effect;
    updateCourier: Effect;
    deleteCourier: Effect;
  };
  reducers: {};
  subscriptions?: { setup: Subscription };
}

const CourierModel: CourierModelType = {
  namespace: 'courier',

  state: {
    courierData: {},
  },

  effects: {
    *getCourier({ payload }, { call, put }) {
      const res = yield call(getCourier, payload);
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            courierData: res.data,
          },
        });
      }
    },

    *addCourier({ payload }, { call, put }) {
      yield yield put({ type: 'app/fillingVillage', payload });
      yield call(addCourier, payload);
    },

    *updateCourier({ payload }, { call, put }) {
      yield yield put({ type: 'app/fillingVillage', payload });
      yield call(updateCourier, payload);
    },

    *deleteCourier({ payload }, { call, put }) {
      yield call(deleteCourier, payload);
    },
  },

  reducers: {},
};

export default mdlExtend(CourierModel);
