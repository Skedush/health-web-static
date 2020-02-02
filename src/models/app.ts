// import { stringify } from 'qs';
import store from 'store';
import api from '@/services/index';
import config, { RouteList } from '@/utils/config';
import mdlExtend from '@/utils/model';
import { CommonModelType } from '@/common/model';
import { Effect, Subscription } from 'dva';
import { pathMatchRegexp, getBrowserInfo, getSystemBit } from '@/utils';
import { AnyAction } from 'redux';
import { readerDeviceApi } from '@/utils/cardReader';

const {
  queryRouteList,
  getDic,
  logout,
  getUserInfo,
  getAdministrator,
  getInitSetting,
  updateInitSetting,
} = api;

export interface AppState {
  initSetting: any;
  dictionry: object;
  routeList: RouteList[];
  theme?: string;
  collapsed: boolean;
  villageId: number;
  propertyId: number;
  carArea: any;
  carProvince: any;
  carBanAuthSettingData: any;
  userInfo?: any;
  doorBanAuthSettingData: any;
  personTableData?: { [propName: string]: any };
  defaultAuthTime?: any;
  administrator: any;
  usageGuideVisible: boolean;
}

export interface AppModelType extends CommonModelType {
  namespace: 'app';
  state: AppState;
  effects: {
    setUp: Effect;
    query: Effect;
    getDic: Effect;
    fillingVillage: Effect;
    fillingProperty: Effect;
    logout: Effect;
    getAdministrator: Effect;
    readIcCard: Effect;
    getInitSetting: Effect;
    updateInitSetting: Effect;
    operateUsageGuide: Effect;
  };
  reducers: {};
  subscriptions: { setup: Subscription };
}

const AppModel: AppModelType = {
  namespace: 'app',

  state: {
    initSetting: {},
    dictionry: [],
    routeList: config.routeList,
    theme: store.get('theme') || 'light',
    collapsed: store.get('collapsed') || false,
    villageId: 1,
    carProvince: [],
    carArea: [],
    administrator: {},
    defaultAuthTime: null,
    usageGuideVisible: false,

    propertyId: 1,
    carBanAuthSettingData: {
      authState: true,
      autoAuth: false,
      authTimeType: '2',
    },

    doorBanAuthSettingData: {
      authState: true,
      passWay: ['1', '2'],
      autoAuth: true,
      setting: [
        { key: '1', value: '2', bigDoor: true, unitDoor: true },
        { key: '3', value: '1', unitDoor: true },
        { key: '4', value: '7', bigDoor: true },
      ],
    },
  },

  effects: {
    *setUp({ payload }, { select, call, put, all }) {
      if (pathMatchRegexp(['#/', '#/login'], window.location.hash)) {
        console.log('return: ');
        return;
      }
      yield all([
        put({ type: 'query' }),
        put({ type: 'carGlobal/getDoorBanAuthSetting' }),
        put({ type: 'carGlobal/getCarBanAuthSetting' }),
        put({ type: 'parkingGlobal/getParkingSetting' }),
        put({ type: 'getAdministrator', payload: {} }),
        put({ type: 'getInitSetting', payload: {} }),
      ]);
    },
    *query({ payload }, { call, put }) {
      const { name, version } = getBrowserInfo();
      const versionIsNaN = isNaN(Number(version));
      if (!versionIsNaN) {
        if (
          (name === 'Chrome' && Number(version) < 42) ||
          (name === 'IE' && Number(version) < 10)
        ) {
          const bit = getSystemBit();
          const url = `http://41.212.1.154:8080/chrome${bit}_49.0.2623.75.exe`;
          if (window.confirm('该浏览器版本过低，平台无法正常运行，请点击确定下载新版本浏览器')) {
            window.location.assign(url);
          }

          return;
        }
      }

      const res = yield call(queryRouteList, payload);
      if (res.data) {
        yield put({
          type: 'updateState',
          payload: {
            routeList: res.data,
          },
        });
      }

      const userRes = yield call(getUserInfo);
      if (userRes.data) {
        yield put({
          type: 'setUserInfo',
          payload: {
            name: userRes.data.name,
            roleName: userRes.data.roleName,
          },
        });
      }
    },

    *logout({ payload }, { call }) {
      const res = yield call(logout, payload);
      return res;
    },

    *getAdministrator({ payload }, { call, put }) {
      const res = yield call(getAdministrator, payload);
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            administrator: res.data,
          },
        });
      }
    },

    *getDic({ payload }, { select, call, put }) {
      const dictionry = yield select(state => state.app.dictionry);
      if (dictionry[payload.type]) {
        return dictionry[payload.type];
      }
      const res = yield call(getDic, payload);
      if (res.data) {
        for (const key in res.data.dicMap) {
          if (res.data.dicMap.hasOwnProperty(key)) {
            dictionry[key] = res.data.dicMap[key];
          }
        }
        yield put({
          type: 'updateState',
          payload: {
            dictionry: dictionry,
          },
        });
        return res.data;
      }
    },

    *fillingVillage({ payload }, { select, call, put }) {
      const villageId = yield select(state => state.app.villageId);
      if (!payload) {
        return villageId;
      }
      if (payload instanceof FormData) {
        payload.set('villageId', villageId);
      } else {
        payload.villageId = villageId;
      }
    },

    *fillingProperty({ payload }, { select, call, put }) {
      const propertyId = yield select(state => state.app.propertyId);
      if (payload instanceof FormData) {
        payload.set('propertyCompanyId', propertyId);
      } else {
        payload.companyId = propertyId;
      }
    },
    *readIcCard(action: AnyAction, { call }) {
      const param = {
        'OP-DEV': '1',
        'CMD-URL': '5',
      };
      const { data } = yield call(readerDeviceApi, param);
      if (data) {
        const result: string[] = data.name.match(/(?=\D*)(\d)/);
        const readIcData = {
          'OP-DEV': '1',
          'CMD-URL': '1',
          iPort: result[0],
        };
        const cardData = yield call(readerDeviceApi, readIcData);
        return cardData.data;
      }
    },

    *getInitSetting({ payload }, { call, put }) {
      const { data } = yield call(getInitSetting, payload);
      if (data) {
        yield put({
          type: 'updateState',
          payload: {
            initSetting: data,
          },
        });
      }
      return data;
    },

    *updateInitSetting({ payload }, { call, put }) {
      const res = yield call(updateInitSetting, payload);
      return res;
    },
    *operateUsageGuide({ visible }, { put }) {
      yield put({ type: 'updateUsageGuideVisiable', visible });
    },
  },

  reducers: {
    handleCollapseChange(state: AppState, { payload }) {
      store.set('collapsed', payload);
      return { ...state, collapsed: payload };
    },
    setUserInfo(state: AppState, { payload }) {
      return { ...state, userInfo: payload };
    },
    updateUsageGuideVisiable(state: AppState, { visible }) {
      return {
        ...state,
        usageGuideVisible: visible,
      };
    },
  },

  subscriptions: {
    setup({ dispatch }): void {
      dispatch({ type: 'setUp' });
    },
  },
};

export default mdlExtend(AppModel);
