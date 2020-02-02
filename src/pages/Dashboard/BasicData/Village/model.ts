import { CommonModelType } from '@/common/model';
import { Effect } from 'dva';
import mdlExtend from '@/utils/model';
import { AnyAction } from 'redux';
import api from '@/services';
import { Moment } from 'moment';

const { villageInfo, distructList, distrucGetParent } = api;

export interface VillageBaseInfo {
  village: {
    image: string;
    name: string;
    construction: string;
    constructionCN: string;
    constructionPhone: string;
    operate: string;
    operateCN: string;
    operatePhone: string;
    buildDay: string | Moment;
    city: string;
    province: string;
    country: string;
    address: string;
    cityId: string;
    countyId: string;
    provinceId: string;
    streetId: string;
    doorCount: number;
  };
  villagePoliceResp: {
    code: string;
    policeImage: string;
    policeAddress: string;
    policeCompanyName: string;
    policeName: string;
    policePhone: string;
    name: string;
    phone: string;
    jurisdiction: string;
    policeOrganizationName: string;
    image: string;
  };
}
export interface VillageState {
  baseInfo: VillageBaseInfo;
}

export interface VillageModelType extends CommonModelType {
  namespace: 'village';
  state: VillageState;
  effects: {
    getCommuntyInfo: Effect;
    getAreaData: Effect;
    getAreaByParent: Effect;
  };
  reducers: {};
  subscriptions: {};
}

const VillageModel: VillageModelType = {
  namespace: 'village',

  state: {
    baseInfo: {
      village: {},
      villagePoliceResp: {},
    } as VillageBaseInfo,
  },

  effects: {
    *getCommuntyInfo(action: AnyAction, { call, put }) {
      const queryData = {};
      yield yield put({ type: 'app/fillingVillage', payload: queryData });
      const { data } = yield call(villageInfo, queryData);
      yield put({
        type: 'updateBaseInfo',
        baseInfo: data || ({} as VillageBaseInfo),
      });
      return data;
    },
    *getAreaData(action: AnyAction, { call }) {
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

  reducers: {
    updateBaseInfo(state: VillageBaseInfo, { baseInfo }: AnyAction) {
      return {
        baseInfo,
      };
    },
  },

  subscriptions: {},
};

export default mdlExtend(VillageModel);
