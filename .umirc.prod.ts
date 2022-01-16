/* tslint:disable */
import { IConfig } from 'umi-types';

// ref: https://umijs.org/config/
const config: IConfig = {
  define: {
    API_PREFIX: 'https://w.cjsq.net', //集成测试服务器
    DOMAIN: 'cjsq.net',
    // PRE_DOMAIN: 'www.',
    PRE_DOMAIN: '',
    DETAIL_DOMAIN: '323',
  },
};

export default config;
