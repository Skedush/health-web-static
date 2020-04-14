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
    userEntryList: { content: [] },
    entryInfoList: [],
  },

  effects: {
    *getEntryInfoList({ payload }, { select, call, put }) {
      const res = yield call(getEntryInfoList, payload);
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
    *getUserEntryList({ payload }, { select, call, put }) {
      const res = yield call(getUserEntryList, payload);
      if (res) {
        const { data } = res;
        if (data.next === 2 || !data.next) {
          yield put({
            type: 'updateState',
            payload: {
              userEntryList: res.data,
            },
          });
        } else {
          const userEntryList = yield select(state => state.home.userEntryList);
          userEntryList.count = data.count;
          userEntryList.next = data.next;
          userEntryList.previous = data.previous;
          userEntryList.content = userEntryList.content.concat(data.content);
          yield put({
            type: 'updateState',
            payload: {
              userEntryList: userEntryList,
            },
          });
        }
      }
    },
  },

  reducers: {},
};

export default mdlExtend(HomeModel);
