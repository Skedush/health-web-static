/* eslint-disable valid-jsdoc */
import { cloneDeep } from 'lodash';
import umiRouter from 'umi/router';
import pathToRegexp from 'path-to-regexp';
import { LayoutConfig, RouteList } from './config';

/**
 * Query objects that specify keys and values in an array where all values are objects.
 * @param   {array}         array   An array where all values are objects, like [{key:1},{key:2}].
 * @param   {string}        key     The key of the object that needs to be queried.
 * @param   {string}        value   The value of the object that needs to be queried.
 * @return  {object|undefined}   Return frist object when query success.
 */
export function queryArray(array: Array<object>, key: string, value: string): any {
  if (!Array.isArray(array)) {
    return;
  }
  return array.find(_ => _[key] === value);
}

// 判断字符串是否为中文
export function isChinese(temp) {
  const re = new RegExp('[\u4E00-\u9FA5]+');
  if (re.test(temp)) return true;
  return false;
}

// 判断字符串是否为数字
export function isNumber(temp) {
  const re = new RegExp('[0-9]+');
  if (re.test(temp)) return true;
  return false;
}

// 图片转base64
export function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

//  base64 转 File
export function base64ToFile(dataurl, filename = 'file') {
  return new Promise<File>((resolve, reject) => {
    try {
      const arr = dataurl.split(',');
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      resolve(new File([u8arr], filename, { type: mime }));
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Convert an array to a tree-structured array.
 * @param   {array}     array     The Array need to Converted.
 * @param   {string}    id        The alias of the unique ID of the object in the array.
 * @param   {string}    parentId       The alias of the parent ID of the object in the array.
 * @param   {string}    children  The alias of children of the object in the array.
 * @return  {array}    Return a tree-structured array.
 */
export function arrayToTree(
  array: Array<any>,
  id: string = 'id',
  parentId: string = 'pid',
  children: string = 'children',
): Array<any> {
  const result = [] as Array<any>;
  const hash = {};
  const data = cloneDeep(array);

  data.forEach((item, index) => {
    hash[data[index][id]] = item;
  });

  data.forEach(item => {
    const hashParent = hash[item[parentId]];
    if (hashParent) {
      if (!hashParent[children]) {
        hashParent[children] = [];
      }

      hashParent[children].push(item);
    } else {
      result.push(item);
    }
  });
  return result;
}

export const router = umiRouter;

/**
 * Whether the path matches the regexp if the language prefix is ignored, https://github.com/pillarjs/path-to-regexp.
 * @param   {string|regexp|array}     regexp     Specify a string, array of strings, or a regular expression.
 * @param   {string}                  pathname   Specify the pathname to match.
 * @return  {array|null}              Return the result of the match or null.
 */
export function pathMatchRegexp(
  regexp: string | RegExp | Array<string>,
  pathname: string,
): RegExpExecArray | null {
  return pathToRegexp(regexp).exec(pathname);
}

/**
 * In an array object, traverse all parent IDs based on the value of an object.
 * @param   {array}     array     The Array need to Converted.
 * @param   {string}    current   Specify the value of the object that needs to be queried.
 * @param   {string}    parentId  The alias of the parent ID of the object in the array.
 * @param   {string}    id        The alias of the unique ID of the object in the array.
 * @return  {array}    Return a key array.
 */
export function queryPathKeys(
  array: Array<any>,
  current: string,
  parentId: string,
  id: string = 'id',
): Array<string> {
  const result = [current];
  const hashMap = new Map();
  array.forEach(item => hashMap.set(item[id], item));

  const getPath = (current: string) => {
    const currentParentId = hashMap.get(current)[parentId];
    if (currentParentId) {
      result.push(currentParentId);
      getPath(currentParentId);
    }
  };

  getPath(current);
  return result;
}

/**
 * 从后台返回的路由树追溯到当前路由的父节点
 *
 * @export
 * @param {Array} array 根路由树
 * @param {string} pathname 当前路由路径
 * @returns {Array} 路由节点集合
 */
export function queryAncestors(array: RouteList[], pathname: string): RouteList[] {
  const result = [] as RouteList[];
  if (!Array.isArray(array)) {
    return result;
  }

  const getPath = (arr: RouteList[]) => {
    let match: any;
    for (let i = 0; i < arr.length; i++) {
      const { route, children } = arr[i];
      result.push(arr[i]);

      match = route && pathMatchRegexp(route, pathname);
      if (!match && children && children.length > 0) {
        match = getPath(children);
      }

      if (match) {
        break;
      } else {
        result.pop();
      }
    }

    return match;
  };

  getPath(array);
  return result;
}

export interface PermissionMenu {
  route: string;
  [key: string]: any;
}

export function queryPermission(array: RouteList[], menus: PermissionMenu[]): PermissionMenu[] {
  const result = [] as PermissionMenu[];
  if (!Array.isArray(array) || !Array.isArray(menus)) {
    return result;
  }

  const getPath = (arr: RouteList[], menu: PermissionMenu) => {
    let match: any = false;
    const { route: permissionRoute } = menu;
    if (!permissionRoute) return match;

    for (let i = 0; i < arr.length; i++) {
      const { route, children } = arr[i];

      match = route && pathMatchRegexp(route, permissionRoute);
      if (!match && children && children.length > 0) {
        match = getPath(children, menu);
      }

      if (match) {
        break;
      }
    }

    return match;
  };

  menus.forEach(item => {
    const match = getPath(array, item);
    if (match) {
      result.push(item);
    }
  });

  return result;
}

/**
 * Query which layout should be used for the current path based on the configuration.
 * @param   {layouts}     layouts   Layout configuration.
 * @param   {pathname}    pathname  Path name to be queried.
 * @return  {string}   Return frist object when query success.
 */
export function queryLayout(layouts: LayoutConfig[], pathname: string): string {
  let result = 'public';

  const isMatch = (regepx: string | RegExp | string[]) => {
    return regepx instanceof RegExp ? regepx.test(pathname) : pathMatchRegexp(regepx, pathname);
  };

  for (const item of layouts) {
    let include = false;
    let exlude = false;
    if (item.include) {
      for (const regepx of item.include) {
        if (isMatch(regepx)) {
          include = true;
          break;
        }
      }
    }

    if (include && item.exlude) {
      for (const regepx of item.exlude) {
        if (isMatch(regepx)) {
          exlude = true;
          break;
        }
      }
    }

    if (include && !exlude) {
      result = item.name;
      break;
    }
  }

  return result;
}

/**
 * Return name and version of browser
 *
 * @export
 * @returns {object} { name, version }
 */
export function getBrowserInfo(): { name: string; version: string } {
  const defaultInfo = { name: 'unknow', version: 'unknow' };
  if (!navigator || !navigator.userAgent) {
    return defaultInfo;
  }

  try {
    const ua = navigator.userAgent;
    let tem: any;
    let M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];

    if (/trident/i.test(M[1])) {
      tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
      return { name: 'IE', version: tem[1] || '' };
    }

    if (M[1] === 'Chrome') {
      tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
      if (tem != null) {
        tem = tem.slice(1);
        return { name: tem[0].replace('OPR', 'Opera'), version: tem[1] };
      }
    }

    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    tem = ua.match(/version\/(\d+)/i);
    if (tem != null) M.splice(1, 1, tem[1]);
    return { name: M[0], version: M[1] };
  } catch (error) {
    return defaultInfo;
  }
}

/**
 * Return bit of system os
 *
 * @export
 * @returns {number} 32|64
 */
export function getSystemBit(): 32 | 64 {
  if (!navigator || !navigator.platform) {
    return 32;
  }

  const { platform } = navigator;
  return platform.includes('64') ? 64 : 32;
}

export function onOverFlowHiddenCell(): object {
  return {
    style: {
      maxWidth: 50,
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      cursor: 'pointer',
    },
  };
}

// 敏感数据脱敏处理
/**
 *
 * @param value
 */

export function encryptValue(value: string) {
  if (!value) {
    return value;
  }
  const strLen = value.length;
  const starCount = strLen < 6 ? 0 : strLen - 6;
  return value.replace(/(.{3})\d*(.{3})/, `$1${String('*').repeat(starCount)}$2`);
}

/**
 * 拷贝对象数组里的两个参数，其中一个属性不存在的话，就会取另一个属性值
 * `params`是个对象属性
 * @param array
 * @param params
 *
 * ```
 * Example
 *
 *const arr = [{ a: 2}];
 *copyArrParam(arr, { a: 'c' }); 或者 copyArrParam(arr, { c: 'a', c: 'b' });
 *console.log(arr);  👇
 *[{ a: 2, c: 2}] 或者 [{ a: 2, c: 2, b: 2}]
 * ```
 */
export function copyArrParam(array: any[], params: { [name: string]: string }) {
  let value;
  if (array) {
    array.forEach(item => {
      for (const key of Object.keys(params)) {
        value = item[params[key]] || item[key];
        item[params[key]] = value;
        item[key] = value;
      }
    });
  }
  return array;
}
