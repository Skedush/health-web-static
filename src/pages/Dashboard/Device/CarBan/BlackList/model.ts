// import { stringify } from 'qs';
// import store from 'store';
import api from '@/services/index';
// import config from '@/utils/config';
import mdlExtend from '@/utils/model';
import { CommonModelType } from '@/common/model';
import { Effect, Subscription } from 'dva';

const { getCarBlackList, addCarBlackList, updateCarBlackList, deleteCarBlackList } = api;

export interface BlackListState {
  blackListData?: { [propName: string]: any };
}

export interface BlackListModelType extends CommonModelType {
  namespace: 'blackList';
  state: BlackListState;
  effects: {
    getCarBlackList: Effect;
    addCarBlackList: Effect;
    updateCarBlackList: Effect;
    deleteCarBlackList: Effect;
  };
  reducers: {};
  subscriptions?: { setup: Subscription };
}

const BlackListModel: BlackListModelType = {
  namespace: 'blackList',

  state: {
    blackListData: {},
  },

  effects: {
    *getCarBlackList({ payload }, { call, put }) {
      const res = yield call(getCarBlackList, payload);
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            blackListData: res.data,
          },
        });
      }
    },

    *addCarBlackList({ payload }, { call, put }) {
      yield call(addCarBlackList, payload);
    },
    *updateCarBlackList({ payload }, { call, put }) {
      yield call(updateCarBlackList, payload);
    },
    *deleteCarBlackList({ payload }, { call, put }) {
      yield call(deleteCarBlackList, payload);
    },
  },

  reducers: {},
};

export default mdlExtend(BlackListModel);
