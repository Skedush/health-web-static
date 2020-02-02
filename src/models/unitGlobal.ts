import { CommonModelType } from '@/common/model';
import mdlExtend from '@/utils/model';
import { Effect } from 'dva';
import api from '@/services';

const { unitAdd, unitUpdate, unitDelete, unitList, unitGet, getPropertyList, setUnitMgmt } = api;
export interface UnitGlobalState {
  unitData: any[];
  unitDetail: any;
}

export interface UnitGlobalModelType extends CommonModelType {
  namespace: 'unitGlobal';
  state: UnitGlobalState;
  effects: {
    addUnit: Effect;
    updateUnit: Effect;
    deleteUnit: Effect;
    getUnitList: Effect;
    getUnitById: Effect;
    getPropertyList: Effect;
    setUnitMgmt: Effect;
  };
  reducers: {};
  subscriptions: {};
}

const UnitGlobalModel: UnitGlobalModelType = {
  namespace: 'unitGlobal',

  state: {
    unitData: [],
    unitDetail: {},
  },

  effects: {
    *addUnit({ payload }, { call, put }) {
      const allRes: any = {
        addUnit: false,
        generateAddHouse: false,
        batchAddHouse: false,
        unitId: 0,
      };
      const unitInfo = {
        buildingId: payload.buildId,
        code: payload.code,
        aboveNum: payload.aboveNum,
        underNum: payload.underNum,
        doorCount: payload.doorCount,
        elevatorCount: payload.elevatorCount,
      };
      const res = yield call(unitAdd, unitInfo, { autoMessage: false });
      if (res && res.success) {
        allRes.addUnit = res.success;
        allRes.unitId = res.data.id;
        const houseAddInfo = {
          buildingId: payload.buildId,
          unitId: res.data.id,
          aboveNum: payload.aboveNum,
          aboveStartIndex: payload.aboveStartIndex,
          houseCount: payload.houseCount,
          houseStartCode: payload.houseStartCode,
        };
        const houseList = yield yield put({
          type: 'houseGlobal/generateAddHouse',
          payload: houseAddInfo,
        });
        if (houseList && houseList.length > 0) {
          allRes.addUnit = true;
          const { data } = yield yield put({
            type: 'houseGlobal/batchAddHouse',
            payload: houseList,
          });
          if (data) {
            allRes.batchAddHouse = true;
          }
        }
      }
      return allRes;
    },

    *updateUnit({ payload }, { call }) {
      const res = yield call(unitUpdate, payload);
      return res;
    },

    *setUnitMgmt({ payload }, { call }) {
      const res = yield call(setUnitMgmt, payload);
      return res;
    },

    *deleteUnit({ payload }, { call }) {
      const { data } = yield call(unitDelete, payload);
      return data;
    },

    *getUnitById({ payload }, { call, put }) {
      const { data } = yield call(unitGet, payload);
      if (data) {
        yield put({
          type: 'updateState',
          payload: {
            unitDetail: data,
          },
        });
      }
      return data;
    },

    *getPropertyList({ payload }, { call, put }) {
      const { data } = yield call(getPropertyList, payload);
      data.forEach(item => {
        item.key = item.id;
        item.value = item.name;
      });
      return data;
    },

    *getUnitList({ payload }, { call, put }) {
      const { data } = yield call(unitList, payload);
      if (data) {
        data.unitList.forEach(item => {
          item.key = item.id;
          item.value = item.code + '单元';
        });
        yield put({
          type: 'updateState',
          payload: {
            unitData: data,
          },
        });
      }
      return data;
    },
  },

  reducers: {},

  subscriptions: {},
};

export default mdlExtend(UnitGlobalModel);
