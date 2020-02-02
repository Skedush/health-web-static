// import { stringify } from 'qs';
// import store from 'store';
import api from '@/services/index';
// import config from '@/utils/config';
import mdlExtend from '@/utils/model';
import { CommonModelType } from '@/common/model';
import { Effect, Subscription } from 'dva';

const { getVolunteer, addVolunteer, updateVolunteer, deleteVolunteer } = api;

export interface VolunteerState {
  volunteerData?: { [propName: string]: any };
}

export interface VolunteerModelType extends CommonModelType {
  namespace: 'volunteer';
  state: VolunteerState;
  effects: {
    getVolunteer: Effect;
    addVolunteer: Effect;
    updateVolunteer: Effect;
    deleteVolunteer: Effect;
  };
  reducers: {};
  subscriptions?: { setup: Subscription };
}

const VolunteerModel: VolunteerModelType = {
  namespace: 'volunteer',

  state: {
    volunteerData: {},
  },

  effects: {
    *getVolunteer({ payload }, { call, put }) {
      const res = yield call(getVolunteer, payload);
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            volunteerData: res.data,
          },
        });
      }
    },

    *addVolunteer({ payload }, { call, put }) {
      yield yield put({ type: 'app/fillingVillage', payload });
      yield call(addVolunteer, payload);
    },

    *updateVolunteer({ payload }, { call, put }) {
      yield yield put({ type: 'app/fillingVillage', payload });
      yield call(updateVolunteer, payload);
    },

    *deleteVolunteer({ payload }, { call, put }) {
      yield call(deleteVolunteer, payload);
    },
  },

  reducers: {},
};

export default mdlExtend(VolunteerModel);
