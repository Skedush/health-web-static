// import { stringify } from 'qs';
// import store from 'store';
import api from '@/services/index';
// import config from '@/utils/config';
import mdlExtend from '@/utils/model';
import { CommonModelType } from '@/common/model';
import { Effect, Subscription } from 'dva';

const { getEntryInfoList, getUserEntryList } = api;

export interface HomeState {
  userEntryList: any;
  entryInfoList: any;
}

export interface HomeModelType extends CommonModelType {
  namespace: 'home';
  state: HomeState;
  effects: {
    getEntryInfoList: Effect;
    getUserEntryList: Effect;
  };
  reducers: {};
  subscriptions?: { setup: Subscription };
}

const HomeModel: HomeModelType = {
  namespace: 'home',

  state: {
    userEntryList: [],
    entryInfoList: [],
  },

  effects: {
    *getEntryInfoList({ payload }, { call, put }) {
      const res = yield call(getEntryInfoList, payload);
      console.log('res: ', res);
      if (res && res.data) {
        yield put({
          type: 'updateState',
          payload: {
            entryInfoList: res.data,
          },
        });
        return res.data;
      }
    },
    *getUserEntryList({ payload }, { call, put }) {
      const res = yield call(getUserEntryList, payload);
      console.log('res: ', res);
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            userEntryList: res.data,
          },
        });
      }
    },
  },

  reducers: {},
};

export default mdlExtend(HomeModel);
