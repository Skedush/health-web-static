/* tslint:disable */
import { IConfig } from 'umi-types';

// ref: https://umijs.org/config/
const config: IConfig = {
  define: {
    API_PREFIX: 'http://156.254.0.201:8080', //集成测试服务器
    CARD_READER_OPENED: true,
    CARD_READER_HOST: 'http://localhost:24010',
  },
};

export default config;
