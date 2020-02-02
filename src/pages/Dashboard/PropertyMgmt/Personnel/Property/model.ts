import api from '@/services/index';
import mdlExtend from '@/utils/model';
import { CommonModelType } from '@/common/model';
import { Effect, Subscription } from 'dva';
import { encryptValue } from '@/utils';

const { getProperty, addProperty, updateProperty, deleteProperty } = api;

export interface PropertyState {
  propertyData?: { [propName: string]: any };
}

export interface PropertyModelType extends CommonModelType {
  namespace: 'property';
  state: PropertyState;
  effects: {
    getProperty: Effect;
    addProperty: Effect;
    updateProperty: Effect;
    deleteProperty: Effect;
  };
  reducers: {};
  subscriptions?: { setup: Subscription };
}

const PropertyModel: PropertyModelType = {
  namespace: 'property',

  state: {
    propertyData: {},
  },

  effects: {
    *getProperty({ payload }, { call, put }) {
      const res = yield call(getProperty, payload);
      res.data.content.forEach(item => {
        if (item.foreign) {
          item.personTypeStr = item.personTypeStr + '(外籍)';
        }
        item.encryptCardId = encryptValue(item.idCard);
      });
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            propertyData: res.data,
          },
        });
      }
    },

    *addProperty({ payload }, { call, put }) {
      yield yield put({ type: 'app/fillingVillage', payload });
      yield yield put({ type: 'app/fillingProperty', payload });
      yield call(addProperty, payload);
    },

    *updateProperty({ payload }, { call, put }) {
      yield yield put({ type: 'app/fillingVillage', payload });
      yield yield put({ type: 'app/fillingProperty', payload });
      yield call(updateProperty, payload);
    },

    *deleteProperty({ payload }, { call, put }) {
      const { data } = yield call(deleteProperty, payload);
      return data;
    },
  },

  reducers: {},
};

export default mdlExtend(PropertyModel);
