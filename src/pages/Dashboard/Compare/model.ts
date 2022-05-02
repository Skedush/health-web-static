// import { stringify } from 'qs';
import { CommonModelType } from '@/common/model';
import mdlExtend from '@/utils/model';
import { Effect, Subscription } from 'dva';

export interface CompareState {
  userEntrys: any[];
}

export interface CompareModelType extends CommonModelType {
  namespace: 'compare';
  state: CompareState;
  effects: {
    getTwiceUserEntryDetail: Effect;
  };
  reducers: {};
  subscriptions?: { setup: Subscription };
}

const CompareModel: CompareModelType = {
  namespace: 'compare',

  state: {
    userEntrys: [],
  },

  effects: {
    *getTwiceUserEntryDetail({ payload }, { call, put, all }) {
      const res = yield all([
        yield put({ type: 'common/getUserEntry', payload: { id: payload[0] } }),
        yield put({ type: 'common/getUserEntry', payload: { id: payload[1] } }),
      ]);
      if (res && res.length > 1) {
        yield put({
          type: 'updateState',
          payload: {
            userEntrys: res,
          },
        });
        return res.data;
      }
    },
  },

  reducers: {},
};

export default mdlExtend(CompareModel);
