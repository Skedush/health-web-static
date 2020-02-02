import { CommonModelType } from '@/common/model';
import mdlExtend from '@/utils/model';
import { Effect } from 'dva';
import api from '@/services';

const { buildingAdd, buildingDelete, batchAddBuild, getBuildingAndUnitTree, buildingList } = api;
export interface BuildGlobalState {
  buildingUnitTree: any[];
}

export interface BuildGlobalModelType extends CommonModelType {
  namespace: 'buildGlobal';
  state: BuildGlobalState;
  effects: {
    buildingAdd: Effect;
    batchAddBuild: Effect;
    getBuildingList: Effect;
    buildingDelete: Effect;
    getBuildingAndUnitTree: Effect;
  };
  reducers: {};
  subscriptions: {};
}

const BuildGlobalModel: BuildGlobalModelType = {
  namespace: 'buildGlobal',

  state: {
    buildingUnitTree: [],
  },

  effects: {
    *getBuildingList({ payload }, { call, put }) {
      const { data } = yield call(buildingList, payload);
      data.forEach(item => {
        item.key = item.id;
        item.value = item.name;
      });
      return data;
    },
    *buildingAdd({ payload }, { call }) {
      const { data } = yield call(buildingAdd, payload);
      return data;
    },
    *batchAddBuild({ payload }, { call }) {
      const res = yield call(batchAddBuild, payload);
      return res;
    },

    *buildingDelete({ payload }, { call }) {
      const { data } = yield call(buildingDelete, payload);
      return data;
    },

    *getBuildingAndUnitTree({ payload }, { call, put }) {
      const { data } = yield call(getBuildingAndUnitTree);
      if (data) {
        yield put({
          type: 'updateState',
          payload: {
            buildingUnitTree: data,
          },
        });
      }
      return data;
    },
  },

  reducers: {},

  subscriptions: {},
};

export default mdlExtend(BuildGlobalModel);
