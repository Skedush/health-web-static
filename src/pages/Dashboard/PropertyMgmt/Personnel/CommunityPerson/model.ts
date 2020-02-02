// import { stringify } from 'qs';
// import store from 'store';
import api from '@/services/index';
// import config from '@/utils/config';
import mdlExtend from '@/utils/model';
import { CommonModelType } from '@/common/model';
import { Effect, Subscription } from 'dva';

const {
  getCommunityPerson,
  addCommunityPerson,
  updateCommunityPerson,
  deleteCommunityPerson,
} = api;

export interface CommunityPersonState {
  communityPersonData?: { [propName: string]: any };
}

export interface CommunityPersonModelType extends CommonModelType {
  namespace: 'communityPerson';
  state: CommunityPersonState;
  effects: {
    getCommunityPerson: Effect;
    addCommunityPerson: Effect;
    updateCommunityPerson: Effect;
    deleteCommunityPerson: Effect;
  };
  reducers: {};
  subscriptions?: { setup: Subscription };
}

const CommunityPersonModel: CommunityPersonModelType = {
  namespace: 'communityPerson',

  state: {
    communityPersonData: {},
  },

  effects: {
    *getCommunityPerson({ payload }, { call, put }) {
      const res = yield call(getCommunityPerson, payload);
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            communityPersonData: res.data,
          },
        });
      }
    },

    *addCommunityPerson({ payload }, { call, put }) {
      yield yield put({ type: 'app/fillingVillage', payload });
      yield call(addCommunityPerson, payload);
    },

    *updateCommunityPerson({ payload }, { call, put }) {
      yield yield put({ type: 'app/fillingVillage', payload });
      yield call(updateCommunityPerson, payload);
    },

    *deleteCommunityPerson({ payload }, { call, put }) {
      yield call(deleteCommunityPerson, payload);
    },
  },

  reducers: {},
};

export default mdlExtend(CommunityPersonModel);
