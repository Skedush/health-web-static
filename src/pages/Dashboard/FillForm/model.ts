// import { stringify } from 'qs';
// import store from 'store';
import { CommonModelType } from '@/common/model';
import api from '@/services/index';
// import config from '@/utils/config';
import mdlExtend from '@/utils/model';
import { Effect, Subscription } from 'dva';

const { addUserEntry } = api;

export interface FillFormState {}

export interface FillFormModelType extends CommonModelType {
  namespace: 'fillForm';
  state: FillFormState;
  effects: {
    addUserEntry: Effect;
  };
  reducers: {};
  subscriptions?: { setup: Subscription };
}

const FillFormModel: FillFormModelType = {
  namespace: 'fillForm',

  state: {},

  effects: {
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
