// import { stringify } from 'qs';
// import store from 'store';
import api from '@/services/index';
// import config from '@/utils/config';
import mdlExtend from '@/utils/model';
import { CommonModelType } from '@/common/model';
import { Effect, Subscription } from 'dva';

const { getDictionary, addDictionary, updateDictionary, deleteDictionary } = api;

export interface DictionaryState {
  dictionaryData?: { [propName: string]: any };
}

export interface DictionaryModelType extends CommonModelType {
  namespace: 'dictionary';
  state: DictionaryState;
  effects: {
    getDictionary: Effect;
    addDictionary: Effect;
    updateDictionary: Effect;
    deleteDictionary: Effect;
  };
  reducers: {};
  subscriptions?: { setup: Subscription };
}

const DictionaryModel: DictionaryModelType = {
  namespace: 'dictionary',

  state: {
    dictionaryData: {},
  },

  effects: {
    *getDictionary({ payload }, { call, put }) {
      const res = yield call(getDictionary, payload);
      yield put({
        type: 'updateState',
        payload: {
          dictionaryData: res.data,
        },
      });
    },

    *addDictionary({ payload }, { call }) {
      yield call(addDictionary, payload);
    },

    *updateDictionary({ payload }, { call }) {
      yield call(updateDictionary, payload);
    },

    *deleteDictionary({ payload }, { call }) {
      yield call(deleteDictionary, payload);
    },
  },

  reducers: {},
};

export default mdlExtend(DictionaryModel);
