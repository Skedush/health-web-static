import { Action, AnyAction } from 'redux';
import { History } from 'history';
import { AppState } from '@/models/app';
import { HelpGlobalState } from '@/models/helpGlobal';
import { LoginState } from '@/pages/Login/model';
import { DeviceState } from '@/pages/Dashboard/Device/model';
import { VillageState } from '@/pages/Dashboard/BasicData/Village/model';
import { VillageEditState } from '@/pages/Dashboard/BasicData/Village/EditPage/model';
import { CommunityPersonState } from '@/pages/Dashboard/PropertyMgmt/Personnel/CommunityPerson/model';
import { PoliceState } from '@/pages/Dashboard/PropertyMgmt/Personnel/Police/model';
import { CourierState } from '@/pages/Dashboard/PropertyMgmt/Personnel/Courier/model';
import { PropertyState } from '@/pages/Dashboard/PropertyMgmt/Personnel/Property/model';
import { VolunteerState } from '@/pages/Dashboard/PropertyMgmt/Personnel/Volunteer/model';
import { DoorBanState } from '@/pages/Dashboard/Device/DoorBan/model';
import { PersonRecordState } from '@/pages/Dashboard/Device/DoorBan/PersonRecord/model';
import { CarBanState } from '@/pages/Dashboard/Device/CarBan/model';
import { TrafficState } from '@/pages/Dashboard/Device/Traffic/model';
import { CarRecordState } from '@/pages/Dashboard/Device/CarBan/CarRecord/model';
import { BlackListState } from '@/pages/Dashboard/Device/CarBan/BlackList/model';
import { HomeState } from '@/pages/Dashboard/Home/model';
import { DictionaryState } from '@/pages/Dashboard/SystemMgmt/Dictionary/model';
import { OperatingState } from '@/pages/Dashboard/SystemMgmt/Log/Operating/model';
import { SignInState } from '@/pages/Dashboard/SystemMgmt/Log/SignIn/model';
import { MenuState } from '@/pages/Dashboard/SystemMgmt/Menu/model';
import { RoleState } from '@/pages/Dashboard/SystemMgmt/Role/model';
import { UserState } from '@/pages/Dashboard/SystemMgmt/User/model';
import { BuildingState } from '@/pages/Dashboard/BasicData/Building/model';
import { VisitState } from '@/pages/Dashboard/Device/VisitBan/model';
import { DoorBanAuthSettingState } from '@/pages/Dashboard/Device/DoorBan/DoorBanAuthSetting/model';
import { CarBanAuthSettingState } from '@/pages/Dashboard/Device/CarBan/CarBanAuthSetting/model';
import { DoorAuthState } from '@/pages/Dashboard/Device/DoorBan/DoorAuth/model';
import { CarAuthState } from '@/pages/Dashboard/Device/CarBan/CarAuth/model';
import { CarState } from '@/pages/Dashboard/BasicData/Car/model';
import { HouseState } from '@/pages/Dashboard/BasicData/House/model';
import { CompanyState } from '@/pages/Dashboard/PropertyMgmt/Company/model';
import { CarGlobalState } from '@/models/carGlobal';
import { TakeoutState } from '@/pages/Dashboard/PropertyMgmt/Personnel/Provisional/model';
import { ParkingGlobalState } from '@/models/parkingGlobal';
import { ParkingState } from '@/pages/Dashboard/ParkingMgmt/Parking/model';
import { CarPassState } from '@/pages/Dashboard/Device/CarBan/CarPass/model';
import { AccessScreenState } from '@/pages/Dashboard/Device/CarBan/AccessScreen/model';
import { PersonModelState } from '@/models/person';
import { UnitGlobalState } from '@/models/unitGlobal';
import { BuildGlobalState } from '@/models/buildGlobal';
import { HouseGlobalState } from '@/models/houseGlobal';
import { InitState } from '@/pages/Initialization/model';
import { InitGlobalState } from '@/models/initGlobal';

export interface Dispatch<A extends Action = AnyAction> {
  <T extends A>(action: T): any;
}

export interface LoadingState {
  global: boolean;
  effects: { [key: string]: boolean | undefined };
  models: {
    app?: boolean;
    login?: boolean;
  };
}

export interface GlobalState {
  app: AppState;
  helpGlobal: HelpGlobalState;
  loading: LoadingState;
  login: LoginState;
  village: VillageState;
  villageEdit: VillageEditState;
  communityPerson: CommunityPersonState;
  visit: VisitState;
  police: PoliceState;
  courier: CourierState;
  building: BuildingState;
  property: PropertyState;
  volunteer: VolunteerState;
  takeout: TakeoutState;
  device: DeviceState;
  doorBan: DoorBanState;
  car: CarState;
  house: HouseState;
  carAuth: CarAuthState;
  doorAuth: DoorAuthState;
  doorBanAuthSetting: DoorBanAuthSettingState;
  carBanAuthSetting: CarBanAuthSettingState;
  carBan: CarBanState;
  blackList: BlackListState;
  personRecord: PersonRecordState;
  carRecord: CarRecordState;
  home: HomeState;
  dictionary: DictionaryState;
  operating: OperatingState;
  signIn: SignInState;
  menu: MenuState;
  role: RoleState;
  user: UserState;
  communtyInfo: CompanyState;
  carGlobal: CarGlobalState;
  parkingGlobal: ParkingGlobalState;
  parking: ParkingState;
  carPass: CarPassState;
  accessScreen: AccessScreenState;
  person: PersonModelState;
  unitGlobal: UnitGlobalState;
  buildGlobal: BuildGlobalState;
  houseGlobal: HouseGlobalState;
  init: InitState;
  initGlobal: InitGlobalState;
  traffic: TrafficState;
}

export interface UmiComponentProps {
  history: History;
  dispatch: Dispatch;
}

export enum DictionaryEnum {
  DEVICE_TYPE = 'PM1',
  DEVICE_STATUS = 'PM2',
  BUILD_UNIT = 'PM3',
  OPERATE_TYPE = 'PM4',
  CAR_TYPE = 'PM5',
  PERSON_TYPE = 'PM6',
  HOUSEHOLD_PERSON_TYPE = 'PM22',
  PASS_TYPE = 'PM7',
  PASS_METHOD = 'PM8',
  AUTH_STATUS = 'PM9',
  GATE_DIRECTION = 'PM10',
  CAR_AUTH_TIME_CONFIG = 'PM12',
  DOOR_AUTH_TIME_CONFIG = 'PM13',
  DOOR_BAN_DEVICE_TYPE = 'PM14',
  CAR_BAN_DEVICE_TYPE = 'PM15',
  VISIT_TYPE = 'PM16',
  HOUSE_STATE = 'PM17',
  COURIER_COMPANY = 'PM11',
  COMPANY_TYPR = 'PM20',
  CONSTRUCTION_TYPE = 'PM3',
  MENU_TYPE = '25',
  PROFESSION_TYPE = 'PM21',
  DOOR_BAN_PASS_TYPE = 'PM23',
  DOOR_BAN_PASS_WAY = 'PM24',
  TEMP_PERSON_TYPE = 'PM25',

  // 通行证配置时间
  PERMIT_TIME_MENU = 'PM35',

  // 物业职位类型
  PROPERTY_TYPE = '13',

  PARKING_SELL_STATE = 'PM29',
  PARKING_HAS_CHARGE = 'PM27',

  OPEN_CARBAN_WAY = 'PM31',

  CARD_TYPE = '16',

  PARKING_TYPE = 'PM28',
}
