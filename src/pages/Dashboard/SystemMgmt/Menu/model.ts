// import { stringify } from 'qs';
// import store from 'store';
import api from '@/services/index';
// import config from '@/utils/config';
import mdlExtend from '@/utils/model';
import { CommonModelType } from '@/common/model';
import { Effect, Subscription } from 'dva';

const { getMenu, addMenu, updateMenu, deleteMenu, getMenuList } = api;

export interface MenuState {
  menuData?: { [propName: string]: any };
  menuList?: { [propName: string]: any };
}

export interface MenuModelType extends CommonModelType {
  namespace: 'menu';
  state: MenuState;
  effects: {
    getMenu: Effect;
    getMenuList: Effect;
    addMenu: Effect;
    updateMenu: Effect;
    deleteMenu: Effect;
  };
  reducers: {};
  subscriptions?: { setup: Subscription };
}

const MenuModel: MenuModelType = {
  namespace: 'menu',

  state: {
    menuData: {},
  },

  effects: {
    *getMenu({ payload }, { call, put }) {
      const res = yield call(getMenu, payload);
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            menuData: res.data,
          },
        });
      }
    },

    *getMenuList({ payload }, { call, put }) {
      const res = yield call(getMenuList, payload);
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            menuList: res.data,
          },
        });
      }
    },

    *addMenu({ payload }, { call }) {
      yield call(addMenu, payload);
    },

    *updateMenu({ payload }, { call }) {
      yield call(updateMenu, payload);
    },

    *deleteMenu({ payload }, { call }) {
      const { data } = yield call(deleteMenu, payload);
      return data;
    },
  },

  reducers: {},
};

export default mdlExtend(MenuModel);
