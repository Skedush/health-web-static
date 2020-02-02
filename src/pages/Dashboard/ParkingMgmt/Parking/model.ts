import api from '@/services/index';
import mdlExtend from '@/utils/model';
import { CommonModelType } from '@/common/model';
import { Effect } from 'dva';
import { AnyAction } from 'redux';

const {
  getParkingDeviceList,
  addParking,
  editParking,
  deleteParking,
  getParkingOptionalDevice,
  parkingList,
  addParkingItem,
  bindingParkingDevice,
  unbindingParkingDevice,
  sellParkingItem,
  getParkingItemById,
  getCarByPlate,
  resellParkingItem,
  unbindParkingForCar,
  unbindParkingItemPerson,
  deleteParkingItem,
  renewParkingItem,
  getParkingCarList,
  getCarForId,
  getNotInParkingCar,
  bindingParkingForCar, // 公共停车场绑定车辆
  unbindingParkingForCar, // 公共停车场解绑车辆
  bindingParkingItemForCar,
  getCarDetail,
  getSelectCarList,
} = api;

export interface ParkingState {
  propertyData?: { [propName: string]: any };
  parkingItemInfo: any;
  parkingCarList?: any;
  carDetail?: any;
  notInParkingCarList: any;
  carList?: any;
}

export interface ParkingModelType extends CommonModelType {
  namespace: 'parking';
  state: ParkingState;
  effects: {
    getParkingList: Effect;
    getParkingDeviceList: Effect;
    addParking: Effect;
    editParking: Effect;
    deleteParking: Effect;
    getParkingOptionalDevice: Effect;
    addParkingItem: Effect;
    bindingParkingDevice: Effect;
    unbindingParkingDevice: Effect;
    sellParkingItem: Effect;
    getParkingItemById: Effect;
    getCarByPlate: Effect;
    bindingParkingItemForCar: Effect;
    resellParkingItem: Effect;
    unbindParkingForCar: Effect;
    unbindParkingItemPerson: Effect;
    deleteParkingItem: Effect;
    renewParkingItem: Effect;
    getParkingCarList: Effect;
    getCarForId: Effect;
    bindingParkingForCar: Effect;
    unbindingParkingForCar: Effect;
    getNotInParkingCar: Effect;
    getCarDetail: Effect;
    getSelectCarList: Effect;
  };
  reducers: {};
  subscriptions?: {};
}

const ParkingModel: ParkingModelType = {
  namespace: 'parking',

  state: {
    parkingItemInfo: {},
    notInParkingCarList: {},
    parkingCarList: {},
    carList: [],
  },

  effects: {
    *getParkingList(action: AnyAction, { call }) {
      const { data } = yield call(parkingList, action.data);
      return data;
    },

    *getParkingDeviceList(action: AnyAction, { call }) {
      const { data } = yield call(getParkingDeviceList, action.data);
      return data;
    },
    *addParking(action: AnyAction, { call }) {
      const { data } = yield call(addParking, action.data);
      return data;
    },

    *editParking(action: AnyAction, { call }) {
      const { data } = yield call(editParking, action.data);
      return data;
    },
    *deleteParking(action: AnyAction, { call }) {
      const { data } = yield call(deleteParking, action.data);
      return data;
    },
    *getParkingOptionalDevice(action: AnyAction, { call }) {
      const { data } = yield call(getParkingOptionalDevice, action.data);
      return data;
    },

    *bindingParkingDevice(action: AnyAction, { call }) {
      const { data } = yield call(bindingParkingDevice, action.data);
      return data;
    },
    *unbindingParkingDevice(action: AnyAction, { call }) {
      const { data } = yield call(unbindingParkingDevice, action.data.id);
      return data;
    },

    *addParkingItem({ payload }, { call }) {
      const res = yield call(addParkingItem, payload);
      if (res.data) {
        return res;
      }
    },

    *sellParkingItem({ payload }, { call }) {
      const res = yield call(sellParkingItem, payload);
      return res;
    },

    *getParkingItemById({ payload }, { call, put }) {
      const { data } = yield call(getParkingItemById, payload);
      if (data) {
        yield put({
          type: 'updateState',
          payload: {
            parkingItemInfo: data,
          },
        });
        return data;
      }
    },

    *getCarByPlate({ payload }, { call, put }) {
      const { data } = yield call(getCarByPlate, payload);
      if (data) {
        return data;
      }
    },

    *bindingParkingItemForCar({ payload }, { call, put }) {
      const res = yield call(bindingParkingItemForCar, payload);
      if (res.success) {
        return res;
      }
    },

    *resellParkingItem({ payload }, { call, put }) {
      const res = yield call(resellParkingItem, payload);
      if (res.success) {
        return res;
      }
    },

    *unbindParkingForCar({ payload }, { call, put }) {
      const res = yield call(unbindParkingForCar, payload);
      if (res.success) {
        return res;
      }
    },

    *unbindParkingItemPerson({ payload }, { call, put }) {
      const res = yield call(unbindParkingItemPerson, payload);
      if (res.success) {
        return res;
      }
    },

    *deleteParkingItem({ payload }, { call, put }) {
      const res = yield call(deleteParkingItem, payload);
      if (res.success) {
        return res;
      }
    },

    *renewParkingItem({ payload }, { call, put }) {
      const res = yield call(renewParkingItem, payload);
      if (res.success) {
        return res;
      }
    },

    *getParkingCarList({ payload }, { call, put }) {
      const { data } = yield call(getParkingCarList, payload);
      if (data) {
        yield put({
          type: 'updateState',
          payload: {
            parkingCarList: data,
          },
        });
        return data;
      }
    },

    *getNotInParkingCar({ payload }, { call, put }) {
      const { data } = yield call(getNotInParkingCar, payload);
      if (data) {
        yield put({
          type: 'updateState',
          payload: {
            notInParkingCarList: data,
          },
        });
        return data;
      }
    },

    *getCarForId({ payload }, { call, put }) {
      const { data } = yield call(getCarForId, payload);
      if (data) {
        yield put({
          type: 'updateState',
          payload: {
            carDetail: data,
          },
        });
        return data;
      }
    },

    *getCarDetail({ payload }, { call, put }) {
      const { data } = yield call(getCarDetail, payload);
      if (data) {
        yield put({
          type: 'updateState',
          payload: {
            carDetail: data,
          },
        });
        return data;
      }
    },

    *unbindingParkingForCar({ payload }, { call, put }) {
      const res = yield call(unbindingParkingForCar, payload);
      if (res) {
        return res;
      }
    },

    *bindingParkingForCar({ payload }, { call, put }) {
      const res = yield call(bindingParkingForCar, payload);
      if (res) {
        return res;
      }
    },

    *getSelectCarList({ payload }, { call, put }) {
      const { data } = yield call(getSelectCarList, payload);
      if (data) {
        yield put({
          type: 'updateState',
          payload: {
            carList: data,
          },
        });
        return data;
      }
    },
  },

  reducers: {},
};

export default mdlExtend(ParkingModel);
