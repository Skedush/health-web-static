import api from '@/services/index';
import mdlExtend from '@/utils/model';
import { CommonModelType } from '@/common/model';
import { Effect, Subscription } from 'dva';
import { AnyAction } from 'redux';
import { saveAs } from 'file-saver';
import { getCardInfo } from '@/utils/cardReader';
import { EPersonType } from '@/pages/Dashboard/BasicData/Person/components/PerosonForm';

const {
  personAdd,
  personPage,
  personUpdate,
  logoutPerson,
  personCheck,
  buildingList,
  unitList,
  houseList,
  carAdd,
  personImport,
  personTemplateDownload,
  icCardAdd,
  icCardDelete,
  icCardInfo,
  getCarProvince,
  getCarArea,
  addChild,
  editChild,
  deleteChild,
  houseGet,
  icCardIssued,
  addProperty,
  addProvisional,
  updateAuthCar,
  issuedCarAuthTime,
  updateProperty,
  updateProvisional,
  getAuthTime,
  getWard,
  getCountryList,
  parkingList,
  reletPerson,
  getPersonLicenceInfo,
} = api;

export class PersonBaseInfo {
  id: string;
  bpImageUrl: string;
  bpIdCardImageUrl: string;
  name: string;
  address: string;
  licenceId?: string;
  type: string;
  buildingName?: string;
  rentTime: any | any[];
  sourceDataRentTime: string;
  foreign: boolean;
  authorizeExpireTime: any;
  occupation: string;
  position: string;
  temporaryResidencePermit: string;
  buildingCode: string;
  nationality: string;
  birthday: string;
  unitCode: string;
  houseCode: string;
  phone: string;
  domicile: string;
  idCard: string;
  idCardSource: string;
  tCreateTime: string;
  checkDate: string;
  remarks: string;
  nation: string;
  buildingId: string;
  houseId: string;
  unitId: string;
  subId: string;
  personId: number;
  guardianshipObjectList: any[];
  guardianId: number;
  idCardAddress: string;
  idCardImage: string;
  personType?: EPersonType;
  personTypeMetaData?: string;
  sex: string;
  remark?: string;
  [key: string]: any;
}
export interface PersonModelState {
  houseUnitTreeList: any[];
  unitList: any[];
  houseList: any[];
}

export interface PersonModelType extends CommonModelType {
  state: PersonModelState;
  namespace: 'person';
  effects: {
    getList: Effect;
    getPersonList: Effect;
    deletePerson: Effect;
    addPerson: Effect;
    editPerson: Effect;
    getBuildingList: Effect;
    getUnitList: Effect;
    addCar: Effect;
    getHouseList: Effect;
    importData: Effect;
    templateDownload: Effect;
    checkPerson: Effect;
    addIcCard: Effect;
    deleteIcCard: Effect;
    infoIcCard: Effect;
    getCarProvince: Effect;
    getCarArea: Effect;
    readIdCard: Effect;
    addChild: Effect;
    editChild: Effect;
    getHouse: Effect;
    deleteChild: Effect;
    icCardIssued: Effect;
    addProperty: Effect;
    addProvisional: Effect;
    updateAuthCar: Effect;
    updateCarAuthTime: Effect;
    updateProperty: Effect;
    updateProvisional: Effect;
    getAuthTime: Effect;
    getWard: Effect;
    getCountryList: Effect;
    getParkingSpaceList: Effect;
    getPersonAuthInfo: Effect;
    reletPerson: Effect;
  };
  reducers: {};
  subscriptions?: { setup: Subscription };
}

