import { CommonModelType } from '@/common/model';
import mdlExtend from '@/utils/model';
import { Effect } from 'dva';
import api from '@/services';

const { getEntranceList, addEntrance, updateEntrance, deleteEntrance } = api;
export interface InitGlobalState {
  entranceList: any[];
}

export interface InitGlobalModelType extends CommonModelType {
  namespace: 'initGlobal';
  state: InitGlobalState;
  effects: {
    getEntranceList: Effect;
    addEntrance: Effect;
    updateEntrance: Effect;
    deleteEntrance: Effect;
  };
  reducers: {};
  subscriptions: {};
}

const InitGlobalModel: InitGlobalModelType = {
  namespace: 'initGlobal',

  state: {
    entranceList: [],
  },

  effects: {
    *getEntranceList({ payload }, { call, put }) {
      const { data } = yield call(getEntranceList);
      if (data) {
        yield put({
          type: 'updateState',
          payload: {
            entranceList: data,
          },
        });
      }
      return data;
    },

    *addEntrance({ payload }, { call }) {
      const res = yield call(addEntrance, payload);
      return res;
    },

    *updateEntrance({ payload }, { call }) {
      const res = yield call(updateEntrance, payload);
      return res;
    },

    *deleteEntrance({ payload }, { call }) {
      const { data } = yield call(deleteEntrance, payload);
      return data;
    },
  },

  reducers: {},

  subscriptions: {},
};

export default mdlExtend(InitGlobalModel);
