import { Request, Response } from 'express';
import { Mock, Constant, randomAvatar, ResponseWarpper } from './_utils';
import api from '../src/services/api';

const { login, logout, queryRouteList, getDic } = api;
const { apiPrefix } = Constant;

const usersListData = Mock.mock({
  'data|80-100': [
    {
      id: '@id',
      name: '@name',
      nickName: '@last',
      phone: /^1[34578]\d{9}$/,
      'age|11-99': 1,
      address: '@county(true)',
      isMale: '@boolean',
      email: '@email',
      createTime: '@datetime',
      avatar() {
        return randomAvatar();
      },
    },
  ],
});

const database = usersListData.data;

const EnumRoleType = {
  ADMIN: 'admin',
  DEFAULT: 'guest',
  DEVELOPER: 'developer',
};

const userPermission = {
  DEFAULT: {
    visit: ['1', '2', '21', '7', '5', '51', '52', '53'],
    role: EnumRoleType.DEFAULT,
  },
  ADMIN: {
    role: EnumRoleType.ADMIN,
  },
  DEVELOPER: {
    role: EnumRoleType.DEVELOPER,
  },
};

const adminUsers = [
  {
    id: 0,
    username: 'admin',
    password: 'admin',
    permissions: userPermission.ADMIN,
    avatar: randomAvatar(),
  },
  {
    id: 1,
    username: 'guest',
    password: 'guest',
    permissions: userPermission.DEFAULT,
    avatar: randomAvatar(),
  },
];

const queryArray = (array: any[], key: string, keyAlias = 'key') => {
  if (!(array instanceof Array)) {
    return null;
  }

  let data: any;
  for (const item of array) {
    if (item[keyAlias] === key) {
      data = item;
      break;
    }
  }

  return data;
};

