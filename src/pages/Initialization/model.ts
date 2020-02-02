import { CommonModelType } from '@/common/model';
import mdlExtend from '@/utils/model';
import { Effect } from 'dva';
import api from '@/services';

const {
  updateVillageInfo,
  distrucGetParent,
  updateDoorBanAuthSetting,
  updateCarBanAuthSetting,
} = api;
export interface InitState {}

export interface InitModelType extends CommonModelType {
  namespace: 'init';
  state: InitState;
  effects: {
    submitSave: Effect;
    getAreaByParent: Effect;
    updateDoorBanAuthSetting: Effect;
    updateCarBanAuthSetting: Effect;
  };
  reducers: {};
  subscriptions: {};
}

const InitModel: InitModelType = {
  namespace: 'init',

  state: {
    entranceList: [],
  },

  effects: {
    *submitSave({ payload }, { call, put }) {
      const res = yield call(updateVillageInfo, payload);
      return res;
    },
    *getAreaByParent({ payload }, { call }) {
      const { data } = yield call(distrucGetParent, payload);
      return data;
    },
    *updateDoorBanAuthSetting({ payload }, { call, put }) {
      yield call(updateDoorBanAuthSetting, payload);
    },
    *updateCarBanAuthSetting({ payload }, { call, put }) {
      yield call(updateCarBanAuthSetting, payload);
    },
  },

  reducers: {},

  subscriptions: {},
};

export default mdlExtend(InitModel);
