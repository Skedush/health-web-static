// import { stringify } from 'qs';
// import store from 'store';
import api from '@/services/index';
// import config from '@/utils/config';
import mdlExtend from '@/utils/model';
import { CommonModelType } from '@/common/model';
import { Effect, Subscription } from 'dva';

const { getRole, addRole, updateRole, deleteRole, getRoleInfo } = api;

export interface RoleState {
  roleData?: { [propName: string]: any };
  roleInfo?: { [propName: string]: any };
}

export interface RoleModelType extends CommonModelType {
  namespace: 'role';
  state: RoleState;
  effects: {
    getRole: Effect;
    getRoleInfo: Effect;
    addRole: Effect;
    updateRole: Effect;
    deleteRole: Effect;
  };
  reducers: {};
  subscriptions?: { setup: Subscription };
}

const RoleModel: RoleModelType = {
  namespace: 'role',

  state: {
    roleData: {},
  },

  effects: {
    *getRole({ payload }, { call, put }) {
      const res = yield call(getRole, payload);
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            roleData: res.data,
          },
        });
      }
    },

    *getRoleInfo({ payload }, { call, put }) {
      const res = yield call(getRoleInfo, payload);
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            roleInfo: res.data,
          },
        });
      }
      return res.data;
    },

    *addRole({ payload }, { call }) {
      yield call(addRole, payload);
    },

    *updateRole({ payload }, { call }) {
      yield call(updateRole, payload);
    },

    *deleteRole({ payload }, { call }) {
      const res = yield call(deleteRole, payload);
      return res;
    },
  },

  reducers: {},
};

export default mdlExtend(RoleModel);
