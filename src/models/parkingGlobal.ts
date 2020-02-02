import api from '@/services/index';
import mdlExtend from '@/utils/model';
import { CommonModelType } from '@/common/model';
import { Effect } from 'dva';

const {
  parkingList,
  getParkingItem,
  bindingParkingItemForCar,
  getPersonList,
  changeParkingItem,
  updateParkingSetting,
  addParking,
  editParking,
  getParkingSetting,
  deleteParking,
  addParkingItem,
  getParkingById,
} = api;

export interface ParkingGlobalState {
  parkingList?: any;
  parkingDetail?: any;
  parkingItemList?: any;
  personList?: any;
  parkingConfig?: any;
}

export interface ParkingGlobalType extends CommonModelType {
  namespace: 'parkingGlobal';
  state: ParkingGlobalState;
  effects: {
    getParkingList: Effect;
    getParkingById: Effect;
    getParkingItem: Effect;
    getPersonList: Effect;
    changeParkingItem: Effect;
    bindingParkingItemForCar: Effect;
    updateParkingSetting: Effect;
    addParking: Effect;
    editParking: Effect;
    getParkingSetting: Effect;
    deleteParking: Effect;
    addParkingItem: Effect;
  };
  reducers: {};
  subscriptions?: {};
}

const ParkingGlobal: ParkingGlobalType = {
  namespace: 'parkingGlobal',
  state: {
    parkingList: [],
    parkingItemList: {},
    personList: {},
    parkingDetail: {},
    parkingConfig: {
      enabled: true,
      count: 1,
    },
  },
  effects: {
    *getParkingSetting({ payload }, { call, put }) {
      const { data } = yield call(getParkingSetting);
      if (data) {
        data.enabled = data.state === '1';
        yield put({ type: 'updateState', payload: { parkingConfig: data } });
        return data;
      }
    },

    *getParkingList({ payload }, { call, put }) {
      const { data } = yield call(parkingList, payload);
      if (data) {
        yield put({
          type: 'updateState',
          payload: {
            parkingList: data,
          },
        });
      }
      return data;
    },

    *getPersonList({ payload }, { call, put }) {
      const { data } = yield call(getPersonList, payload);
      if (data) {
        yield put({
          type: 'updateState',
          payload: {
            personList: data,
          },
        });
      }
      return data;
    },

    *getParkingItem({ payload }, { call, put }) {
      const { data } = yield call(getParkingItem, payload);
      if (data) {
        yield put({
          type: 'updateState',
          payload: {
            parkingItemList: data,
          },
        });
      }
      return data;
    },

    *bindingParkingItemForCar({ payload }, { call, put }) {
      const res = yield call(bindingParkingItemForCar, payload);
      return res;
    },

    *changeParkingItem({ payload }, { call }) {
      const { data } = yield call(changeParkingItem, payload);
      return data;
    },

    *updateParkingSetting({ payload }, { call, put }) {
      const res = yield call(updateParkingSetting, payload);
      return res;
    },

    *addParking({ payload }, { call, put }) {
      const res = yield call(addParking, payload);
      return res;
    },

    *editParking({ payload }, { call, put }) {
      const res = yield call(editParking, payload);
      return res;
    },

    *deleteParking({ payload }, { call, put }) {
      const { data } = yield call(deleteParking, payload);
      return data;
    },

    *addParkingItem({ payload }, { call, put }) {
      const res = yield call(addParkingItem, payload);
      return res;
    },

    *getParkingById({ payload }, { call, put }) {
      const res = yield call(getParkingById, payload);
      if (res && res.data) {
        yield put({
          type: 'updateState',
          payload: {
            parkingDetail: res.data,
          },
        });
      }
      return res;
    },
  },

  reducers: {},
};

export default mdlExtend(ParkingGlobal);
