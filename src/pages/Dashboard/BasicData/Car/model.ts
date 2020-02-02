import api from '@/services/index';
import mdlExtend from '@/utils/model';
import { CommonModelType } from '@/common/model';
import { Effect, Subscription } from 'dva';
import { AnyAction } from 'redux';
import { saveAs } from 'file-saver';

const { carDelete, carPage, carUpdate, carImport, carTemplateDownload } = api;

export interface CarBaseInfo {
  carId: string;
  carRegistrarId: string;
  ownerName: string;
  carVillageId: string;
  ownerPhone: string;
  commentContent: string;
  checkDate: string;
  type: string;
  licensePlate: string;
  brand: string;
  color: string;
  idCard: string;
  personId: string;
  remark: string;
  spec: string;
}

export interface CarState {
  modifyData: CarBaseInfo;
  dataList: CarBaseInfo[];

  pageOption: {
    page: number;
    size: number;
    total: number;
  };
}

export interface CarModelType extends CommonModelType {
  namespace: 'car';
  state: CarState;
  effects: {
    getList: Effect;
    deleteCar: Effect;
    getCar: Effect;
    editCar: Effect;
    templateDownload: Effect;
    importData: Effect;
  };
  reducers: {};
  subscriptions?: { setup: Subscription };
}

const CarModel: CarModelType = {
  namespace: 'car',

  state: {
    modifyData: {} as CarBaseInfo,
    dataList: [],
    pageOption: {
      page: 1,
      size: 0,
      total: 0,
    },
  },

  effects: {
    *getList(action: AnyAction, { call, put }) {
      const { data } = yield call(carPage, action.pageOption);
      yield put({ type: 'updateListData', data });
      return data;
    },
    *getCar(action: AnyAction, { call, put }) {
      const { data } = yield call(carPage, action.pageOption);
      yield put({ type: '', data });
      return data;
    },
    *deleteCar({ payload }, { call }) {
      const { data } = yield call(carDelete, payload);
      return data;
    },
    *editCar(action: AnyAction, { call, put }) {
      yield yield put({ type: 'app/fillingVillage', payload: action.data });
      return yield call(carUpdate, action.data);
    },

    *importData({ payload }, { call, put }) {
      const formData = new FormData();
      formData.set('file', payload.file);
      const data = yield call(carImport, formData);
      return data;
    },
    *templateDownload(action, { call }) {
      const { data } = yield call(carTemplateDownload, null, { responseType: 'blob' });
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8',
      });
      saveAs(blob, '车辆导入模板.xls');
    },
  },

  reducers: {
    updateListData(state, { data }: AnyAction) {
      return {
        ...state,
        dataList: data.content,
        pageOption: {
          page: ++data.pageable.pageNumber,
          size: data.pageable.pageSize,
          total: data.totalElements,
        },
      };
    },
  },
};

export default mdlExtend(CarModel);
