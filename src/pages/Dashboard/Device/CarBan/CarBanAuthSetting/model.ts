import api from '@/services/index';
import mdlExtend from '@/utils/model';
import { CommonModelType } from '@/common/model';
import { Effect, Subscription } from 'dva';

const { getCarBanAuthSetting, updateCarBanAuthSetting } = api;

export interface CarBanAuthSettingState {
  carBanAuthSettingData?: { [propName: string]: any };
}

export interface CarBanAuthSettingModelType extends CommonModelType {
  namespace: 'carBanAuthSetting';
  state: CarBanAuthSettingState;
  effects: {
    getCarBanAuthSetting: Effect;
    updateCarBanAuthSetting: Effect;
  };
  reducers: {};
  subscriptions?: { setup: Subscription };
}

const CarBanAuthSettingModel: CarBanAuthSettingModelType = {
  namespace: 'carBanAuthSetting',

  state: {
    carBanAuthSettingData: {},
  },

  effects: {
    *getCarBanAuthSetting({ payload }, { call, put }) {
      const res = yield call(getCarBanAuthSetting, payload);
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            carBanAuthSettingData: res.data,
          },
        });
      }
      if (res) return res.data;
    },

    *updateCarBanAuthSetting({ payload }, { call, put }) {
      yield call(updateCarBanAuthSetting, payload);
    },
  },

  reducers: {},
};

export default mdlExtend(CarBanAuthSettingModel);
