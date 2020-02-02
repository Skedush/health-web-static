import api from '@/services/index';
import mdlExtend from '@/utils/model';
import { CommonModelType } from '@/common/model';
import { Effect, Subscription } from 'dva';
import { AnyAction } from 'redux';

const {
  getIcCardList,
  addIcCard,
  iussedIcCardAuth,
  updateIcCard,
  deleteIcCard,
  addICCardLicence,
  getIcCardDetail,
} = api;

export interface IcCardModelType extends CommonModelType {
  namespace: 'icCard';
  state: {};
  effects: {
    getIcCardList: Effect;
    addIcCard: Effect;
    iussedIcCardAuth: Effect;
    updateIcCard: Effect;
    deleteIcCard: Effect;
    addICCardLicence: Effect;
    getIcCardDetail: Effect;
  };
  reducers: {};
  subscriptions?: { setup: Subscription };
}

const PropertyModel: IcCardModelType = {
  namespace: 'icCard',

  state: {},

  effects: {
    *getIcCardList(action: AnyAction, { call }) {
      const { data } = yield call(getIcCardList, action.data);
      return data;
    },
    *addIcCard(action: AnyAction, { call }) {
      const { data } = yield call(addIcCard, action.data);
      return data;
    },
    *iussedIcCardAuth(action: AnyAction, { call }) {
      const { data } = yield call(iussedIcCardAuth, action.data);
      return data;
    },
    *updateIcCard(action: AnyAction, { call }) {
      const { data } = yield call(updateIcCard, action.data);
      return data;
    },
    *deleteIcCard(action: AnyAction, { call }) {
      const { data } = yield call(deleteIcCard, action.data);
      return data;
    },
    *addICCardLicence(action, { call }) {
      const { data } = yield call(addICCardLicence, action.data);
      return data;
    },
    *getIcCardDetail(action, { call }) {
      const { data } = yield call(getIcCardDetail, action.data);
      return data;
    },
  },

  reducers: {},
};

export default mdlExtend(PropertyModel);
