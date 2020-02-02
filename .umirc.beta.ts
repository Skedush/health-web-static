/* tslint:disable */
import { IConfig } from 'umi-types';

// ref: https://umijs.org/config/
const config: IConfig = {
  define: {
    API_PREFIX: 'http://192.168.70.10:20005', //集成测试服务器
    CARD_READER_OPENED: true,
    CARD_READER_HOST: 'http://localhost:24010',
  },
};

export default config;