const PersonModel: PersonModelType = {
  namespace: 'person',

  state: { houseUnitTreeList: [], unitList: [], houseList: [] },

  effects: {
    *getList(action: AnyAction, { call, put }) {
      yield yield put({ type: 'app/fillingVillage', payload: action.pageOption });
      const { data } = yield call(personPage, action.pageOption);
      return data;
    },
    *getPersonList(action: AnyAction, { call, put }) {
      yield yield put({ type: 'app/fillingVillage', payload: action.pageOption });
      const { data } = yield call(personPage, action.pageOption);
      return data;
    },
    *deletePerson(action: AnyAction, operate) {
      const { data } = yield operate.call(logoutPerson, action.deleteList);
      return data;
    },
    *addPerson(action: AnyAction, { call, put }) {
      yield yield put({ type: 'app/fillingVillage', payload: action.data });
      const formData = new FormData();
      for (const key of Object.keys(action.data)) {
        formData.set(key, action.data[key]);
      }
      const { data } = yield call(personAdd, formData);
      return data;
    },
    *addIcCard(action: AnyAction, { call }) {
      const formData = new FormData();
      for (const key of Object.keys(action.data)) {
        formData.set(key, action.data[key]);
      }
      const { data } = yield call(icCardAdd, formData);
      return data;
    },
    *deleteIcCard(action: AnyAction, { call }) {
      const { data } = yield call(icCardDelete, action.data);
      return data;
    },
    *infoIcCard(action: AnyAction, { call }) {
      const { data } = yield call(icCardInfo, action.data);
      return data;
    },
    *editPerson(action: AnyAction, { call, put }) {
      yield yield put({ type: 'app/fillingVillage', payload: action.data });
      const formData = new FormData();
      for (const key of Object.keys(action.data)) {
        formData.set(key, action.data[key]);
      }
      return yield call(personUpdate, formData);
    },
    *readIdCard(action: AnyAction, { call }) {
      const params = {
        'OP-DEV': 1,
        'CMD-URL': 4,
        REPEAT: 1,
        READTYPE: 1,
      };
      const { Certificate, ret } = yield call(getCardInfo, params);
      if (ret === 0) {
        return Certificate;
      }
    },

    *addChild(action: AnyAction, { call, put }) {
      yield yield put({ type: 'app/fillingVillage', payload: action.data });
      const formData = new FormData();
      for (const key of Object.keys(action.data)) {
        formData.set(key, action.data[key]);
      }
      const { data } = yield call(addChild, formData);
      return data;
    },
    *editChild(action: AnyAction, { call, put }) {
      yield yield put({ type: 'app/fillingVillage', payload: action.data });
      const { data } = yield call(editChild, action.data);
      return data;
    },
    *deleteChild(action: AnyAction, { call }) {
      yield call(deleteChild, action.data);
    },
    *checkPerson(action: AnyAction, { call, put }) {
      return yield call(personCheck, action.subId);
    },
    *addCar(action: AnyAction, { call, put }) {
      yield yield put({ type: 'app/fillingVillage', payload: action.data });
      const { data } = yield call(carAdd, action.data);
      return data;
    },
    *getBuildingList(action: AnyAction, { call, put }) {
      const { data } = yield call(buildingList);
      data.forEach(item => {
        item.key = item.id;
        item.value = item.code;
      });
      if (data) {
        yield put({
          type: 'updateState',
          payload: {
            houseUnitTreeList: data,
          },
        });
      }
      return data;
    },
    *getUnitList(action: AnyAction, { call, put }) {
      const { data } = yield call(unitList, { buildingId: action.buildingId });
      data.unitList.forEach(item => {
        item.key = item.id;
        item.value = item.code;
      });
      if (data) {
        yield put({
          type: 'updateState',
          payload: {
            unitList: data.unitList,
          },
        });
      }
      return data;
    },
    *getHouseList(action: AnyAction, { call, put }) {
      const { data } = yield call(houseList, { unitId: action.unitId });
      data.houseList.forEach(item => {
        item.key = item.id;
        item.value = item.code;
      });
      if (data) {
        yield put({
          type: 'updateState',
          payload: {
            houseList: data.houseList,
          },
        });
      }

      return data;
    },
    *importData(action, { call, put }) {
      const formData = new FormData();
      formData.set('file', action.file);
      yield yield put({ type: 'app/fillingVillage', payload: formData });
      const { data } = yield call(personImport, formData);
      return data;
    },
    *templateDownload(action, { call }) {
      const { data } = yield call(personTemplateDownload, null, { responseType: 'blob' });
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8',
      });
      saveAs(blob, '住户导入模板.xls');
    },
    *getCarProvince(_, { call, put }) {
      const { data } = yield call(getCarProvince);
      return data;
    },
    *getCarArea(action: AnyAction, { call, put }) {
      const { data } = yield call(getCarArea, action.data);
      return data;
    },
    *getHouse(action: AnyAction, { call }) {
      const { data } = yield call(houseGet, { id: action.id });
      return data;
    },
    *addProperty(action: AnyAction, { call, put }) {
      yield yield put({ type: 'app/fillingVillage', payload: action.data });
      const formData = new FormData();
      for (const key of Object.keys(action.data)) {
        formData.set(key, action.data[key]);
      }
      yield yield put({ type: 'app/fillingProperty', payload: formData });
      const { data } = yield call(addProperty, formData);
      return data;
    },
    *addProvisional(action: AnyAction, { call, put }) {
      yield yield put({ type: 'app/fillingVillage', payload: action.data });
      const formData = new FormData();
      for (const key of Object.keys(action.data)) {
        formData.set(key, action.data[key]);
      }
      const { data } = yield call(addProvisional, formData);
      return data;
    },
    *updateProvisional(action: AnyAction, { call, put }) {
      const { data } = yield call(updateProvisional, action.data);
      return data;
    },
    *icCardIssued(action: AnyAction, { call }) {
      const { data } = yield call(icCardIssued, action.data);
      return data;
    },
    *updateAuthCar(action: AnyAction, { call }) {
      const { data } = yield call(updateAuthCar, action.data);
      return data;
    },
    *updateCarAuthTime(action: AnyAction, { call }) {
      const { data } = yield call(issuedCarAuthTime, action.data);
      return data;
    },
    *updateProperty(action: AnyAction, { call, put }) {
      yield yield put({ type: 'app/fillingVillage', payload: action.data });
      const formData = new FormData();
      for (const key of Object.keys(action.data)) {
        formData.set(key, action.data[key]);
      }
      yield yield put({ type: 'app/fillingProperty', payload: formData });
      const { data } = yield call(updateProperty, formData);
      return data;
    },
    *getAuthTime(action: AnyAction, { call }) {
      const { data } = yield call(getAuthTime, action.data);
      return data;
    },
    *getWard(action: AnyAction, { call }) {
      const { data } = yield call(getWard, action.data);
      return data;
    },
    *getCountryList(action: AnyAction, { call }) {
      const { data } = yield call(getCountryList);
      return data;
    },
    *getParkingSpaceList(action: AnyAction, { call }) {
      const { data } = yield call(parkingList, action.data);
      return data;
    },
    *getPersonAuthInfo(action: AnyAction, { call }) {
      const { data } = yield call(getPersonLicenceInfo, action.data);
      return data;
    },
    *reletPerson(action: AnyAction, { call }) {
      const { data } = yield call(reletPerson, action.data);
      return data;
    },
  },

  reducers: {},
};

export default mdlExtend(PersonModel);
