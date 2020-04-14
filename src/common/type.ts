import { Action, AnyAction } from 'redux';
import { History } from 'history';
import { AppState } from '@/models/app';
import { HomeState } from '@/pages/Dashboard/Home/model';
import { FillFormState } from '@/pages/Dashboard/FillForm/model';
import { ResultState } from '@/pages/Dashboard/Result/model';

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
  app: AppState;
  home: HomeState;
  fillForm: FillFormState;
  result: ResultState;
  loading: LoadingState;
}

export interface UmiComponentProps {
  history: History;
  dispatch: Dispatch;
}

export enum DictionaryEnum {}
