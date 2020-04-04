import { Reducer } from 'redux';

export interface CommonModelState {}

export interface CommonModelType {
  namespace: string;
  state: CommonModelState;
  effects: Partial<{}>;
  reducers: Partial<{
    updateState: Reducer<CommonModelState>;
  }>;
}

const CommonModel: CommonModelType = {
  namespace: 'common',

  state: {
    collapsed: false,
    notices: [],
  },

  effects: {},

  reducers: {
    updateState(state, { payload }): CommonModelState {
      return {
        ...state,
        ...payload,
      };
    },
  },
};

export default CommonModel;