export default {
  [login](req: Request, res: Response) {
    const { userName, password } = req.body;
    console.log('req.body: ', req.body);
    const user = adminUsers.filter(item => item.username === userName);

    if (user.length > 0 && user[0].password === password) {
      const now = new Date();
      now.setDate(now.getDate() + 1);
      res.cookie('token', JSON.stringify({ id: user[0].id, deadline: now.getTime() }), {
        maxAge: 900000,
        httpOnly: true,
      });
      res.json(ResponseWarpper.success());
    } else {
      res.json(ResponseWarpper.failed());
    }
  },

  [logout](req: Request, res: Response) {
    res.clearCookie('token');
    res.json(ResponseWarpper.success());
  },

  [`GET ${apiPrefix}/user/:id`](req: Request, res: Response) {
    const { id } = req.params;
    const data = queryArray(database, id, 'id');
    if (data) {
      res.json(ResponseWarpper.success(data));
    } else {
      res.json(ResponseWarpper.failed('Not Found'));
    }
  },

  // eslint-disable-next-line max-lines-per-function
  [queryRouteList](req: Request, res: Response) {
    console.log('req: ', req.query);
    const data = [
      {
        id: 1,
        name: '首页',
        route: '/dashboard/home',
        children: [],
        parentId: null,
        icon: 'pm-index',
        level: 1,
      },
      {
        id: 2,
        name: '小区信息',
        route: '',
        children: [
          {
            id: 16,
            name: '小区概况',
            route: '/dashboard/basicdata/village',
            children: [],
            parentId: 2,
            icon: '',
            level: 2,
          },
          {
            id: 17,
            name: '楼栋管理',
            route: '/dashboard/basicdata/building',
            children: [],
            parentId: 2,
            icon: '',
            level: 2,
          },
          {
            id: 18,
            name: '单元管理',
            route: '/dashboard/basicdata/unit',
            children: [],
            parentId: 2,
            icon: '',
            level: 2,
          },
          {
            id: 19,
            name: '房屋管理',
            route: '/dashboard/basicdata/house',
            children: [],
            parentId: 2,
            icon: '',
            level: 2,
          },
        ],
        parentId: null,
        icon: 'pm-basic-data',
        level: 1,
      },
      {
        id: 3,
        name: '物业管理',
        route: '/dashboard',
        children: [
          {
            id: 21,
            name: '住户管理',
            route: '/dashboard/basicdata/person',
            children: [],
            parentId: 3,
            icon: '',
            level: 2,
          },
          {
            id: 20,
            name: '车辆管理',
            route: '/dashboard/basicdata/car',
            children: [],
            parentId: 3,
            icon: null,
            level: 2,
          },
          {
            id: 29,
            name: '物业人员',
            route: '/dashboard/propertymgmt/personnel/property',
            children: [],
            parentId: 3,
            icon: null,
            level: 2,
          },
          {
            id: 23,
            name: '单位管理',
            route: '/dashboard/propertymgmt/company',
            children: [],
            parentId: 3,
            icon: '',
            level: 2,
          },
          {
            id: 26,
            name: '临时人员',
            route: '/dashboard/propertymgmt/personnel/provisional',
            children: [],
            parentId: 3,
            icon: '',
            level: 2,
          },
          {
            id: 61,
            name: 'IC卡管理',
            route: '/dashboard/propertymgmt/iccardmgmt',
            children: [],
            parentId: 3,
            icon: null,
            level: 2,
          },
          { id: 31, name: '单位管理', route: '/dashboard/propertymgmt/company', children: [] },
          { id: 32, name: 'IC卡管理', route: '/dashboard/propertymgmt/iccardmgmt' },
        ],
        parentId: null,
        icon: 'pm-property',
        level: 1,
      },
      {
        id: 5,
        name: '智慧通行',
        route: '',
        children: [
          {
            id: 30,
            name: '人脸门禁',
            route: '',
            children: [
              {
                id: 510,
                name: '通信证管理',
                route: '/dashboard/device/doorBan/passportmgmt',
                children: [],
                parentId: 50,
                icon: null,
                level: 3,
              },
              {
                id: 500,
                name: '门禁设备管理',
                route: '/dashboard/device/doorBan/index',
                children: [],
                parentId: 30,
                icon: '',
                level: 3,
              },
              {
                id: 33,
                name: '通行记录',
                route: '/dashboard/device/doorBan/personRecord',
                children: [],
                parentId: 30,
                icon: '',
                level: 3,
              },
              {
                id: 34,
                name: '规则配置',
                route: '/dashboard/device/doorBan/doorBanAuthSetting',
                children: [],
                parentId: 30,
                icon: '',
                level: 3,
              },
              {
                id: 62,
                name: '通行证管理\r\n',
                route: '/dashboard/device/doorBan/passportmgmt',
                children: [],
                parentId: 30,
                icon: null,
                level: 3,
              },
            ],
            parentId: 5,
            icon: '',
            level: 2,
          },
          {
            id: 35,
            name: '车辆道闸',
            route: '',
            children: [
              {
                id: 36,
                name: '设备管理',
                route: '/dashboard/device/carBan/index',
                children: [],
                parentId: 35,
                icon: null,
                level: 3,
              },
              {
                id: 38,
                name: '通行记录',
                route: '/dashboard/device/carBan/carRecord',
                children: [],
                parentId: 35,
                icon: null,
                level: 3,
              },
              {
                id: 40,
                name: '规则配置',
                route: '/dashboard/device/carBan/carBanAuthSetting',
                children: [],
                parentId: 35,
                icon: null,
                level: 3,
              },
              {
                id: 39,
                name: '黑名单管理',
                route: '/dashboard/device/carBan/blackList',
                children: [],
                parentId: 35,
                icon: null,
                level: 3,
              },
            ],
            parentId: 5,
            icon: null,
            level: 2,
          },
          {
            id: 41,
            name: '访客机',
            route: '',
            children: [
              {
                id: 42,
                name: '设备管理',
                route: '/dashboard/device/visitban',
                children: [],
                parentId: 41,
                icon: '',
                level: 3,
              },
              {
                id: 43,
                name: '通行记录',
                route: '/dashboard/device/visitban/visitrecord',
                children: [],
                parentId: 41,
                icon: '',
                level: 3,
              },
              {
                id: 51,
                name: '规则配置',
                route: '/dashboard/device/visitban/visitconfig',
                children: [],
                parentId: 41,
                icon: '',
                level: 3,
              },
            ],
            parentId: 5,
            icon: null,
            level: 2,
          },
        ],
        parentId: null,
        icon: 'pm-equipment',
        level: 1,
      },
      {
        id: 4,
        name: '系统管理',
        route: '/dashboard/real',
        children: [
          {
            id: 46,
            name: '菜单管理',
            route: '/dashboard/systemMgmt/menu',
            children: [],
            parentId: 4,
            icon: '',
            level: 2,
          },
          {
            id: 44,
            name: '用户管理',
            route: '/dashboard/systemMgmt/user',
            children: [],
            parentId: 4,
            icon: '',
            level: 2,
          },
          {
            id: 45,
            name: '角色管理',
            route: '/dashboard/systemMgmt/role',
            children: [],
            parentId: 4,
            icon: '',
            level: 2,
          },
          {
            id: 48,
            name: '日志中心',
            route: '/dashboard/systemMgmt/log',
            children: [
              {
                id: 49,
                name: '登录日志',
                route: '/dashboard/systemMgmt/log/signIn',
                children: [],
                parentId: 48,
                icon: '',
                level: 3,
              },
              {
                id: 50,
                name: '操作日志',
                route: '/dashboard/systemMgmt/log/operating',
                children: [],
                parentId: 48,
                icon: '',
                level: 3,
              },
            ],
            parentId: 4,
            icon: null,
            level: 2,
          },
        ],
        parentId: null,
        icon: 'pm-system',
        level: 1,
      },
      {
        id: 56,
        name: '停车场',
        route: '/dashboard/parkingMgmt',
        children: [
          {
            id: 57,
            name: '停车场管理',
            route: '/dashboard/parkingMgmt/parking',
            children: [],
            parentId: 56,
            icon: 'pm-parkingMgmt',
            level: 2,
          },
          {
            id: 58,
            name: '停车场规则配置',
            route: '/dashboard/parkingMgmt/parkingRule',
            children: [],
            parentId: 56,
            icon: 'pm-parkingRule',
            level: 2,
          },
        ],
        parentId: null,
        icon: 'pm-thebrake',
        level: 1,
      },
    ];
    if (data) {
      res.json(ResponseWarpper.success(data));
    } else {
      res.json(ResponseWarpper.failed('Not Found'));
    }
  },
  // eslint-disable-next-line max-lines-per-function
  [getDic](req: Request, res: Response) {
    console.log('req: ', req.query);

    const data = {
      dicMap: [
        {
          type: 'PM1',
          value: [
            { key: 1, value: '门禁设备', intValue: null, spellName: null },
            { key: 2, value: '车辆道闸', intValue: null, spellName: null },
            { key: 3, value: '访客机', intValue: null, spellName: null },
          ],
        },
        {
          type: 'PM2',
          value: [
            { key: 1, value: '正常', intValue: null, spellName: null },
            { key: 2, value: '离线', intValue: null, spellName: null },
          ],
        },
        {
          type: 'PM4',
          value: [
            { key: 1, value: '移动', intValue: null, spellName: null },
            { key: 2, value: '电信', intValue: null, spellName: null },
            { key: 3, value: '联通', intValue: null, spellName: null },
            { key: 4, value: '中广', intValue: null, spellName: null },
          ],
        },
        {
          type: 'PM14',
          value: [
            { key: 1, value: '速通门', intValue: null, spellName: null },
            { key: 2, value: '单元门禁', intValue: null, spellName: null },
          ],
        },
        {
          type: 'PM15',
          value: [
            { key: 1, value: '道闸', intValue: null, spellName: null },
            { key: 2, value: 'led', intValue: null, spellName: null },
          ],
        },
        {
          type: 'PM16',
          value: [{ key: 1, value: '访客机', intValue: null, spellName: null }],
        },
        {
          type: 'PM20',
          value: [
            { key: 1, value: '旅馆行业', intValue: null, spellName: null },
            { key: 2, value: '餐饮行业', intValue: null, spellName: null },
            { key: 3, value: '娱乐行业', intValue: null, spellName: null },
            { key: 4, value: '其他', intValue: null, spellName: null },
          ],
        },
        {
          type: 'PM23',
          value: [
            { key: 1, value: '业主通行证', intValue: null, spellName: null },
            { key: 2, value: '租户通行证', intValue: null, spellName: null },
            { key: 3, value: '物业通行证', intValue: null, spellName: null },
            { key: 4, value: '临时通行证', intValue: null, spellName: null },
          ],
        },
        {
          type: 'PM24',
          value: [
            { key: 1, value: '人脸采集', intValue: null, spellName: null },
            { key: 2, value: 'IC卡采集', intValue: null, spellName: null },
          ],
        },
      ],
    };
    if (data) {
      res.json(ResponseWarpper.success(data));
    } else {
      res.json(ResponseWarpper.failed('Not Found'));
    }
  },
};
