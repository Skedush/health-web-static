import { router } from '@/utils';
import { CommonModelType } from '@/common/model';
import { Effect } from 'dva';
import mdlExtend from '@/utils/model';
import api from '@/services';
import { AnyAction } from 'redux';

const { login } = api;

export interface LoginState {
  userName?: string;
  password?: string;
  displayPwd: boolean;
  currentlyfocus: 'userName' | 'password' | null;
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

  state: {
    displayPwd: false,
    currentlyfocus: null,
  },

  effects: {
    *login({ payload }, { call, put, all }) {
      const res = yield call(login, payload);
      if (res.data) {
        const { menuList } = res.data;
        const routeList = menuList || [];
        // console.log('routeList: ', routeList);
        yield all([
          put({
            type: 'app/updateState',
            payload: { routeList },
          }),
          put({ type: 'carGlobal/getDoorBanAuthSetting' }),
          put({ type: 'carGlobal/getCarBanAuthSetting' }),
          put({ type: 'parkingGlobal/getParkingSetting' }),
          put({ type: 'app/getAdministrator', payload: {} }),
        ]);
        const data = yield yield put({ type: 'app/getInitSetting' });
        if (data && data.endState === '0') {
          router.push('/initialization');
        } else {
          router.push('/dashboard');
        }

        return res;
      } else {
        throw res;
      }
    },
  },

  reducers: {
    showPassword(state: LoginState) {
      return {
        displayPwd: !state.displayPwd,
      };
    },
    focusState(state: LoginState, { focusType }: AnyAction) {
      return {
        currentlyfocus: focusType,
      };
    },
  },

  subscriptions: {},
};

export default mdlExtend(LoginModel);
