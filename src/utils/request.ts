import { Message } from '@/components/Library';
import { router } from '@/utils';
import {
  CANCEL_REQUEST_MESSAGE,
  ERROR_REQUEST_MESSAGE,
  MESSAGE_CONFIG_MAX_COUNT,
} from '@/utils/constant';
import {
  SUCCESS_ADD,
  SUCCESS_DELETE,
  SUCCESS_IMPOWER,
  SUCCESS_LOGOUT,
  SUCCESS_UPDATE,
} from '@/utils/message';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { cloneDeep, isEmpty } from 'lodash';
import pathToRegexp from 'path-to-regexp';
import qs from 'qs';
import store from 'store';

const { CancelToken } = axios;
window.cancelRequest = new Map();

Message.config({
  maxCount: MESSAGE_CONFIG_MAX_COUNT,
});

/* eslint-disable */
const SYSTEM_ERROR = 9001; // 系统异常
const REQUEST_PARAM_ERROR = 9002; // 请求参数异常
const BUSINESS_ERROR = 9003; // 业务异常
const FOREIGN_KEY_ERROR = 9004; // 删除数据时，外键异常
const DATA_NOT_FIND_ERROR = 9005; // 数据未查询到
const AUTH_ERROR = 9006; // 权限异常
const DATA_EXIST_ERROR = 9007; // 数据未查询到
const NOT_BUSINESS_DOCUMENT_ERROR = 9008; // 数据未查询到
const NOT_LOGIN_ERROR = '000001'; // 数据未查询到
/* eslint-enable */

export interface ResponseData {
  success: boolean;
  message?: string;
  statusCode?: number;
  data?: any;
}

export interface RequestConfig extends AxiosRequestConfig {
  // 是否接口成功后自动显示Message
  autoMessage?: boolean;
}

/**
 * axios的请求封装，地址判断、错误处理
 *
 * @export
 * @param {object} options 请求选项
 * @returns {Promise} 请求结果
 */
// eslint-disable-next-line max-lines-per-function
export default function request(options: RequestConfig): Promise<ResponseData | undefined> {
  const { data, url, method = 'get', autoMessage = true } = options;
  // django设置了token认证，不需要token认证的接口也会抛认证不通过，需要将Authorization置为空
  if (store.get('Authorization')) {
    axios.defaults.headers['Authorization'] = 'JWT ' + store.get('Authorization');
  } else {
    delete axios.defaults.headers['Authorization'];
  }
  if (!url) {
    throw new Error('request url none');
  }

  const cloneData = cloneDeep(data);
  const newUrl = matchRestfulUrl(url, cloneData);

  options.url =
    method.toLocaleLowerCase() === 'get'
      ? `${newUrl}${isEmpty(cloneData) ? '' : '?'}${qs.stringify(cloneData)}`
      : newUrl;

  options.cancelToken = new CancelToken(cancel => {
    window.cancelRequest.set(Symbol(Date.now()), {
      pathname: window.location.pathname,
      cancel,
    });
  });

  // session
  options.withCredentials = false;
  options.headers = {
    'X-Request-Type': 'ajax',
    'Content-Type': 'application/json;charset=UTF-8',
    // Authorization: 'JWT' + store.get('Authorization'),
  };

  return axios(options)
    .then(response => {
      if (options.responseType === 'blob') {
        return Promise.resolve({
          success: true,
          data: response.data,
        });
      }

      const { success, code, msg, data } = response.data;
      if (!success) {
        if (code === NOT_LOGIN_ERROR) {
          router.push('/login');
        }

        throw new Error(msg);
      } else {
        if (autoMessage) {
          messageWithCRUDUrl(newUrl, data);
        }

        return Promise.resolve({
          success: success,
          message: msg,
          statusCode: code,
          data: data || {},
        });
      }
    })
    .catch((error: AxiosError) => {
      const { response, message } = error;
      if (String(message) === CANCEL_REQUEST_MESSAGE) {
        return {
          success: false,
          message: CANCEL_REQUEST_MESSAGE,
        };
      }

      let msg: string;
      let statusCode: number;

      if (response && response instanceof Object) {
        const { data, statusText } = response;
        if (data.code === NOT_LOGIN_ERROR) {
          router.push('/login');
        }
        statusCode = response.status;
        msg = data.message || statusText;
      } else {
        statusCode = 600;
        msg = error.message;
      }
      let errorData;
      if (response) {
        errorData = response.data.data;
      }
      if (!msg || msg.length <= 0) {
        msg = ERROR_REQUEST_MESSAGE;
      }
      Message.error(msg);
      return {
        success: false,
        statusCode,
        message: msg,
        data: errorData,
      };
    });
}

/**
 * 正则匹配restful风格请求并替换对应参数，返回新的url
 * eg: /:id/get, data参数保证必须有id属性
 *
 * @param {string} url 请求地址
 * @param {object} data 请求数据
 * @returns {string} 新的地址
 */
function matchRestfulUrl(url: string, data: object): string {
  let newUrl = url;

  try {
    let domain = '';
    const urlMatch = newUrl.match(/[a-zA-z]+:\/\/[^/]*/);
    if (urlMatch) {
      [domain] = urlMatch;
      newUrl = newUrl.slice(domain.length);
    }

    const match = pathToRegexp.parse(newUrl);
    newUrl = pathToRegexp.compile(newUrl)(data);

    for (const item of match) {
      if (item instanceof Object && item.name in data) {
        delete data[item.name];
      }
    }
    newUrl = domain + newUrl;
  } catch (e) {
    newUrl = url;
  }

  return newUrl;
}

/**
 * 匹配CRUD类型的请求，做全局提示
 *
 * @param {string} url 请求地址
 * @param {*} data 请求回复数据
 */
function messageWithCRUDUrl(url: string, data: any): void {
  if (!url || url.length <= 0 || !data) {
    return;
  }

  // 后端批量操作的错误信息会存放在data里
  if (data.error > 0) {
    return;
  }

  // 后端批量操作中有错误的直接提示错误信息

  const array = url.split('/');
  const action = array[array.length - 1];
  const messages = [
    {
      key: 'add',
      value: SUCCESS_ADD,
    },
    {
      key: 'update',
      value: SUCCESS_UPDATE,
    },
    {
      key: 'delete',
      value: SUCCESS_DELETE,
    },
    {
      key: 'impower',
      value: SUCCESS_IMPOWER,
    },
    {
      key: 'logout',
      value: SUCCESS_LOGOUT,
    },
  ];

  for (let i = 0; i < messages.length; i++) {
    const { key, value } = messages[i];
    if (action === key) {
      Message.success(value);
      break;
    }
  }
}
