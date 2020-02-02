import mdlExtend from '@/utils/model';
import { CommonModelType } from '@/common/model';
import { Subscription, Effect } from 'dva';
import api from '@/services';

const { visitConfigGet, visitConfigUpdate } = api;
interface VisitConfigState {}

export interface VisitConfigModelType extends CommonModelType {
  namespace: 'visitConfig';
  state: VisitConfigState;
  effects: {
    getConfigData: Effect;
    updateConfig: Effect;
  };
  reducers: {};
  subscriptions?: { setup: Subscription };
}

const VisitConfigModel: VisitConfigModelType = {
  namespace: 'visitConfig',

  state: {},

  effects: {
    *getConfigData(action, { call, put }) {
      const { data } = yield call(visitConfigGet);
      return data;
    },
    *updateConfig(action, { call, put }) {
      return yield call(visitConfigUpdate, action.data);
    },
  },

  reducers: {},
};

export default mdlExtend(VisitConfigModel);
