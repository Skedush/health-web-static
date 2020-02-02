import { CommonModelType } from '@/common/model';
import mdlExtend from '@/utils/model';
import { VillageBaseInfo } from '../model';
import { Effect } from 'dva';
import api from '@/services';

const { updateVillageInfo, distructList, distrucGetParent } = api;
export interface VillageEditState {
  baseInfo: VillageBaseInfo;
}

export interface VillageEditModelType extends CommonModelType {
  namespace: 'villageEdit';
  state: VillageEditState;
  effects: {
    // getCommuntyInfo: Effect;
    submitSave: Effect;
    getAreaTree: Effect;
    getAreaByParent: Effect;
  };
  reducers: {};
  subscriptions: {};
}

const VillageEditModel: VillageEditModelType = {
  namespace: 'villageEdit',

  state: {
    baseInfo: {} as VillageBaseInfo,
  },

  effects: {
    *submitSave(action, { call, put }) {
      yield yield put({ type: 'app/fillingVillage', payload: action.submitData });
      const data = action.submitData;
      data.id = data.villageId;
      delete data.villageId;
      const formDate = new FormData();
      for (const key of Object.keys(data)) {
        formDate.set(key, data[key]);
      }
      const { success } = yield call(updateVillageInfo, formDate);
      return success;
    },
    *getAreaTree(action, { call }) {
      const { data } = yield call(distructList);
      return data;
    },
    *getAreaByParent(action, { call }) {
      const { data } = yield call(distrucGetParent, {
        parentId: action.parentId,
        level: action.level,
      });
      return data;
    },
  },

  reducers: {},

  subscriptions: {},
};

export default mdlExtend(VillageEditModel);
