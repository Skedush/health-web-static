/* tslint:disable */
import { resolve } from 'path';
import { IConfig } from 'umi-types';
import pageRoutes from './config/router.config';
// import Config from './src/utils/config';
import webpackPlugin from './config/plugin.config';
import Themes from './src/themes/templates';
import pxToViewPort from 'postcss-px-to-viewport';
import slash from 'slash2';

// TODO: fix compile error
// const defaultTheme = Config.defaultTheme || 'light';

// ref: https://umijs.org/config/
const config: IConfig = {
  treeShaking: true,
  history: 'hash',
  // 禁用 redirect 上提
  disableRedirectHoist: true,
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    [
      'umi-plugin-react',
      {
        antd: true,
        dva: true,
        dynamicImport: { webpackChunkName: true },
        title: 'property-management-static-web',
        dll: false,

        routes: {
          exclude: [
            /public\//,
            /models\//,
            /services\//,
            /model\.(t|j)sx?$/,
            /service\.(t|j)sx?$/,
            /components\//,
          ],
        },
      },
    ],
  ],
  // 开启hash文件后缀
  hash: true,
  targets: {
    chrome: 30,
  },
  // 路由配置
  routes: pageRoutes,
  // Theme for antd
  // https://ant.design/docs/react/customize-theme
  theme: Themes.light,
  define: {
    API_PREFIX: 'http://192.168.70.10:20002', //集成测试服务器
    CARD_READER_OPENED: false,
    CARD_READER_HOST: 'http://localhost:24010',
  },
  alias: {
    '@': resolve(__dirname, './src/'),
    components: resolve(__dirname, './src/components'),
    themes: resolve(__dirname, './src/themes'),
    utils: resolve(__dirname, './src/utils'),
    assets: resolve(__dirname, './src/assets'),
    services: resolve(__dirname, './src/services'),
    models: resolve(__dirname, './src/models'),
  },
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  cssLoaderOptions: {
    modules: true,
    getLocalIdent: (
      context: {
        resourcePath: string;
      },
      _: string,
      localName: string,
    ) => {
      if (
        context.resourcePath.includes('node_modules') ||
        context.resourcePath.includes('ant.design.pro.less') ||
        context.resourcePath.includes('global.less')
      ) {
        return localName;
      }

      const match = context.resourcePath.match(/src(.*)/);

      if (match && match[1]) {
        const antdProPath = match[1].replace('.less', '');
        const arr = slash(antdProPath)
          .split('/')
          .map((a: string) => a.replace(/([A-Z])/g, '-$1'))
          .map((a: string) => a.toLowerCase());
        return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
      }

      return localName;
    },
  },
  extraPostCSSPlugins: [
    pxToViewPort({
      unitToConvert: 'px',
      viewportWidth: 1920,
      unitPrecision: 5,
      propList: ['*'],
      viewportUnit: 'vw',
      fontViewportUnit: 'vw',
      selectorBlackList: [],
      minPixelValue: 1,
      mediaQuery: false,
      replace: true,
      exclude: [/node_modules/],
      landscape: false,
      landscapeUnit: 'vw',
      landscapeWidth: 568,
    }),
  ],
  extraBabelPlugins: [
    [
      'import',
      {
        libraryName: 'lodash',
        libraryDirectory: '',
        camel2DashComponentName: false,
      },
      'lodash',
    ],
  ],
  // chainWebpack: webpackPlugin,
};

export default config;
