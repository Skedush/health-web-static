// import { stringify } from 'qs';
import api from '@/services/index';
import mdlExtend from '@/utils/model';
import { CommonModelType } from '@/common/model';
import { Effect, Subscription } from 'dva';
import { AnyAction } from 'redux';

const {
  getDoorBanAuthSetting,
  getCarBanAuthSetting,
  getCarProvince,
  getCarArea,
  getProperty,
  personPage,
  getCompanyPerson,
  updateAuthCar,
  carAdd,
  pageProvisional,
  bindingParkingForCar,
} = api;

export interface CarGlobalState {
  carArea: any;
  carProvince: any;
  carBanAuthSettingData: any;
  doorBanAuthSettingData: any;
  personTableData?: { [propName: string]: any };
  defaultAuthTime?: any;
}

export interface CarGlobalModelType extends CommonModelType {
  namespace: 'carGlobal';
  state: CarGlobalState;
  effects: {
    getCarProvince: Effect;
    getCarArea: Effect;
    getDoorBanAuthSetting: Effect;
    getCarBanAuthSetting: Effect;
    getPersonTable: Effect;
    updateAuthCar: Effect;
    addCar: Effect;
    bindingParkingForCar: Effect;
  };
  reducers: {};
  subscriptions: { setup: Subscription };
}
const carTypeToPersonMap = {
  '1': personPage,
  '2': getProperty,
  '3': getCompanyPerson,
  '4': pageProvisional,
};

const CarGlobalModel: CarGlobalModelType = {
  namespace: 'carGlobal',

  state: {
    carProvince: [],
    carArea: [],
    defaultAuthTime: null,
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
    *getPersonTable({ payload }, { call, put }) {
      const { carType } = payload;
      delete payload.carType;
      yield yield put({ type: 'app/fillingVillage', payload });
      const res = yield call(carTypeToPersonMap[carType], payload);
      yield put({
        type: 'updateState',
        payload: {
          personTableData: res.data,
        },
      });
    },

    *addCar(action: AnyAction, { call, put }) {
      yield yield put({ type: 'app/fillingVillage', payload: action.data });
      return yield call(carAdd, action.data);
    },

    *updateAuthCar({ payload }, { call, put }) {
      return yield call(updateAuthCar, payload);
    },
    *getDoorBanAuthSetting({ payload }, { call, put }) {
      const res = yield call(getDoorBanAuthSetting, payload);
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            doorBanAuthSettingData: res.data,
          },
        });
      }
      if (res) return res.data;
    },
    *getCarBanAuthSetting({ payload }, { call, put }) {
      const res = yield call(getCarBanAuthSetting, payload);
      if (res.success) {
        yield put({
          type: 'updateState',
          payload: {
            carBanAuthSettingData: res.data,
          },
        });
      }
      if (res) return res.data;
    },

    *getCarProvince(_, { call, put }) {
      const res = yield call(getCarProvince);
      yield put({
        type: 'updateState',
        payload: {
          carProvince: res.data,
        },
      });
    },
    *getCarArea({ payload }, { call, put }) {
      const res = yield call(getCarArea, payload);
      yield put({
        type: 'updateState',
        payload: {
          carArea: res.data,
        },
      });
    },

    *bindingParkingForCar({ payload }, { call, put }) {
      return yield call(bindingParkingForCar, payload);
    },
  },

  reducers: {},

  subscriptions: {
    setup({ dispatch }): void {},
  },
};

export default mdlExtend(CarGlobalModel);
