import { CommonModelType } from '@/common/model';
import { Effect } from 'dva';
import mdlExtend from '@/utils/model';
// import { AnyAction } from 'redux';
import api from '@/services';
// import { cpus } from 'os';

const {
  getCompany,
  getPerson,
  addCompany,
  buildingList,
  companyDelete,
  personDetele,
  companyPersonAdd,
  companyPersonUpdate,
  updateCompany,
  getCompanyById,
} = api;

export interface CompanyBaseInfo {
  content: any;
  pageable: any;
  last: boolean;
  number: number;
  totalPages: number;
  totalElements: number;
  size: number;
  sort: any;
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}
export interface CompanyPerson {
  content: Person[];
  pageable: { [propName: string]: any };
  totalElements: number;
}
interface Person {
  id: number;
  companyId: number;
  villageId: number;
  name: string;
  image: string;
  idCardImage: string;
  position: string;
  phone: string;
  nation: string;
  idCard: string;
  domicile: string;
  temporaryAddress: string;
  registerTime: string;
}
interface Option {
  value?: string;
  label?: React.ReactNode;
  disabled?: boolean;
  isLeaf?: boolean;
  loading?: boolean;
  children?: Option[];
  [key: string]: any;
}

interface UnitdropDownData {
  id: number;
  villageId: number;
  code: string;
  name: string;
}
export interface CompanyState {
  companyInfo: any;
  baseInfo: CompanyBaseInfo;
  personInfo: CompanyPerson;
  unitdropDownData: UnitdropDownData[];
  cascaderOption: Option[];
}

export interface CompanyModelType extends CommonModelType {
  namespace: 'communtyInfo';
  state: CompanyState;
  effects: {
    getCompany: Effect;
    getCompanyPerson: Effect;
    addCompany: Effect;
    buildingList: Effect;
    companyDelete: Effect;
    personDetele: Effect;
    companyPersonAdd: Effect;
    companyPersonUpdate: Effect;
    updateCompany: Effect;
    getCompanyById: Effect;
  };
  reducers: {};
  subscriptions: {};
}

const CompanyModel: CompanyModelType = {
  namespace: 'communtyInfo',

  state: {
    baseInfo: {} as CompanyBaseInfo,
    personInfo: {} as CompanyPerson,
    unitdropDownData: [],
    companyInfo: {},
    cascaderOption: [],
  },

  effects: {
    *getCompany({ payload }, { call, put }) {
      const res = yield call(getCompany, payload);
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            baseInfo: res.data,
          },
        });
      }
      return res;
    },

    *getCompanyById({ payload }, { call, put }) {
      const res = yield call(getCompanyById, payload);
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            companyInfo: res.data,
          },
        });
      }
      return res;
    },

    *addCompany({ payload }, { call, put }) {
      const res = yield call(addCompany, payload);
      return res;
    },
    *updateCompany({ payload }, { call, put }) {
      return yield call(updateCompany, payload);
    },
    // 获取楼栋信息
    *buildingList({ payload }, { call, put }) {
      const res = yield call(buildingList, payload);

      if (res) {
        yield put({
          type: 'setCascader',
          payload: {
            cascaderOption: res.data,
          },
        });
      }
      return res;
    },
    // 删除单位
    *companyDelete({ payload }, { call }) {
      const res = yield call(companyDelete, payload);
      return res;
    },

    // 获取单位人员
    *getCompanyPerson({ payload }, { call, put }) {
      const res = yield call(getPerson, payload);
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            personInfo: res.data,
          },
        });
      }
      return res;
    },
    // 删除单位人员
    *personDetele({ payload }, { call }) {
      const res = yield call(personDetele, payload);
      return res;
    },
    // 新增单位人员
    *companyPersonAdd({ payload }, { call, put }) {
      yield call(companyPersonAdd, payload);
    },
    // 修改单位人员
    *companyPersonUpdate({ payload }, { call }) {
      const res = yield call(companyPersonUpdate, payload);
      return res;
    },
  },

  reducers: {
    setCascader(state, action) {
      const data = action.payload.cascaderOption;
      let cascaderOption: Option = [];
      const getChildren = children => {
        if (!children) {
          return null;
        }
        return children.map(item => {
          const isLeaf = !item.children || item.children.length === 0;
          return {
            label: item.name,
            value: item.id,
            children: getChildren(item.children),
            isLeaf,
          };
        });
      };

      if (data) {
        cascaderOption = data.map(item => {
          const isLeaf = !item.children || item.children.length === 0;
          return {
            label: item.name,
            value: item.id,
            children: getChildren(item.children),
            isLeaf,
          };
        });
      }
      return {
        ...state,
        cascaderOption,
      };
    },
  },

  subscriptions: {},
};

export default mdlExtend(CompanyModel);
