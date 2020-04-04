// import { stringify } from 'qs';
import api from '@/services/index';
import mdlExtend from '@/utils/model';
import { CommonModelType } from '@/common/model';
import { Effect, Subscription } from 'dva';
import { pathMatchRegexp } from '@/utils';

const { logout } = api;

export interface AppState {}

export interface AppModelType extends CommonModelType {
  namespace: 'app';
  state: AppState;
  effects: {
    setUp: Effect;
  };
  reducers: {};
  subscriptions: { setup: Subscription };
}

const AppModel: AppModelType = {
  namespace: 'app',

  state: {},

  effects: {
    *setUp({ payload }, { select, call, put, all }) {
      if (pathMatchRegexp(['#/', '#/login'], window.location.hash)) {
        console.log('return: ');
        return;
      }
      yield all([]);
    },
    *logout({ payload }, { call }) {
      const res = yield call(logout, payload);
      return res;
    },
  },

  reducers: {},

  subscriptions: {
    setup({ dispatch }): void {
      dispatch({ type: 'setUp' });
    },
  },
};

export default mdlExtend(AppModel);
