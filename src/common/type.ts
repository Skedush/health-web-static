import { Action, AnyAction } from 'redux';
import { History } from 'history';
import { AppState } from '@/models/app';
import { HomeState } from '@/pages/Dashboard/Home/model';

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
}

export interface UmiComponentProps {
  history: History;
  dispatch: Dispatch;
}

export enum DictionaryEnum {}
