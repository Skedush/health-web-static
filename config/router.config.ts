import { IRoute } from 'umi-types';

const routes: IRoute[] = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    component: '../layouts',
    routes: [{ path: '/login', component: './Login' }],
  },

  {
    path: '/initialization',
    component: '../layouts',
    routes: [{ path: '/initialization', component: './Initialization' }],
  },

  {
    path: '/dashboard',
    component: '../layouts',
    routes: [
      { path: '/dashboard', redirect: '/dashboard/home' },
      { path: '/dashboard/home', component: './Dashboard/Home' },
      // 基础信息
      {
        path: '/dashboard/basicdata',
        routes: [
          { path: '/dashboard/basicdata/village', component: './Dashboard/BasicData/Village' },
          {
            path: '/dashboard/basicdata/villageedit',
            component: './Dashboard/BasicData/Village/EditPage',
          },
          {
            path: '/dashboard/basicdata/buildingAndUnitAndHouse',
            component: './Dashboard/BasicData/BuildingAndUnitAndHouse',
          },
          { path: '/dashboard/basicdata/car', component: './Dashboard/BasicData/Car' },
          { path: '/dashboard/basicdata/person', component: './Dashboard/BasicData/Person' },
        ],
      },
      // 物业管理
      {
        path: '/dashboard/propertymgmt',
        routes: [
          {
            path: '/dashboard/propertymgmt/personnel',
            routes: [
              // 人员管理
              // 居委干部
              {
                path: '/dashboard/propertymgmt/personnel/communityperson',
                component: './Dashboard/PropertyMgmt/Personnel/CommunityPerson',
              },
              // 快递员
              {
                path: '/dashboard/propertymgmt/personnel/courier',
                component: './Dashboard/PropertyMgmt/Personnel/Courier',
              },
              // // 外卖员
              // {
              //   path: '/dashboard/propertymgmt/personnel/takeout',
              //   component: './Dashboard/PropertyMgmt/Personnel/Takeout',
              // },
              // 临时人员
              {
                path: '/dashboard/propertymgmt/personnel/provisional',
                component: './Dashboard/PropertyMgmt/Personnel/Provisional',
              },
              // 民警
              {
                path: '/dashboard/propertymgmt/personnel/police',
                component: './Dashboard/PropertyMgmt/Personnel/Police',
              },
              // 志愿者
              {
                path: '/dashboard/propertymgmt/personnel/volunteer',
                component: './Dashboard/PropertyMgmt/Personnel/Volunteer',
              },
              // 物业人员
              {
                path: '/dashboard/propertymgmt/personnel/property',
                component: './Dashboard/PropertyMgmt/Personnel/Property',
              },
            ],
          },
          {
            path: '/dashboard/propertymgmt/company',
            component: './Dashboard/PropertyMgmt/Company',
          },
          {
            path: '/dashboard/propertymgmt/iccardmgmt',
            component: './Dashboard/PropertyMgmt/ICCardMgmt',
          },
        ],
      },
      // 通行管理
      {
        path: '/dashboard/device',
        routes: [
          {
            path: '/dashboard/device/doorBan',
            routes: [
              // 通行证管理
              {
                path: '/dashboard/device/doorBan/passportmgmt',
                component: './Dashboard/Device/DoorBan/PassportMgmt',
              },
              // 门禁设备管理
              {
                path: '/dashboard/device/doorBan/index',
                component: './Dashboard/Device/DoorBan/index',
              },
              // 门禁授权管理
              {
                path: '/dashboard/device/doorBan/doorAuth',
                component: './Dashboard/Device/DoorBan/DoorAuth',
              },
              // 门禁授权配置管理
              {
                path: '/dashboard/device/doorBan/doorBanAuthSetting',
                component: './Dashboard/Device/DoorBan/DoorBanAuthSetting',
              },
              // 人员通行记录
              {
                path: '/dashboard/device/doorBan/personRecord',
                component: './Dashboard/Device/DoorBan/PersonRecord',
              },
            ],
          },
          {
            path: '/dashboard/Device/carBan',
            routes: [
              // 车辆通行证管理
              {
                path: '/dashboard/device/carBan/carPass',
                component: './Dashboard/Device/CarBan/CarPass',
              },
              // 道闸设备管理
              {
                path: '/dashboard/device/carBan/index',
                component: './Dashboard/Device/CarBan/index',
              },
              // LED出入屏设备管理
              {
                path: '/dashboard/device/carBan/accessScreen',
                component: './Dashboard/Device/CarBan/AccessScreen',
              },
              // 车辆授权管理
              {
                path: '/dashboard/device/carBan/carAuth',
                component: './Dashboard/Device/CarBan/CarAuth',
              },
              // 道闸配置管理
              {
                path: '/dashboard/device/carBan/carBanAuthSetting',
                component: './Dashboard/Device/CarBan/CarBanAuthSetting',
              },
              // 车辆通行记录
              {
                path: '/dashboard/device/carBan/carRecord',
                component: './Dashboard/Device/CarBan/CarRecord',
              },
              // 车辆黑名单管理
              {
                path: '/dashboard/device/carBan/blackList',
                component: './Dashboard/Device/CarBan/BlackList',
              },
            ],
          },
          {
            path: '/dashboard/device/visitban',
            routes: [
              { path: '/dashboard/device/visitban', component: './Dashboard/Device/VisitBan' },
              {
                path: '/dashboard/device/visitban/visitrecord',
                component: './Dashboard/Device/VisitBan/VisitRecord',
              },
              {
                path: '/dashboard/device/visitban/visitconfig',
                component: './Dashboard/Device/VisitBan/VisitConfig',
              },
            ],
          },
          {
            path: '/dashboard/device/permit',
            component: './Dashboard/Device/Permit',
          },
          // 通行位置
          {
            path: '/dashboard/device/traffic',
            component: './Dashboard/Device/Traffic',
          },
        ],
      },
      // 系统管理
      {
        path: '/dashboard/systemMgmt',
        routes: [
          {
            path: '/dashboard/systemMgmt/user',
            component: './Dashboard/SystemMgmt/User',
          },
          {
            path: '/dashboard/systemMgmt/role',
            component: './Dashboard/SystemMgmt/Role',
          },

          { path: '/dashboard/propertymgmt/village', component: './Dashboard/BasicData/Village' },
          {
            path: '/dashboard/systemMgmt/menu',
            component: './Dashboard/SystemMgmt/Menu',
          },
          {
            path: '/dashboard/systemMgmt/dictionary',
            component: './Dashboard/SystemMgmt/Dictionary',
          },
          {
            path: '/dashboard/systemMgmt/log',
            routes: [
              {
                path: '/dashboard/systemMgmt/log/signIn',
                component: './Dashboard/SystemMgmt/Log/SignIn',
              },
              {
                path: '/dashboard/systemMgmt/log/operating',
                component: './Dashboard/SystemMgmt/Log/Operating',
              },
            ],
          },
        ],
      },

      {
        path: '/dashboard/parkingMgmt',
        routes: [
          {
            path: '/dashboard/parkingMgmt/parking',
            component: './Dashboard/ParkingMgmt/Parking',
          },
          {
            path: '/dashboard/parkingMgmt/parkingRule',
            component: './Dashboard/ParkingMgmt/ParkingRule',
          },
        ],
      },
    ],
  },
  {
    path: '/404',
    redirect: '/exception/404',
  },
  {
    path: '/exception',
    routes: [
      { path: '/exception', redirect: '/exception/404' },
      { path: '/exception/:code', component: './Exception' },
    ],
  },
];

export default routes;
