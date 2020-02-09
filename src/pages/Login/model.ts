import { router } from '@/utils';
import { CommonModelType } from '@/common/model';
import { Effect } from 'dva';
import store from 'store';
import axios from 'axios';

import mdlExtend from '@/utils/model';
import api from '@/services';

const { login } = api;

export interface LoginState {
  userName?: string;
  password?: string;
}

export interface LoginModelType extends CommonModelType {
  namespace: 'login';
  state: LoginState;
  effects: {
    login: Effect;
  };
  reducers: {};
  subscriptions: {};
}

const LoginModel: LoginModelType = {
  namespace: 'login',

  state: {},

  effects: {
    *login({ payload }, { call, put, all }) {
      const res = yield call(login, payload);
      console.log('res: ', res);
      if (res.data) {
        router.push('/dashboard');
        axios.defaults.headers['Authorization'] = 'JWT ' + res.data.token;
        store.set('Authorization', res.data.token);
        return res;
      } else {
        throw res;
      }
    },
  },

  reducers: {},

  subscriptions: {},
};

export default mdlExtend(LoginModel);
