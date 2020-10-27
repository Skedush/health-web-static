// import { stringify } from 'qs';
import { CommonModelType } from '@/common/model';
import { pathMatchRegexp } from '@/utils';
import mdlExtend from '@/utils/model';
import { Effect, Subscription } from 'dva';

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
  },

  reducers: {},

  subscriptions: {
    setup({ dispatch }): void {
      dispatch({ type: 'setUp' });
    },
  },
};

export default mdlExtend(AppModel);
