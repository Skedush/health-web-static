// import { stringify } from 'qs';
// import store from 'store';
import api from '@/services/index';
// import config from '@/utils/config';
import mdlExtend from '@/utils/model';
import { CommonModelType } from '@/common/model';
import { Effect, Subscription } from 'dva';
import { AnyAction } from 'redux';

const {
  getTakeout,
  addTakeout,
  updateTakeout,
  deleteTakeout,
  pageProvisional,
  deleteProvisional,
} = api;

export interface TakeoutState {
  takeoutData?: { [propName: string]: any };
}

export interface TakeoutModelType extends CommonModelType {
  namespace: 'takeout';
  state: TakeoutState;
  effects: {
    getTakeout: Effect;
    addTakeout: Effect;
    updateTakeout: Effect;
    deleteTakeout: Effect;
    provisionalPage: Effect;
    deleteProvisional: Effect;
  };
  reducers: {};
  subscriptions?: { setup: Subscription };
}

const TakeoutModel: TakeoutModelType = {
  namespace: 'takeout',

  state: {
    takeoutData: {},
  },

  effects: {
    *getTakeout({ payload }, { call, put }) {
      const res = yield call(getTakeout, payload);
      if (res) {
        res.data.content.forEach(item => {
          if (item.foreign) {
            item.typeStr = item.typeStr + '(外籍)';
          }
        });
        yield put({
          type: 'updateState',
          payload: {
            takeoutData: res.data,
          },
        });
      }
    },

    *addTakeout({ payload }, { call, put }) {
      yield yield put({ type: 'app/fillingVillage', payload });
      yield call(addTakeout, payload);
    },

    *updateTakeout({ payload }, { call, put }) {
      yield yield put({ type: 'app/fillingVillage', payload });
      yield call(updateTakeout, payload);
    },

    *deleteTakeout({ payload }, { call, put }) {
      yield call(deleteTakeout, payload);
    },
    *deleteProvisional({ payload }, { call, put }) {
      const { data } = yield call(deleteProvisional, payload);
      return data;
    },
    *provisionalPage({ payload }: AnyAction, { call, put }) {
      const res = yield call(pageProvisional, payload);
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            takeoutData: res.data,
          },
        });
      }
    },
  },

  reducers: {},
};

export default mdlExtend(TakeoutModel);
