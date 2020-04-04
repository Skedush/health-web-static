// import { stringify } from 'qs';
// import store from 'store';
import api from '@/services/index';
// import config from '@/utils/config';
import mdlExtend from '@/utils/model';
import { CommonModelType } from '@/common/model';
import { Effect, Subscription } from 'dva';

const { getEntryInfoDetail, addUserEntry } = api;

export interface FillFormState {
  entryInfoDetail: any;
}

export interface FillFormModelType extends CommonModelType {
  namespace: 'fillForm';
  state: FillFormState;
  effects: {
    getEntryInfoDetail: Effect;
    addUserEntry: Effect;
  };
  reducers: {};
  subscriptions?: { setup: Subscription };
}

const FillFormModel: FillFormModelType = {
  namespace: 'fillForm',

  state: {
    entryInfoDetail: { entrys: [] },
  },

  effects: {
    *getEntryInfoDetail({ payload }, { call, put }) {
      const res = yield call(getEntryInfoDetail, payload);
      if (res && res.data) {
        res.data.entrys.forEach(item => {
          item.value = item.id;
          item.label = item.title;
        });
        yield put({
          type: 'updateState',
          payload: {
            entryInfoDetail: res.data,
          },
        });
        return res.data;
      }
    },
    *addUserEntry({ payload }, { call, put }) {
      const res = yield call(addUserEntry, payload);
      if (res) {
        return res;
      }
    },
  },

  reducers: {},
};

export default mdlExtend(FillFormModel);
