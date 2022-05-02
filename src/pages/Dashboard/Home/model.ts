// import { stringify } from 'qs';
// import store from 'store';
import { CommonModelType } from '@/common/model';
import api from '@/services/index';
// import config from '@/utils/config';
import mdlExtend from '@/utils/model';
import { Effect, Subscription } from 'dva';

const {
  getEntryInfoList,
  getUserEntryList,
  deleteUserEntry,
  // updatePasswordAndUsername,
  getTitleDetail,
  updateTitle,
} = api;

export interface HomeState {
  userEntryList: any;
  entryInfoList: any;
  titleDetail: any;
}

export interface HomeModelType extends CommonModelType {
  namespace: 'home';
  state: HomeState;
  effects: {
    getEntryInfoList: Effect;
    getUserEntryList: Effect;
    // updatePasswordAndUsername: Effect;
    getTitleDetail: Effect;
    deleteUserEntry: Effect;
    updateTitle: Effect;
  };
  reducers: {};
  subscriptions?: { setup: Subscription };
}

const HomeModel: HomeModelType = {
  namespace: 'home',

  state: {
    userEntryList: { content: [] },
    entryInfoList: [],
    titleDetail: {},
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

    // *updatePasswordAndUsername({ payload }, { select, call, put }) {
    //   return yield call(updatePasswordAndUsername, payload);
    // },

    *getUserEntryList({ payload }, { select, call, put }) {
      const res = yield call(getUserEntryList, payload);
      if (res) {
        const { data } = res;
        if (payload.page === 1) {
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

    *deleteUserEntry({ payload }, { call, put }) {
      return yield call(deleteUserEntry, payload);
    },

    *getTitleDetail({ payload }, { call, put }) {
      const res = yield call(getTitleDetail, payload);
      if (res && res.data) {
        yield put({
          type: 'updateState',
          payload: {
            titleDetail: res.data,
          },
        });
        return res.data;
      }
    },

    *updateTitle({ payload }, { call, put }) {
      const res = yield call(updateTitle, payload);
      if (res) {
        yield put({ type: 'getEntryInfoList' });

        return res;
      }
    },
  },

  reducers: {},
};

export default mdlExtend(HomeModel);
