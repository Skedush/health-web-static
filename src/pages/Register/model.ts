import { CommonModelType } from '@/common/model';
import { Message } from '@/components/Library';
import api from '@/services';
import { router } from '@/utils';
// import axios from 'axios';
import mdlExtend from '@/utils/model';
import { Effect } from 'dva';
import store from 'store';

const { createUser } = api;

export interface UserState {
  userName?: string;
  password?: string;
}

export interface LoginModelType extends CommonModelType {
  namespace: 'user';
  state: UserState;
  effects: {
    createUser: Effect;
  };
  reducers: {};
  subscriptions: {};
}

const LoginModel: LoginModelType = {
  namespace: 'user',

  state: {},

  effects: {
    *createUser({ payload }, { call, put, all }) {
      store.remove('Authorization');
      const res = yield call(createUser, payload);
      if (res && res.success) {
        Message.success('注册成功');
        router.push('/login');
        return res;
      } else {
        Message.error(res.data.username);
        throw res;
      }
    },
  },

  reducers: {},

  subscriptions: {},
};

export default mdlExtend(LoginModel);
