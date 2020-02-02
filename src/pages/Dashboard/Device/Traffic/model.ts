// import { stringify } from 'qs';
// import store from 'store';
import api from '@/services/index';
// import config from '@/utils/config';
import mdlExtend from '@/utils/model';
import { CommonModelType } from '@/common/model';
import { Effect, Subscription } from 'dva';
import { AnyAction } from 'redux';

const {
  getPositionList,
  getPositionDeviceList,
  positionUnbind,
  getDeviceDoor,
  positionBind,
  getDeviceCar,
} = api;

export interface TrafficState {
  tradfficData?: any;
  trafficTreeList?: any;
  doorData?: Array<object>;
  carData?: Array<object>;
  doorBanData?: { [propName: string]: any };
  carBanData?: { [propName: string]: any };
  deviceCount?: number;
}

export interface TrafficModelType extends CommonModelType {
  namespace: 'traffic';
  state: TrafficState;
  effects: {
    getPositionList: Effect;
    getPositionDeviceList: Effect;
    positionUnbind: Effect;
    getDeviceDoor: Effect;
    positionBind: Effect;
    getDeviceCar: Effect;
  };
  reducers: {};
  subscriptions?: { setup: Subscription };
}

const DoorBanModel: TrafficModelType = {
  namespace: 'traffic',

  state: {
    tradfficData: {},
    doorData: [],
    carData: [],
    trafficTreeList: {},
    doorBanData: {},
    carBanData: {},
    deviceCount: 0,
  },

  effects: {
    // 选择通行位置
    *getPositionList(action: AnyAction, { call, put }) {
      const { data } = yield call(getPositionList);
      if (data) {
        yield put({
          type: 'updateState',
          payload: {
            trafficTreeList: data,
          },
        });
      }
      return data;
    },
    // 获取绑定设备信息
    *getPositionDeviceList({ payload }, { call, put }) {
      const { data } = yield call(getPositionDeviceList, payload.id ? payload : null);
      if (data) {
        let carData: any = [];
        let doorData: any = [];
        data.forEach(item => {
          if (item.type === '1') {
            carData.push(item);
          } else {
            doorData.push(item);
          }
        });
        yield put({
          type: 'updateState',
          payload: {
            carData,
            doorData,
            deviceCount: data.length,
          },
        });
      }
      return data;
    },
    // 设备绑定
    *positionBind({ payload }, { call, put }) {
      const res = yield call(positionBind, payload);
      console.log('res: ', res);
      return res;
    },
    // 解除绑定
    *positionUnbind({ payload }, { call, put }) {
      const res = yield call(positionUnbind, payload);
      console.log('res: ', res);
      return res;
    },
    // 获取门禁设备
    *getDeviceDoor({ payload }, { call, put }) {
      const { data } = yield call(getDeviceDoor, payload);
      if (data) {
        yield put({
          type: 'updateState',
          payload: {
            doorBanData: data,
          },
        });
        return data;
      }
    },
    // 获取道闸设备
    *getDeviceCar({ payload }, { call, put }) {
      const { data } = yield call(getDeviceCar, payload);
      if (data) {
        yield put({
          type: 'updateState',
          payload: {
            carBanData: data,
          },
        });
        return data;
      }
    },
  },

  reducers: {},
};

export default mdlExtend(DoorBanModel);
