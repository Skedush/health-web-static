// import { stringify } from 'qs';
// import store from 'store';
import api from '@/services/index';
// import config from '@/utils/config';
import mdlExtend from '@/utils/model';
import { CommonModelType } from '@/common/model';
import { Effect, Subscription } from 'dva';

const { getOperating } = api;

export interface OperatingState {
  operatingData?: { [propName: string]: any };
}

export interface OperatingModelType extends CommonModelType {
  namespace: 'operating';
  state: OperatingState;
  effects: {
    getOperating: Effect;
  };
  reducers: {};
  subscriptions?: { setup: Subscription };
}

const OperatingModel: OperatingModelType = {
  namespace: 'operating',

  state: {
    operatingData: {},
  },

  effects: {
    *getOperating({ payload }, { call, put }) {
      const res = yield call(getOperating, payload);
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            operatingData: res.data,
          },
        });
      }
    },
  },

  reducers: {},
};

export default mdlExtend(OperatingModel);
