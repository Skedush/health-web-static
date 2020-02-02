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
  siteName: '物业助手v1.0.5',
  copyright: 'LD Umi  © 2019',
  logoPath: '/logo.svg',
  defaultTheme: 'light',

  // eslint-disable-next-line no-undef
  apiPrefix: API_PREFIX,
  // eslint-disable-next-line no-undef
  cardReaderHost: CARD_READER_HOST,
  // eslint-disable-next-line no-undef
  cardReaderOpened: CARD_READER_OPENED,
  fixedHeader: true, // sticky primary layout header

  /* Layout configuration, specify which layout to use for route. */
  // login页不使用primary的layout
  layouts: [
    // { name: 'Inside', include: [/Inside/] },
    {
      name: 'primary',
      include: [/.*/],
      exlude: [/login[/]?$/, /initialization[/]?$/],
    },
    {
      name: 'init',
      include: [/initialization[/]?$/],
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
