import { CommonModelType } from '@/common/model';
// import axios from 'axios';
import { Message } from '@/components/Library';
import api from '@/services';
import { router } from '@/utils';
import mdlExtend from '@/utils/model';
import { Effect } from 'dva';
import store from 'store';

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
      if (res && res.data) {
        // axios.defaults.headers['Authorization'] = 'JWT ' + res.data.token;
        store.set('Authorization', res.data.token);
        store.set('userInfo', res.data);
        router.push('/dashboard');
        return res;
      } else {
        Message.error('账号密码错误或账号未激活');
        throw res;
      }
    },
  },

  reducers: {},

  subscriptions: {},
};

export default mdlExtend(LoginModel);
