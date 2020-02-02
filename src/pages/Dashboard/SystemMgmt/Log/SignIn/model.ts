// import { stringify } from 'qs';
// import store from 'store';
import api from '@/services/index';
// import config from '@/utils/config';
import mdlExtend from '@/utils/model';
import { CommonModelType } from '@/common/model';
import { Effect, Subscription } from 'dva';

const { getSignIn } = api;

export interface SignInState {
  signInData?: { [propName: string]: any };
}

export interface SignInModelType extends CommonModelType {
  namespace: 'signIn';
  state: SignInState;
  effects: {
    getSignIn: Effect;
  };
  reducers: {};
  subscriptions?: { setup: Subscription };
}

const SignInModel: SignInModelType = {
  namespace: 'signIn',

  state: {
    signInData: {},
  },

  effects: {
    *getSignIn({ payload }, { call, put }) {
      const res = yield call(getSignIn, payload);
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            signInData: res.data,
          },
        });
      }
    },
  },

  reducers: {},
};

export default mdlExtend(SignInModel);
