// import { stringify } from 'qs';
// import store from 'store';
import api from '@/services/index';
// import config from '@/utils/config';
import mdlExtend from '@/utils/model';
import { CommonModelType } from '@/common/model';
import { Effect, Subscription } from 'dva';

const {
  getAccessScreenDevice,
  addAccessScreenDevice,
  getAccessScreenById,
  getAccessScreenSpec,
  updateAccessScreenDevice,
  deleteAccessScreenDevice,
} = api;

export interface AccessScreenState {
  accessScreenData?: { [propName: string]: any };
  accessScreenDetail: any;
  accessScreenSpec: any;
}

export interface AccessScreenModelType extends CommonModelType {
  namespace: 'accessScreen';
  state: AccessScreenState;
  effects: {
    getAccessScreenDevice: Effect;
    addAccessScreenDevice: Effect;
    getAccessScreenById: Effect;
    getAccessScreenSpec: Effect;
    updateAccessScreenDevice: Effect;
    deleteAccessScreenDevice: Effect;
  };
  reducers: {};
  subscriptions?: { setup: Subscription };
}

const AccessScreenModel: AccessScreenModelType = {
  namespace: 'accessScreen',

  state: {
    accessScreenData: {},
    accessScreenDetail: {},
    accessScreenSpec: [],
  },

  effects: {
    *getAccessScreenDevice({ payload }, { call, put }) {
      const res = yield call(getAccessScreenDevice, payload);
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            accessScreenData: res.data,
          },
        });
      }
    },

    *getAccessScreenById({ payload }, { call, put }) {
      const res = yield call(getAccessScreenById, payload);
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            accessScreenDetail: res.data,
          },
        });
        return res;
      }
    },

    *getAccessScreenSpec({ payload }, { call, put }) {
      const res = yield call(getAccessScreenSpec, payload);
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            accessScreenSpec: res.data,
          },
        });
      }
    },

    *addAccessScreenDevice({ payload }, { call, put }) {
      const res = yield call(addAccessScreenDevice, payload);
      if (res) return res;
    },

    *updateAccessScreenDevice({ payload }, { call, put }) {
      const res = yield call(updateAccessScreenDevice, payload);
      if (res) return res;
    },

    *deleteAccessScreenDevice({ payload }, { call, put }) {
      const res = yield call(deleteAccessScreenDevice, payload);
      if (res) {
        return res.data;
      }
    },
  },

  reducers: {},
};

export default mdlExtend(AccessScreenModel);
