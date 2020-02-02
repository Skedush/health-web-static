// import { stringify } from 'qs';
// import store from 'store';
import api from '@/services/index';
// import config from '@/utils/config';
import mdlExtend from '@/utils/model';
import { CommonModelType } from '@/common/model';
import { Effect, Subscription } from 'dva';
import { saveAs } from 'file-saver';

const { getPersonRecord, exportPersonRecord } = api;

export interface PersonRecordState {
  personRecordData?: { [propName: string]: any };
}

export interface PersonRecordModelType extends CommonModelType {
  namespace: 'personRecord';
  state: PersonRecordState;
  effects: {
    getPersonRecord: Effect;
    exportPersonRecord: Effect;
  };
  reducers: {};
  subscriptions?: { setup: Subscription };
}

const PersonRecordModel: PersonRecordModelType = {
  namespace: 'personRecord',

  state: {
    personRecordData: {},
  },

  effects: {
    *getPersonRecord({ payload }, { call, put }) {
      const res = yield call(getPersonRecord, payload);
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            personRecordData: res.data,
          },
        });
      }
    },

    *exportPersonRecord({ payload }, { call, put }) {
      const res = yield call(exportPersonRecord, payload, { responseType: 'blob' });
      if (res) {
        const blob = new Blob([res.data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8',
        });
        saveAs(blob, '人员通行记录.xls');
      }
    },
  },

  reducers: {},
};

export default mdlExtend(PersonRecordModel);
