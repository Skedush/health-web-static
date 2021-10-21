import IDValidator from 'id-validator';
import moment from 'moment';

const Validator = new IDValidator();
const PHONE_REGEXP = '1[3-9][0-9]\\d{8}$';
// eslint-disable-next-line no-useless-escape
const LONGITUDE_REGEXP = /^[\-\+]?(0(\.\d{1,10})?|([1-9](\d)?)(\.\d{1,10})?|1[0-7]\d{1}(\.\d{1,10})?|180\.0{1,10})$/; // 经度
// eslint-disable-next-line no-useless-escape
const LATITUDE_REGEXP = /^-?((0|[1-8]?[0-9]?)(([.][0-9]{1,10})?)|90(([.][0]{1,10})?))$/; // 纬度

const IP_REGEXP =
  '^((25[0-5]|2[0-4]\\d|[1]{1}\\d{1}\\d{1}|[1-9]{1}\\d{1}|\\d{1})($|(?!\\.$)\\.)){4}$';

const PORT_REGEXP = /^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-5]{2}[0-3][0-5])$/;

const CARNUMBER_REGEXP: RegExp = /^(((([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳使领]))$/;
const PASSWORD_REGEXP = /^(?:\d|[a-zA-Z]|[!@#$%^&*]){4,18}$/;
export interface IdCardInfo {
  addrCode: number; // 地址码信息
  addr: string; // 地址信息, 只在实例化时传入了GB2260时返回
  birth: string; // 出生年月日
  sex: number; // 性别，0为女，1为男
  checkBit: string; // 校验位，仅当18位时存在
  length: number; // 身份证类型，15位或18位
}

export function validationPassword(val: string): boolean {
  if (!val || val.length <= 0) {
    return false;
  }
  const arr = val.match(PASSWORD_REGEXP);
  return !arr;
}

export function isPassword(rule, value, callback) {
  if (value) {
    !validationPassword(value) ? callback() : callback(new Error('请输入4-18位密码'));
  } else {
    callback();
  }
}

export function validationPhone(phone: string): boolean {
  if (!phone || phone.length <= 0) {
    return false;
  }
  const arr = phone.match(PHONE_REGEXP);
  return !!arr;
}

export function validationIP(ip: string): boolean {
  if (!ip || ip.length <= 0) {
    return false;
  }
  const arr = ip.match(IP_REGEXP);
  return !!arr;
}

export function validationPort(port: string): boolean {
  if (!port || port.length <= 0) {
    return false;
  }
  const arr = port.match(PORT_REGEXP);
  return !!arr;
}

export function validationIdCard(id: string): boolean {
  return Validator.isValid(id);
}

export function validationLongitude(longitude: string): boolean {
  if (!longitude || longitude.length <= 0) {
    return false;
  }
  const arr = longitude.match(LONGITUDE_REGEXP);
  return !!arr;
}

export function validationCarNumber(value: string) {
  return CARNUMBER_REGEXP.test(value);
}
export function validationLatitude(latitude: string): boolean {
  if (!latitude || latitude.length <= 0) {
    return false;
  }

  const arr = latitude.match(LATITUDE_REGEXP);
  return !!arr;
}

export function isLatitude(rule, value, callback) {
  if (value) {
    validationLatitude(value + '') ? callback() : callback(new Error('纬度格式不正确！'));
  } else {
    callback();
  }
}

export function isLongitude(rule, value, callback) {
  if (value) {
    validationLongitude(value + '') ? callback() : callback(new Error('经度格式不正确！'));
  } else {
    callback();
  }
}

export function isPhone(rule, value, callback) {
  if (value) {
    validationPhone(value) ? callback() : callback(new Error('手机号码格式不正确！'));
  } else {
    callback();
  }
}

export function isIP(rule, value, callback) {
  if (value) {
    validationIP(value) ? callback() : callback(new Error('IP格式不正确！'));
  } else {
    callback();
  }
}

export function isPort(rule, value, callback) {
  if (value) {
    validationPort(value) ? callback() : callback(new Error('端口格式不正确！'));
  } else {
    callback();
  }
}

export function timeAfterNow(rule, value, callback) {
  if (value) {
    value.isAfter(moment()) ? callback() : callback(new Error('时间必须在今天之后！'));
  } else {
    callback();
  }
}

export function endTimeAfterNow(rule, value, callback) {
  if (value) {
    value[1].isAfter(moment()) ? callback() : callback(new Error('结束时间必须在今天之后！'));
  } else {
    callback();
  }
}

export function isPassport(rule, value, callback) {
  if (value) {
    !validationIdCard(value) ? callback() : callback(new Error('证件号码格式不正确！'));
  } else {
    callback();
  }
}

export function isIdCard(rule, value, callback) {
  if (value) {
    validationIdCard(value) ? callback() : callback(new Error('证件号码格式不正确！'));
  } else {
    callback();
  }
}

export function carNumber(rule, value, callback) {
  if (value !== '') {
    validationCarNumber(value) ? callback() : callback(new Error('车牌号格式不正确！'));
  } else {
    callback();
  }
}

export function uploadImage(rule, value, callback) {
  console.log('value: ', value);
  if (typeof value === 'object') {
    if (value.file.type !== 'image/jpeg' && value.file.type !== 'image/png') {
      callback(new Error('必须上传图片'));
    } else if (value.file.size / 1024 > 200) {
      callback(new Error('图片必须小于200kb'));
    } else {
      callback();
    }
  } else if (typeof value === 'string') {
    callback();
  } else if (value instanceof Array && !value.length) {
    callback(new Error('请选择图片'));
  } else {
    callback();
  }
}

export function getInfo(id: string): IdCardInfo {
  return Validator.getInfo(id);
}

export function makeID(): string {
  return Validator.makeID();
}
