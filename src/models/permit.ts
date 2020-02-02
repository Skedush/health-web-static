import mdlExtend from '@/utils/model';
import { CommonModelType } from '@/common/model';
import { Effect } from 'dva';
import api from '@/services/index';
const {
  getPermitList,
  addPermit,
  updatePermit,
  deletePermit,
  // getPosotionCarList,
  // getPositionPersonList,
  getPositionLists,
  personBindingPermit,
  personUnbindingPermit,
  carBindingPermit,
  carUnbindingPermit,
  modifyPersonPermitTime,
  modifyCarPermitTime,
  getPersonPermitList,
  getCarPermitList,
  updatePersonPermit,
  updateCarPermit,
  getPersonAuthBaseInfo,
  getCarAuthBaseInfo,
  deleteTodo,
  recoverPersonPermit,
  recoverCarPermit,
  getUncheckedPermitList,
  getSelectPermitList,
  updateAllPersonPermit,
  updateAllCarPermit,
  batchUpdatePersonPermit,
} = api;

export interface PermitModelType extends CommonModelType {
  namespace: 'permit';
  state: {};
  effects: {
    getPermitList: Effect;
    addPermit: Effect;
    updatePermit: Effect;
    deletePermit: Effect;
    getPositionList: Effect;
    personBindingPermit: Effect;
    personUnbindingPermit: Effect;
    carBindingPermit: Effect;
    carUnbindingPermit: Effect;
    modifyPersonPermitTime: Effect;
    modifyCarPermitTime: Effect;
    getPersonPermitList: Effect;
    getCarPermitList: Effect;
    updatePersonPermit: Effect;
    updateCarPermit: Effect;
    getPersonAuthBaseInfo: Effect;
    getCarAuthBaseInfo: Effect;
    deleteTodo: Effect;
    recoverPersonPermit: Effect;
    recoverCarPermit: Effect;
    getUncheckedPermitList: Effect;
    getSelectPermitList: Effect;
    updateAllPersonPermit: Effect;
    updateAllCarPermit: Effect;
    batchUpdatePersonPermit: Effect;
  };
  reducers: {};
  subscriptions?: {};
}

const PermitModel: PermitModelType = {
  namespace: 'permit',

  state: {},

  effects: {
    *getPermitList(action, { call }) {
      const { data } = yield call(getPermitList, action.data);
      return data;
    },
    *getSelectPermitList(action, { call }) {
      const { data } = yield call(getSelectPermitList, action.data);
      return data;
    },
    *addPermit(action, { call }) {
      const { data } = yield call(addPermit, action.data);
      return data;
    },
    *updatePermit(action, { call }) {
      const { data } = yield call(updatePermit, action.data);
      return data;
    },
    *deletePermit(action, { call }) {
      const { data } = yield call(deletePermit, action.data);
      return data;
    },
    *getPositionList(action, { call }) {
      const { data } = yield call(
        getPositionLists,
        // action.data.type === '1' ? getPositionPersonList : getPosotionCarList,
      );
      return data;
    },
    *personBindingPermit(action, { call }) {
      const { data } = yield call(personBindingPermit, action.data);
      return data;
    },
    *personUnbindingPermit(action, { call }) {
      const { data } = yield call(personUnbindingPermit, action.data);
      return data;
    },
    *carBindingPermit(action, { call }) {
      const { data } = yield call(carBindingPermit, action.data);
      return data;
    },
    *carUnbindingPermit(action, { call }) {
      const { data } = yield call(carUnbindingPermit, action.data);
      return data;
    },
    *modifyPersonPermitTime(action, { call }) {
      const { data } = yield call(modifyPersonPermitTime, action.data);
      return data;
    },
    *modifyCarPermitTime(action, { call }) {
      const { data } = yield call(modifyCarPermitTime, action.data);
      return data;
    },
    *getPersonPermitList(action, { call }) {
      const { data } = yield call(getPersonPermitList, action.data);
      return data;
    },
    *getCarPermitList(action, { call }) {
      const { data } = yield call(getCarPermitList, action.data);
      return data;
    },
    *updatePersonPermit(action, { call }) {
      const { data } = yield call(updatePersonPermit, action.data);
      return data;
    },
    *updateCarPermit(action, { call }) {
      const { data } = yield call(updateCarPermit, action.data);
      return data;
    },
    *getPersonAuthBaseInfo(action, { call }) {
      const { data } = yield call(getPersonAuthBaseInfo, action.data);
      if (data) {
        data.personDetailList = data.personDetailList || [];
        data.pmPassCardAuthList = data.pmPassCardAuthList || [];
        data.personLicenseNoAuthList = data.personLicenseNoAuthList || [];
        data.pmPersonPassWayList = data.pmPersonPassWayList || [];
        data.personTypeList = data.personTypeList || [];
      }
      return data;
    },
    *getCarAuthBaseInfo(action, { call }) {
      const { data } = yield call(getCarAuthBaseInfo, action.data);
      if (data) {
        data.parkingLotCarList = data.parkingLotCarList || [];
        data.deviceList = data.deviceList || [];
        data.passCardList = data.passCardList || [];
      }
      return data;
    },
    *deleteTodo(action, { call }) {
      const { data } = yield call(deleteTodo, action.data);
      return data;
    },
    *recoverPersonPermit(action, { call }) {
      const { data } = yield call(recoverPersonPermit, action.data);
      return data;
    },
    *recoverCarPermit(action, { call }) {
      const data = yield call(recoverCarPermit, action.payload);
      return data;
    },
    *getUncheckedPermitList(action, { call }) {
      const { data } = yield call(getUncheckedPermitList, { licenceId: action.licenceId });
      return data;
    },
    *updateAllPersonPermit(action, { call }) {
      const { data } = yield call(updateAllPersonPermit);
      return data;
    },
    *updateAllCarPermit(action, { call }) {
      const { data } = yield call(updateAllCarPermit);
      return data;
    },
    *batchUpdatePersonPermit(action, { call }) {
      const { data } = yield call(batchUpdatePersonPermit, action.data);
      return data;
    },
  },

  reducers: {},
};

export default mdlExtend(PermitModel);
