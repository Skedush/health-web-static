import api from '@/services/index';
import mdlExtend from '@/utils/model';
import { CommonModelType } from '@/common/model';
import { Effect, Subscription } from 'dva';

const { updateDoorBanAuthSetting } = api;

export interface DoorBanAuthSettingState {}

export interface DoorBanAuthSettingModelType extends CommonModelType {
  namespace: 'doorBanAuthSetting';
  state: DoorBanAuthSettingState;
  effects: {
    updateDoorBanAuthSetting: Effect;
  };
  reducers: {};
  subscriptions?: { setup: Subscription };
}

const DoorBanAuthSettingModel: DoorBanAuthSettingModelType = {
  namespace: 'doorBanAuthSetting',

  state: {},

  effects: {
    *updateDoorBanAuthSetting({ payload }, { call, put }) {
      yield call(updateDoorBanAuthSetting, payload);
    },
  },

  reducers: {},
};

export default mdlExtend(DoorBanAuthSettingModel);
