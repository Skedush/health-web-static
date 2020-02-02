import mdlExtend from '@/utils/model';
import { CommonModelType } from '@/common/model';
import { Effect, Subscription } from 'dva';
import api from '@/services';
import { AnyAction } from 'redux';
import { saveAs } from 'file-saver';

const {
  visitDeviceAdd,
  visitDeviceDelete,
  visitDeviceUpdete,
  visitRecordExport,
  visitRecordPage,
  buildingList,
  unitList,
  exportVisitRecord,
  houseList,
} = api;

export interface VisitDeviceBaseInfo {
  id: number;
  type: string;
  address: string;
  buildUnit: string;
  buildUnitPhone: string;
  operator: string;
  operatorPhone: string;
  tCreateTime: string;
  status: string;
  code: string;
  longitude: string;
  latitude: string;
  name: string;
  brand: string;
  spec: string;
  ip: string;
  port: string;
  deviceUserName: string;
  devicePassword: string;
}

export interface VisitRecordBaseInfo {
  faceImageUrl: string;
  name: string;
  phone: string;
  personName: string;
  buildCode: string;
  unitCode: string;
  houseCode: string;
  authTime: string;
  direction: string;
  recordTime: string;
}

export interface VisitState {
  dataList: VisitDeviceBaseInfo[];
  modeifyData: VisitDeviceBaseInfo;
}

export interface VisitModelType extends CommonModelType {
  namespace: 'visitRecord';
  state: VisitState;
  effects: {
    deleteVisitDevice: Effect;
    addVisitDevice: Effect;
    editVisitDevice: Effect;
    exportVisitRecord: Effect;
    getVisitRecordList: Effect;
    getBuildingList: Effect;
    getUnitList: Effect;
    getHouseList: Effect;
    exportRecord: Effect;
  };
  reducers: {};
  subscriptions?: { setup: Subscription };
}

const VisitRecordModel: VisitModelType = {
  namespace: 'visitRecord',

  state: {
    modeifyData: {} as VisitDeviceBaseInfo,
    dataList: [],
  },

  effects: {
    *deleteVisitDevice(action, { call }) {
      yield call(visitDeviceDelete, action.deleteList);
    },
    *addVisitDevice(action, { call }) {
      yield call(visitDeviceAdd, action.data);
    },
    *editVisitDevice(action, { call }) {
      yield call(visitDeviceUpdete, action.data);
    },
    *exportVisitRecord(action, { call, put }) {
      const { data } = yield call(visitRecordExport, action.pageOption);
      return data;
    },
    *getVisitRecordList(action, { call }) {
      const { data } = yield call(visitRecordPage, action.pageOption);
      return data;
    },
    *getBuildingList(action: AnyAction, { call, put }) {
      const queryData = {};
      yield yield put({ type: 'app/fillingVillage', payload: queryData });
      const { data } = yield call(buildingList, queryData);
      data.forEach(item => {
        item.key = item.id;
        item.value = item.code;
      });
      return data;
    },
    *getUnitList(action: AnyAction, { call }) {
      const { data } = yield call(unitList, { buildingId: action.buildingId });
      data.forEach(item => {
        item.key = item.id;
        item.value = item.code;
      });
      return data;
    },
    *getHouseList(action: AnyAction, { call }) {
      const { data } = yield call(houseList, { unitId: action.unitId });
      data.forEach(item => {
        item.key = item.id;
        item.value = item.code;
      });
      return data;
    },
    *exportRecord(action, { call }) {
      const { data } = yield call(
        exportVisitRecord,
        { conditions: action.queryData },
        { responseType: 'blob' },
      );
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8',
      });
      saveAs(blob, '访客记录.xls');
    },
  },

  reducers: {
    updateModifyData(state: any, { data }: AnyAction) {
      return {
        modifyData: data,
      };
    },
  },
};

export default mdlExtend(VisitRecordModel);
