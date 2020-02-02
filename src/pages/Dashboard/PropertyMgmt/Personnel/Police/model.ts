import api from '@/services/index';
import mdlExtend from '@/utils/model';
import { CommonModelType } from '@/common/model';
import { Effect, Subscription } from 'dva';

const { getPolice, updatePolice } = api;

export interface PoliceState {
  policeData?: { [propName: string]: any };
}

export interface PoliceModelType extends CommonModelType {
  namespace: 'police';
  state: PoliceState;
  effects: {
    getPolice: Effect;
    updatePolice: Effect;
  };
  reducers: {};
  subscriptions?: { setup: Subscription };
}

const PoliceModel: PoliceModelType = {
  namespace: 'police',

  state: {
    policeData: {},
  },

  effects: {
    *getPolice({ payload }, { call, put }) {
      const res = yield call(getPolice, payload);
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            policeData: res.data,
          },
        });
      }
      return res;
    },

    *updatePolice({ payload }, { call, put }) {
      yield yield put({ type: 'app/fillingVillage', payload });
      const res = yield call(updatePolice, payload);
      console.log('res: ', res);
      return res;
    },
  },

  reducers: {},
};

export default mdlExtend(PoliceModel);
