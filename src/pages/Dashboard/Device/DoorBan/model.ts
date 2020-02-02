// import { stringify } from 'qs';
// import store from 'store';
import api from '@/services/index';
// import config from '@/utils/config';
import mdlExtend from '@/utils/model';
import { CommonModelType } from '@/common/model';
import { Effect, Subscription } from 'dva';

const { getDeviceDoor, addDeviceDoor } = api;

export interface DoorBanState {
  doorBanData?: { [propName: string]: any };
  deviceSpec?: any[];
}

export interface DoorBanModelType extends CommonModelType {
  namespace: 'doorBan';
  state: DoorBanState;
  effects: {
    getDeviceDoor: Effect;
    addDeviceDoor: Effect;
  };
  reducers: {};
  subscriptions?: { setup: Subscription };
}

const DoorBanModel: DoorBanModelType = {
  namespace: 'doorBan',

  state: {
    doorBanData: {},
  },

  effects: {
    *getDeviceDoor({ payload }, { call, put }) {
      const res = yield call(getDeviceDoor, payload);
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            doorBanData: res.data,
          },
        });
      }
    },

    *addDeviceDoor({ payload }, { call, put }) {
      const res = yield call(addDeviceDoor, payload);
      return res;
    },
  },

  reducers: {},
};

export default mdlExtend(DoorBanModel);
