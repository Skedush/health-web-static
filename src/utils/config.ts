export interface LayoutConfig {
  name: string;
  include: RegExp[];
  exlude: RegExp[];
}

export interface RouteList {
  id: number;
  parentId: number;
  level: number;
  name: string;
  icon: string;
  route: string;
  children: RouteList[];
}

export default {
  siteName: '健康管理5.2.0',
  copyright: 'SKEDUSH Umi  © 2020',
  logoPath: '/logo.svg',
  defaultTheme: 'light',

  // eslint-disable-next-line no-undef
  apiPrefix: API_PREFIX,
  // eslint-disable-next-line no-undef
  domain: DOMAIN,
  // eslint-disable-next-line no-undef
  detailDomain: DETAIL_DOMAIN,
  fixedHeader: true, // sticky primary layout header

  /* Layout configuration, specify which layout to use for route. */
  // login页不使用primary的layout
  layouts: [
    // { name: 'Inside', include: [/Inside/] },
    // {
    //   name: 'primary',
    //   include: [/.*/],
    //   exlude: [/login[/]?$/, /initialization[/]?$/],
    // },
    {
      name: 'public',
      include: [/.*/],
      exlude: [],
    },
  ],

  routeList: [
    {
      id: 1,
      parentId: 1,
      level: 1,
      name: '首页',
      icon: 'home',
      route: '/',
      children: [],
    },
  ],
};
