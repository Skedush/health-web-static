import api from '@/services/index';
import mdlExtend from '@/utils/model';
import { CommonModelType } from '@/common/model';
import { Effect, Subscription } from 'dva';

const { getUser, getRoleList, addUser, updateUser, deleteUser, updatePassWord } = api;

export interface UserState {
  userData?: { [propName: string]: any };
  roleList?: any[];
}

export interface UserModelType extends CommonModelType {
  namespace: 'user';
  state: UserState;
  effects: {
    getUser: Effect;
    getRoleList: Effect;
    addUser: Effect;
    updateUser: Effect;
    deleteUser: Effect;
    updatePassWord: Effect;
  };
  reducers: {};
  subscriptions?: { setup: Subscription };
}

const UserModel: UserModelType = {
  namespace: 'user',

  state: {
    userData: {},
    roleList: [],
  },

  effects: {
    *getUser({ payload }, { call, put }) {
      const res = yield call(getUser, payload);
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            userData: res.data,
          },
        });
      }
    },

    *getRoleList({ payload }, { call, put }) {
      const res = yield call(getRoleList, payload);
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            roleList: res.data,
          },
        });
      }
    },

    *addUser({ payload }, { call }) {
      yield call(addUser, payload);
    },

    *updateUser({ payload }, { call }) {
      yield call(updateUser, payload);
    },

    *updatePassWord({ payload }, { call }) {
      yield call(updatePassWord, payload);
    },

    *deleteUser({ payload }, { call }) {
      const res = yield call(deleteUser, payload);
      return res;
    },
  },

  reducers: {},
};

export default mdlExtend(UserModel);
