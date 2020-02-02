import api from '@/services/index';
import mdlExtend from '@/utils/model';
import { CommonModelType } from '@/common/model';
import { Effect } from 'dva';
import { AnyAction } from 'redux';

const { updateParkingSetting } = api;

export interface ParkingRuleState {
  propertyData?: { [propName: string]: any };
}

export interface ParkingRuleModelType extends CommonModelType {
  namespace: 'parkingRule';
  state: ParkingRuleState;
  effects: {
    updateParkingSetting: Effect;
  };
  reducers: {};
  subscriptions?: {};
}

const ParkingRuleModel: ParkingRuleModelType = {
  namespace: 'parkingRule',

  state: {
    propertyData: {},
  },

  effects: {
    *updateParkingSetting(action: AnyAction, { call }) {
      const { data } = yield call(updateParkingSetting, action.data);
      return data;
    },
  },

  reducers: {},
};

export default mdlExtend(ParkingRuleModel);
