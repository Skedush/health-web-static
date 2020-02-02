import { Dictionary } from '../utils/type';

declare namespace webapi {
  export interface IPageableRequest {
    pageSize: number;
    pageIndex: number;
  }

  export interface IPageableResponse<T> {
    items: T[];
    page: {
      pageSize: number;
      pageIndex: number;
      total: number;
    };
  }

  export interface IRequest<T> {
    data: T;
    url: string;
    method: string;
    headers?: Dictionary<string>;
    [key: string]: any;
  }

  export interface IResponse<T> {
    success: boolean;
    message?: string;
    statusCode?: number;
    data?: T;
  }

  namespace user {}
}
