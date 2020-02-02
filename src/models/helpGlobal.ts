// import { stringify } from 'qs';
import api from '@/services/index';
import mdlExtend from '@/utils/model';
import { CommonModelType } from '@/common/model';
import { Effect } from 'dva';

const { getHelpFile } = api;
export interface HelpBaseInfo {
  id: number;
  name: string;
  icon: string;
  url: string;
}
export interface HelpGlobalState {
  helpData: HelpBaseInfo[];
}

export interface HelpGlobalModelType extends CommonModelType {
  namespace: 'helpGlobal';
  state: HelpGlobalState;
  effects: {
    getHelpData: Effect;
  };
  reducers: {};
  subscriptions: {};
}

const HelpGlobalModel: HelpGlobalModelType = {
  namespace: 'helpGlobal',

  state: {
    helpData: [],
  },

  effects: {
    *getHelpData({ payload }, { call, put }) {
      const res = yield call(getHelpFile, payload);
      console.log('res: ', res);
      if (res.data) {
        yield put({
          type: 'setHelpData',
          payload: res.data,
        });
      }
    },
  },

  reducers: {
    setHelpData(state, { payload }) {
      return { ...state, helpData: payload };
    },
  },

  subscriptions: {},
};

export default mdlExtend(HelpGlobalModel);
