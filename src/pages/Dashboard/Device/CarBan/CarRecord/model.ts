// import { stringify } from 'qs';
// import store from 'store';
import api from '@/services/index';
// import config from '@/utils/config';
import mdlExtend from '@/utils/model';
import { CommonModelType } from '@/common/model';
import { Effect, Subscription } from 'dva';
import { saveAs } from 'file-saver';

const { getCarRecord, exportCarRecord } = api;

export interface CarRecordState {
  carRecordData?: { [propName: string]: any };
}

export interface CarRecordModelType extends CommonModelType {
  namespace: 'carRecord';
  state: CarRecordState;
  effects: {
    getCarRecord: Effect;
    exportCarRecord: Effect;
  };
  reducers: {};
  subscriptions?: { setup: Subscription };
}

const CarRecordModel: CarRecordModelType = {
  namespace: 'carRecord',

  state: {
    carRecordData: {},
  },

  effects: {
    *getCarRecord({ payload }, { call, put }) {
      const res = yield call(getCarRecord, payload);
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            carRecordData: res.data,
          },
        });
      }
    },

    *exportCarRecord({ payload }, { call, put }) {
      const res = yield call(exportCarRecord, payload, { responseType: 'blob' });
      const blob = new Blob([res.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8',
      });
      saveAs(blob, '车辆通行记录.xls');
    },
  },

  reducers: {},
};

export default mdlExtend(CarRecordModel);
