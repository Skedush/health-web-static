import { CommonModelType } from '@/common/model';
import mdlExtend from '@/utils/model';
import { Effect } from 'dva';
import api from '@/services';

const {
  houseAdd,
  houseDelete,
  houseList,
  batchAddHouse,
  houseGet,
  setHouseHold,
  generateAddHouse,
} = api;
export interface HouseGlobalState {
  houseData: any[];
  houseDetail: any;
}

export interface HouseGlobalModelType extends CommonModelType {
  namespace: 'houseGlobal';
  state: HouseGlobalState;
  effects: {
    generateAddHouse: Effect;
    addHouse: Effect;
    deleteHouse: Effect;
    getHouseList: Effect;
    getHouseById: Effect;
    batchAddHouse: Effect;
    setHouseHold: Effect;
  };
  reducers: {};
  subscriptions: {};
}

const HouseGlobalModel: HouseGlobalModelType = {
  namespace: 'houseGlobal',

  state: {
    houseData: [],
    houseDetail: {},
  },

  effects: {
    *generateAddHouse({ payload }, { call }) {
      const { data } = yield call(generateAddHouse, payload, { autoMessage: false });
      return data;
    },

    *setHouseHold({ payload }, { call }) {
      const res = yield call(setHouseHold, payload);
      return res;
    },

    *getHouseById({ payload }, { call, put }) {
      const { data } = yield call(houseGet, payload);
      if (data) {
        yield put({
          type: 'updateState',
          payload: {
            houseDetail: data,
          },
        });
      }
      return data;
    },

    *addHouse({ payload }, { call }) {
      const { data } = yield call(houseAdd, payload);
      return data;
    },

    *deleteHouse({ payload }, { call }) {
      const { data } = yield call(houseDelete, payload);
      return data;
    },

    *getHouseList({ payload }, { call, put }) {
      const { data } = yield call(houseList, payload);
      if (data) {
        if (data.houseList) {
          const list: any[] = [];
          for (let i = 1; i <= data.floorCount; i++) {
            const temp: any = { floor: i, houses: [] };
            data.houseList.forEach(item => {
              if (item.floor === i) {
                temp.houses.push(item);
              }
            });
            list.push(temp);
          }
          data.houseList = list;
          yield put({
            type: 'updateState',
            payload: {
              houseData: data,
            },
          });
        }
      }
      return data;
    },

    *batchAddHouse({ payload }, { call, put }) {
      const res = yield call(batchAddHouse, payload);
      return res;
    },
  },

  reducers: {},

  subscriptions: {},
};

export default mdlExtend(HouseGlobalModel);
