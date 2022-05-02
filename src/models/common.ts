// import { stringify } from 'qs';
import { CommonModelType as GlobalCommonModelType } from '@/common/model';
import api from '@/services/index';
import mdlExtend from '@/utils/model';
import { Effect, Subscription } from 'dva';

const { getEntryInfoDetail, getUserEntry } = api;

export interface CommonState {
  entryInfoDetail: any;
}

export interface CommonModelType extends GlobalCommonModelType {
  namespace: 'common';
  state: CommonState;
  effects: {
    getEntryInfoDetail: Effect;
    getUserEntry: Effect;
  };
  reducers: {};
  subscriptions?: { setup: Subscription };
}

const CommonModel: CommonModelType = {
  namespace: 'common',

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

    *getUserEntry({ payload }, { call, put }) {
      const res = yield call(getUserEntry, payload);
      if (res && res.data) {
        // yield put({
        //   type: 'updateState',
        //   payload: {
        //     entryInfoDetail: res.data,
        //   },
        // });
        return res.data;
      }
    },
  },

  reducers: {},
};

export default mdlExtend(CommonModel);
