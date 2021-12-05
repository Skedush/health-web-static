// import { stringify } from 'qs';
// import store from 'store';
import { CommonModelType } from '@/common/model';
import api from '@/services/index';
// import config from '@/utils/config';
import mdlExtend from '@/utils/model';
import { Effect, Subscription } from 'dva';

const { getResult, updateUserEntry } = api;

export interface ResultState {
  resultData: any;
  entryGroups: any[];
}

export interface ResultModelType extends CommonModelType {
  namespace: 'result';
  state: ResultState;
  effects: {
    getResult: Effect;
    updateUserEntry: Effect;
  };
  reducers: {};
  subscriptions?: { setup: Subscription };
}

const ResultModel: ResultModelType = {
  namespace: 'result',

  state: {
    resultData: {},
    entryGroups: [],
  },

  effects: {
    *getResult({ payload }, { call, put }) {
      const res = yield call(getResult, payload);
      if (res && res.data) {
        const {
          data: { entryship },
        } = res;
        const entryGroups: any = [];
        entryship.forEach(item => {
          const entryGroupItem = entryGroups.find((groupItem: any) => {
            return groupItem.category === item.category.name;
          });

          if (!entryGroupItem) {
            entryGroups.push({ category: item.category.name, entrys: [item] });
          } else {
            entryGroupItem.entrys.push(item);
          }

          item.entrys.forEach(element => {
            const entryGroupItem = entryGroups.find(groupItem => {
              return groupItem.category === element.category.name;
            });
            if (!entryGroupItem) {
              element.number = 1;
              entryGroups.push({ category: element.category.name, entrys: [element] });
            } else {
              const entry = entryGroupItem.entrys.find(entry => {
                return entry.id === element.id;
              });
              if (!entry) {
                element.number = 1;
                entryGroupItem.entrys.push(element);
              } else {
                entry.number = entry.number + 1;
              }
            }
          });
        });
        // if (entryGroups && entryGroups.length > 2) {
        //   entryGroups[2] = entryGroups.splice(0, 1, entryGroups[2])[0];
        // } else if (entryGroups && entryGroups.length > 1) {
        //   entryGroups[1] = entryGroups.splice(0, 1, entryGroups[1])[0];
        // }
        yield put({
          type: 'updateState',
          payload: {
            entryGroups,
            resultData: res.data,
          },
        });
        return res.data;
      }
    },

    *updateUserEntry({ payload }, { call, put }) {
      const res = yield call(updateUserEntry, payload);
      if (res && res.success) {
        return res;
      }
    },
  },

  reducers: {},
};

export default mdlExtend(ResultModel);
