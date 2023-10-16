/* tslint:disable */
import { IConfig } from 'umi-types';

// ref: https://umijs.org/config/
const config: IConfig = {
  define: {
    API_PREFIX: 'https://hh.jkgl.cc', //集成测试服务器
    DOMAIN: 't.jkgl.cc',
    // PRE_DOMAIN: 't',
    DETAIL_DOMAIN: '666',
  },
};

export default config;
