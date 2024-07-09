/* tslint:disable */
import { IConfig } from 'umi-types';

// ref: https://umijs.org/config/
const config: IConfig = {
  // document.ejs中的css需要修改成  .../f/fonts/iconfont.css
  publicPath: '/f/',
  define: {
    // API_PREFIX: 'https://w.cjsq.net', //集成测试服务器
    API_PREFIX: 'https://cjsq.net/api', //集成测试服务器
    DOMAIN: 'cjsq.net/form',
    // PRE_DOMAIN: 'www.',
    DETAIL_DOMAIN: '323',
  },
};

export default config;
