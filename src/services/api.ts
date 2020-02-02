export default {
  queryRouteList: 'GET /sys/user/login/menu/get',
  queryUserInfo: 'GET /user',
  logout: 'GET /logout',
  login: 'POST /login',

  // 导入导出功能
  unitImport: 'POST /unit/file',
  houseImport: 'POST /house/file',
  carImport: 'POST /pm/car/upload',
  personImport: 'POST /pm/household/person/upload',

  unitTemplateDownload: 'POST /unit/download',
  houseTemplateaDownload: 'POST /house/download',
  carTemplateDownload: 'POST /pm/car/file',
  personTemplateDownload: 'POST /pm/household/person/file',

  exportVisitRecord: 'POST /comm/export/record/visitRecord/excel',

  // 小区基本信息接口
  villageInfo: 'GET /village/get',
  updateVillageInfo: 'POST /village/update',
  distructList: 'GET /district/list',
  distrucGetParent: 'GET /district/get/by/parent',
  // 单位管理
  getCompany: 'GET /pm/company/page',
  getCompanyById: 'GET /pm/company/:id/get',
  addCompany: 'POST /pm/company/add',
  companyDelete: 'POST /pm/company/delete',
  updateCompany: 'POST /pm/company/update',

  // 人员信息
  getPerson: 'GET /pm/company/person/page',
  personDetele: 'POST /pm/company/person/delete',
  companyPersonAdd: 'POST /pm/company/person/add',
  companyPersonUpdate: 'POST /pm/company/person/update',

  // 数据字典获取
  getDic: 'GET /sys/dic/get',

  // 首页
  // 快捷入口
  getHomeQuickEntry: 'GET /home/quickentry',
  // 管理员
  getAdministrator: 'GET /home/village/register/get',
  // 小区动态
  getHomeTableList: 'GET /home/village/dynamic/list',
  // 用户信息
  getUserInfo: 'GET /sys/user/login/info/get',
  // 待办事项
  getTodo: 'GET /pm/todo/get',
  // 人员基本信息
  getPersonBase: 'GET /pm/person/detail/:personId/get',
  // 人员通行证注销
  deletePersonIcCard: 'POST /pm/person/licence/delete',
  // 孩童信息
  getchildrenDetail: 'GET /pm/household/person/kid/:personId/get',
  deleteKid: 'POST /pm/household/person/todo/delete',
  // 车辆信息
  getCarDetail: 'GET /pm/car/once',
  // 车辆权限删除
  carAuthDelete: 'POST /pm/car/auth/delete',

  // 楼栋管理
  buildingPage: 'GET /building/page',
  buildingAdd: 'POST /building/add',
  batchAddBuild: 'POST /building/batch/add',
  buildingBatchadd: 'POST /building/batchadd',
  buildingUpdate: 'POST /building/update',
  buildingDelete: 'POST /building/delete',
  unitEnum: 'GET /unit/list/unit',
  unitList: 'GET /unit/list',
  floorEnum: 'GET /house/list/abovenum',
  buildingList: 'GET /house/list/all',
  // 房屋管理接口
  housePage: 'GET /house/page',
  houseAdd: 'POST /house/add',
  houseCheck: 'POST /house/check',
  setHouseHold: 'POST /house/person/set',
  houseUpdate: 'POST /house/update',
  houseGet: 'GET /house/:id/get',
  houseDelete: 'POST /house/delete',
  houseList: 'GET /house/list',
  batchAddHouse: 'POST /house/batch/add',
  generateAddHouse: 'GET /house/batch/add/list',
  // 单元管理接口
  unitPage: 'GET /unit/page',
  setUnitMgmt: 'POST /unit/charge/person/set',
  unitAdd: 'POST /unit/add',
  unitUpdate: 'POST /unit/update',
  unitGet: 'GET /unit/:id/get',
  unitDelete: 'POST /unit/delete',
  // 车辆管理
  carPage: 'GET /pm/car/page',
  carAdd: 'POST /pm/car/add',
  carUpdate: 'POST /pm/car/update',
  carDelete: 'POST /pm/car/delete',
  getCarProvince: 'GET /pm/car/province',
  getCarArea: 'GET /pm/car/area',
  getCompanyPerson: 'GET /pm/car/company',
  updateAuthCar: 'POST /pm/car/auth/update',

  // 住户获取监护对象
  getWard: 'GET /pm/household/person/guardian/:personId/get',

  // 获取住户的授权信息
  getPersonLicenceInfo: 'GET /pm/pass/way/house/get',

  // 临时人员
  addProvisional: 'POST /pm/provisional/add',
  updateProvisional: 'POST /pm/provisional/update',
  deleteProvisional: 'POST /pm/provisional/delete',
  pageProvisional: 'GET /pm/provisional/page',
  // 住户管理
  personPage: 'GET /pm/household/person/page',
  personAdd: 'POST /pm/household/person/add',
  personUpdate: 'POST /pm/household/person/update',
  logoutPerson: 'POST /pm/household/person/delete',
  personCheck: 'POST /pm/household/person/check',

  // 租户续租接口
  reletPerson: 'POST /pm/pass/way/rerent/licence/grant',

  // 孩童接口
  addChild: 'POST /pm/household/person/kid/add',
  editChild: 'POST /pm/household/person/kid/update',
  deleteChild: 'POST /pm/household/person/kid/delete',

  // 访客机管理
  visitDevicePage: 'GET /pm/visit/device/page',
  visitDeviceAdd: 'POST /pm/visit/device/add',
  visitDeviceDelete: 'POST /visit/device/delete',
  visitDeviceUpdete: 'POST /visit/device/update',
  visitRecordPage: 'GET /pm/visit/record/page',
  visitRecordExport: 'POST /visit/record/export',
  visitConfigUpdate: 'POST /pm/visit/visitor/auth',
  visitConfigGet: 'GET /pm/visit/visitor',
  // 人员管理
  // 社区民警
  getPolice: 'GET /pm/police/person/get',
  updatePolice: 'POST /pm/police/person/update',
  // 居委干部
  getCommunityPerson: 'GET /pm/community/person/page',
  addCommunityPerson: 'POST /pm/community/person/add',
  updateCommunityPerson: 'POST /pm/community/person/update',
  deleteCommunityPerson: 'POST /pm/community/person/delete',

  // 物业人员
  getProperty: 'GET /pm/property/person/page',
  addProperty: 'POST /pm/property/person/add',
  updateProperty: 'POST /pm/property/person/update',
  deleteProperty: 'POST /pm/property/person/delete',
  getPropertyList: 'GET /pm/property/person/list',

  // 志愿者
  getVolunteer: 'GET /pm/volunteer/person/page',
  addVolunteer: 'POST /pm/volunteer/person/add',
  updateVolunteer: 'POST /pm/volunteer/person/update',
  deleteVolunteer: 'POST /pm/volunteer/person/delete',

  // 快递员
  getCourier: 'GET /pm/courier/person/page',
  addCourier: 'POST /pm/courier/person/add',
  updateCourier: 'POST /pm/courier/person/update',
  deleteCourier: 'POST /pm/courier/person/delete',

  // 外卖员
  getTakeout: 'GET /pm/takeout/person/page',
  addTakeout: 'POST /pm/takeout/person/add',
  updateTakeout: 'POST /pm/takeout/person/update',
  deleteTakeout: 'POST /pm/takeout/person/delete',

  // 系统管理
  // 用户管理
  getUser: 'GET /sys/user/page',
  updateUser: 'POST /sys/user/update',
  addUser: 'POST /sys/user/add',
  deleteUser: 'POST /sys/user/delete',

  // 角色管理
  getRole: 'GET /sys/role/page',
  updateRole: 'POST /sys/role/update',
  getRoleInfo: 'GET /sys/role/:id/get',
  addRole: 'POST /sys/role/add',
  deleteRole: 'POST /sys/role/delete',
  getRoleList: 'GET /sys/role/list',
  updatePassWord: 'POST /sys/user/password/update',

  // 菜单管理
  getMenu: 'GET /sys/menu/page',
  updateMenu: 'POST /sys/menu/update',
  addMenu: 'POST /sys/menu/add',
  deleteMenu: 'POST /sys/menu/delete',
  getMenuList: 'GET /sys/menu/list',

  // 数据字典管理
  getDictionary: 'GET /sys/dictionary/page',
  updateDictionary: 'POST /sys/dictionary/update',
  addDictionary: 'POST /sys/dictionary/add',
  deleteDictionary: 'POST /sys/dictionary/delete',

  // 登录日志
  getSignIn: 'GET /log/sys/login/page',
  // 操作日志
  getOperating: 'GET /log/sys/operate/page',
  // 设备管理
  getDevice: 'GET /device/page',
  getDeviceInfo: 'GET /device/:id/get',
  addDevice: 'POST /device/add',
  updateDevice: 'POST /device/update',
  deleteDevice: 'POST /device/delete',

  // 通行权限添加
  icCardAdd: 'POST /pm/pass/way/change',
  icCardDelete: 'POST /pm/pass/way/delete',
  icCardInfo: 'GET /pm/pass/way/:personId/:type/get',
  icCardIssued: 'POST /pm/pass/way/licence/grant',

  // 获取通行时间
  getAuthTime: 'GET /pm/pass/way/time/:personId/:id/:type/get',

  // 门禁管理
  // 门禁设备管理
  getDeviceDoor: 'GET /device/door/page',
  addDeviceDoor: 'POST /device/door/add',
  getDeviceDoorList: 'GET /device/list',
  getDeviceSpec: 'GET /device/list/spec',
  // 门禁授权管理
  getPersonAuth: 'GET /person/auth/page',
  getPersonAuthInfo: 'GET /person/auth/:id/get',
  addPersonAuth: 'POST /person/auth/impower',
  deletePersonAuth: 'POST /person/auth/delete',
  addPersonDeviceAuth: 'POST /person/auth/impower/device/add',
  updatePersonDeviceAuth: 'POST /person/auth/impower/device/update',
  deletePersonDeviceAuth: 'POST /person/auth/delete/device',
  // 门禁通行记录
  getPersonRecord: 'GET /person/transit/record/page',
  exportPersonRecord: 'POST /comm/export/record/persontransit/excel',
  // 授权配置管理
  getDoorBanAuthSetting: 'GET /person/auth/setting/get',
  updateDoorBanAuthSetting: 'POST /person/auth/setting/update',

  // 道闸管理
  // 道闸设备管理
  bindingLED: 'POST /device/car/binding',
  unbindingLED: 'POST /device/car/unbinding',
  getDeviceCar: 'GET /device/car/page',
  addDeviceCar: 'POST /device/car/add',

  // LED出入屏设备管理
  getAccessScreenDeviceList: 'GET /device/led/list',
  getAccessScreenDevice: 'GET /device/led/page',
  getAccessScreenById: 'GET /device/led/:id/get',
  getAccessScreenSpec: 'GET /device/led/list/spec',
  addAccessScreenDevice: 'POST /device/led/add',
  updateAccessScreenDevice: 'POST /device/led/update',
  deleteAccessScreenDevice: 'POST /device/led/delete',

  // 车辆授权管理
  getCarAuth: 'GET /car/auth/page',
  getCarAuthInfo: 'GET /car/auth/:id/get',
  addCarAuth: 'POST /car/auth/impower',
  deleteCarAuth: 'POST /car/auth/delete',
  updateCarAuth: 'POST /car/auth/update',

  // 通行管理
  getPositionList: 'GET /pass/position/list',
  // 获取通行位置门禁绑定设备列表
  getPositionDoorListget: 'GET /pass/position/door/list',
  // 获取通行位置道闸绑定设备列表
  getPositionDeviceList: 'GET /pass/position/device/list',
  // 通行位置设备解绑
  positionUnbind: 'POST /pass/position/unbind',
  // 通行位置设备绑定
  positionBind: 'POST /pass/position/bind',

  // 车辆通行证管理
  getCarPass: 'GET /pm/pass/car/page',
  getCarPassById: 'GET /pm/pass/car/:id/get',
  updateCarPassAuth: 'POST /pm/pass/car/auth/update',
  // 车辆通行记录
  getCarRecord: 'GET /car/transit/record/page',
  exportCarRecord: 'POST /comm/export/record/cartransit/excel',

  // 车辆通行证
  issuedCarAuthTime: 'POST /pm/car/auth/update',
  // 车辆黑名单管理
  getCarBlackList: 'GET /car/blacklist/page',
  addCarBlackList: 'POST /car/blacklist/add',
  updateCarBlackList: 'POST /car/blacklist/update',
  deleteCarBlackList: 'POST /car/blacklist/delete',
  // 授权配置管理
  getCarBanAuthSetting: 'GET /car/auth/setting/get',
  updateCarBanAuthSetting: 'POST /car/auth/setting/update',

  // 停车场管理
  parkingList: 'GET /pm/parking/lot/list',
  getParkingById: 'GET /pm/parking/lot/:id/get',
  addParking: 'POST /pm/parking/lot/add',
  editParking: 'POST /pm/parking/lot/update',
  deleteParking: 'POST /pm/parking/lot/delete',
  getParkingCarList: 'GET /pm/parking/lot/public/:parkingLotId/car/page',
  getNotInParkingCar: 'GET /pm/parking/lot/public/nothingness/car/page',
  bindingParkingForCar: 'POST /pm/parking/lot/public/car/binding',
  unbindingParkingForCar: 'POST /pm/parking/lot/public/car/unbinding', // 公共停车场解绑车辆
  getCarForId: 'GET /pm/car/:id/get',

  // 停车场规则配置
  getParkingSetting: 'GET /pm/parking/lot/setting/get',
  updateParkingSetting: 'POST /pm/parking/lot/setting/update',

  // 停车场设备关联
  getParkingDeviceList: 'GET /pm/parking/lot/device/list',
  bindingParkingDevice: 'POST /pm/parking/lot/device/binding',
  unbindingParkingDevice: 'POST /pm/parking/lot/device/unbinding',
  getParkingOptionalDevice: 'GET /device/car/device/list',

  //  门禁通行证查询
  getLicencePage: 'GET /pm/person/licence/page',
  getLicenceInfo: 'GET /pm/person/licence/:id/get',
  passWayAllLicence: 'POST /pm/pass/way/licence/all/grant',

  // 车位管理
  getPersonList: 'GET /pm/person/page',
  getParkingItem: 'GET /pm/parking/space/page',
  getParkingItemById: 'GET /pm/parking/space/:id/get',
  addParkingItem: 'POST /pm/parking/space/add',
  resellParkingItem: 'POST /pm/parking/space/resell',
  changeParkingItem: 'POST /pm/parking/space/change',
  unbindParkingItemPerson: 'POST /pm/parking/space/person/unbinding',
  sellParkingItem: 'POST /pm/parking/space/sell',
  bindingParkingItemForCar: 'POST /pm/parking/space/car/binding',
  deleteParkingItem: 'POST /pm/parking/space/delete',
  unbindParkingForCar: 'POST /pm/parking/space/car/unbinding',
  getCarByPlate: 'GET /pm/car/get',
  renewParkingItem: 'POST /pm/parking/space/renew',
  getSelectCarList: 'GET /pm/car/list',

  // ic卡管理
  getIcCardList: 'GET /ic/card/page',
  addIcCard: 'POST /ic/card/add',
  iussedIcCardAuth: 'POST /ic/card/authorize',
  updateIcCard: 'POST /ic/card/update',
  deleteIcCard: 'POST /ic/card/delete',
  getIcCardDetail: 'GET /ic/card/:id/get',

  // V1.0.5 通行证列表接口
  getPermitList: 'GET /pm/pass/card/page',
  addPermit: 'POST /pm/pass/card/add',
  updatePermit: 'POST /pm/pass/card/update',
  deletePermit: 'POST /pm/pass/card/delete',

  // 获取通行证列表
  getSelectPermitList: 'GET /pm/pass/card/list',

  // 删除通行证待办事项
  deleteTodo: 'POST /pm/todo/delete',
  // 绑定通行证
  personBindingPermit: 'POST /pm/person/pass/card/binding',
  personUnbindingPermit: 'POST /pm/person/pass/card/unbinding',
  carBindingPermit: 'POST /pm/car/pass/card/binding',
  carUnbindingPermit: 'POST /pm/car/pass/card/unbinding',
  // 获取车辆和人员的通行证列表
  getPersonPermitList: 'GET /pm/person/pass/card/detail/get',
  getCarPermitList: 'GET /pm/car/pass/card/detail/:id/get',

  // 更新通行证授权
  updatePersonPermit: 'POST /pm/person/pass/card/auth/update',
  updateCarPermit: 'POST /pm/car/pass/card/auth/update',
  updateAllPersonPermit: 'POST /pm/person/pass/card/all/auth/update',
  updateAllCarPermit: 'POST /pm/car/pass/card/all/auth/update',
  // 修改通行证时间
  modifyPersonPermitTime: 'POST /pm/person/pass/card/auth/delay',
  modifyCarPermitTime: 'POST /pm/car/pass/card/auth/delay',

  // 授权管理信息
  getPersonAuthBaseInfo: 'GET /pm/person/pass/card/auth/:id/get',
  getCarAuthBaseInfo: 'GET /pm/car/pass/card/auth/:id/get',

  // 批量更新人员通行证
  batchUpdatePersonPermit: 'POST /pm/person/pass/card/batch/auth/update',

  // 获取人员待办事项
  getPersonTodoData: 'GET /pm/person/pass/card/detail/get',

  // 通行证回收
  recoverPersonPermit: 'POST /pm/person/pass/card/auth/recover',
  recoverCarPermit: 'POST /pm/car/pass/card/auth/recover',

  getPositionLists: 'GET /pass/position/list',
  getPosotionCarList: 'GET /pass/position/car/list',
  getPositionPersonList: 'GET /pass/position/door/list',

  // 新增ic卡
  addICCardLicence: 'GET /ic/card/licence/add',
  // 未认证人员获取通行证列表
  getUncheckedPermitList: 'GET /pm/person/pass/card/uncertified/list',

  // 获取国家列表
  getCountryList: 'GET /country/list',

  // 读取身份证本地接口
  getIdCardInfo: '/ZKIDROnline/ScanReadIdCardInfo',

  // 获取ic卡物理卡号
  getReadCardId: '/ZKIDROnline/MFCard',

  // 初始化接口
  // 获取房屋单元树
  getBuildingAndUnitTree: 'GET /unit/list/all',
  // 出入口
  getEntranceList: 'GET /entrance/list',
  addEntrance: 'POST /entrance/add',
  updateEntrance: 'POST /entrance/update',
  deleteEntrance: 'POST /entrance/delete',
  getInitSetting: 'GET /init/setting/get',
  updateInitSetting: 'POST /init/setting/update',
  // 帮助手册下载
  getHelpFile: 'GET /assist/guide/list',
};
