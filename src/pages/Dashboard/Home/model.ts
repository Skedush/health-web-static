// import { stringify } from 'qs';
// import store from 'store';
import api from '@/services/index';
// import config from '@/utils/config';
import mdlExtend from '@/utils/model';
import { CommonModelType } from '@/common/model';
import { Effect, Subscription } from 'dva';

const {
  getHomeQuickEntry,
  getTodo,
  getPersonBase,
  getchildrenDetail,
  getCarDetail,
  carDelete,
  deletePersonIcCard,
  deleteKid,
  carAuthDelete,
  getPersonTodoData,
  getCarPermitList,
} = api;

export interface HomeState {
  homeData?: any;
  administrator?: any;
  homeList?: any;
  detailInfo?: { [propName: string]: any };
}

export interface HomeModelType extends CommonModelType {
  namespace: 'home';
  state: HomeState;
  effects: {
    getHomeQuickEntry: Effect;
    getTodo: Effect;
    getPersonBase: Effect;
    getchildrenDetail: Effect;
    getCarDetail: Effect;
    carDelete: Effect;
    deletePersonIcCard: Effect;
    deleteKid: Effect;
    carAuthDelete: Effect;
    getPersonTodoData: Effect;
    getCarTodoData: Effect;
  };
  reducers: {};
  subscriptions?: { setup: Subscription };
}

const HomeModel: HomeModelType = {
  namespace: 'home',

  state: {
    homeData: {},
    administrator: {},
    homeList: [],
    detailInfo: {},
  },

  effects: {
    *getHomeQuickEntry({ payload }, { call, put }) {
      const res = yield call(getHomeQuickEntry, payload);
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            homeData: res.data,
          },
        });
      }
    },

    *getTodo({ payload }, { call, put }) {
      const res = yield call(getTodo, payload);
      console.log('res: ', res);
      if (res) {
        yield put({
          type: 'setHomeTableList',
          payload: res.data,
        });
      }
      return res;
    },

    *getPersonBase({ payload }, { call, put }) {
      const res = yield call(getPersonBase, payload);
      if (res) {
        yield put({
          type: 'setDetailInfo',
          payload: res.data,
        });
      }
    },

    *getchildrenDetail({ payload }, { call, put }) {
      const res = yield call(getchildrenDetail, payload);
      if (res) {
        yield put({
          type: 'setDetailInfo',
          payload: res.data,
        });
      }
    },

    *getCarDetail({ payload }, { call, put }) {
      yield yield put({ type: 'app/fillingVillage', payload });
      const res = yield call(getCarDetail, payload);
      if (res) {
        yield put({
          type: 'setDetailInfo',
          payload: res.data,
        });
      }
    },

    *deletePersonIcCard({ payload }, { call }) {
      const res = yield call(deletePersonIcCard, payload);
      return res;
    },

    *deleteKid({ payload }, { call }) {
      const res = yield call(deleteKid, payload);
      return res;
    },

    *carDelete({ payload }, { call }) {
      const res = yield call(carDelete, payload);
      return res;
    },

    *carAuthDelete({ payload }, { call }) {
      const res = yield call(carAuthDelete, payload);
      return res;
    },
    *getPersonTodoData(action, { call, put }) {
      const res = yield call(getPersonTodoData, action.payload);
      if (res) {
        yield put({
          type: 'setDetailInfo',
          payload: res.data,
        });
      }
    },
    *getCarTodoData(action, { call, put }) {
      const res = yield call(getCarPermitList, action.payload);
      if (res) {
        yield put({
          type: 'setDetailInfo',
          payload: res.data,
        });
      }
    },
  },

  reducers: {
    setHomeTableList(state, { payload }): HomeState {
      return { ...state, homeList: payload };
    },
    setDetailInfo(state, { payload }): HomeState {
      return { ...state, detailInfo: payload };
    },
  },
};

export default mdlExtend(HomeModel);
