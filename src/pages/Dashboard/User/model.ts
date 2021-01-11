// import { stringify } from 'qs';
// import store from 'store';
import { CommonModelType } from '@/common/model';
import api from '@/services/index';
// import config from '@/utils/config';
import mdlExtend from '@/utils/model';
import { Effect, Subscription } from 'dva';

const { updatePasswordAndUsername } = api;

export interface TitleState {}

export interface TitleModelType extends CommonModelType {
  namespace: 'user';
  state: TitleState;
  effects: {
    updatePasswordAndUsername: Effect;
  };
  reducers: {};
  subscriptions?: { setup: Subscription };
}

const TitleModel: TitleModelType = {
  namespace: 'user',

  state: {
    titleDetail: {},
  },

  effects: {
    *updatePasswordAndUsername({ payload }, { call, put }) {
      return yield call(updatePasswordAndUsername, payload);
    },
  },

  reducers: {},
};

export default mdlExtend(TitleModel);
