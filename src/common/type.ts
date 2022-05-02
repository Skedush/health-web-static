import { CommonState } from '@/models/common';
import { CompareState } from '@/pages/Dashboard/Compare/model';
import { FillFormState } from '@/pages/Dashboard/FillForm/model';
import { HomeState } from '@/pages/Dashboard/Home/model';
import { ResultState } from '@/pages/Dashboard/Result/model';
import { UserState } from '@/pages/Dashboard/User/model';
import { History } from 'history';
import { Action, AnyAction } from 'redux';

export interface Dispatch<A extends Action = AnyAction> {
  <T extends A>(action: T): any;
}

export interface LoadingState {
  global: boolean;
  effects: { [key: string]: boolean | undefined };
  models: {
    app?: boolean;
    login?: boolean;
  };
}

export interface GlobalState {
  common: CommonState;
  global: GlobalState;
  home: HomeState;
  fillForm: FillFormState;
  result: ResultState;
  loading: LoadingState;
  user: UserState;
  compare: CompareState;
}

export interface UmiComponentProps {
  history: History;
  dispatch: Dispatch;
  match: any;
}

export enum DictionaryEnum {}
