// import { stringify } from 'qs';
// import store from 'store';
import { CommonModelType } from '@/common/model';
import api from '@/services/index';
// import config from '@/utils/config';
import mdlExtend from '@/utils/model';
import { Effect, Subscription } from 'dva';

const { getTitleDetail, updateTitle } = api;

export interface TitleState {
  titleDetail: any;
}

export interface TitleModelType extends CommonModelType {
  namespace: 'title';
  state: TitleState;
  effects: {
    getTitleDetail: Effect;
    updateTitle: Effect;
  };
  reducers: {};
  subscriptions?: { setup: Subscription };
}

const TitleModel: TitleModelType = {
  namespace: 'title',

  state: {
    titleDetail: {},
  },

  effects: {
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
        return res;
      }
    },
  },

  reducers: {},
};

export default mdlExtend(TitleModel);
