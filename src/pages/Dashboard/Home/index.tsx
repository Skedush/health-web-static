/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */
/* eslint-disable no-dupe-class-members */
import React, { PureComponent, Fragment, createRef, RefObject } from 'react';
import moment from 'moment';
import styles from './index.less';
import { connect } from '@/utils/decorators';
import classNames from 'classnames';
import { RouteList } from '@/utils/config';
import { router, queryPermission, copyArrParam } from '@/utils';
import passportImage from '@/assets/images/permit/passport.png';
import {
  Table,
  // SearchForm,
  // ButtonGroup,
  Button,
  CommonComponent,
  Img,
  ModalForm,
  Card,
  ModalDetail,
  Message,
  Confirm,
  OperatingResults,
} from '@/components/Library';
import {
  FormComponentProps,
  // PaginationConfig,
  WrappedFormUtils,
  ColumnProps,
  UploadFile,
} from '@/components/Library/type';
import themeColorClient from '@/utils/themeColorClient';
// import dark from '@/themes/templates/dark';
// import light from '@/themes/templates/light';
import { GlobalState, UmiComponentProps, DictionaryEnum } from '@/common/type';
import PersonForm, { EPersonType } from '../BasicData/Person/components/PerosonForm';
import HouseholdModal from './components/HouseholdModal';
import AddCarModal from '../BasicData/Car/components/AddCarModal';
import { SUCCESS_WRITTEN_OFF, SUCCESS_DONE } from '@/utils/message';
import AuthInfo from '../Device/DoorBan/PassportMgmt/components/AuthInfo';
import AntdIcon from '@/components/Library/Icon';

// import { add, minus } from '@/actions/app';

const mapStateToProps = (state: GlobalState) => {
  return {
    homeData: state.home.homeData,
    detailInfo: state.home.detailInfo,
    administrator: state.app.administrator,
    homeList: state.home.homeList,
    routeList: state.app.routeList,
    userInfo: state.app.userInfo,
    loading: state.loading.effects['home/getTodo'],
    personIcCard: state.loading.effects['home/deletePersonIcCard'],
    childrenLoading: state.loading.effects['home/deleteKid'],
    carLoading: state.loading.effects['home/carDelete'],
    carAuthLoading: state.loading.effects['home/carAuthDelete'],
  };
};

type BuildingStateProps = ReturnType<typeof mapStateToProps>;
type BuildingProps = BuildingStateProps & UmiComponentProps & FormComponentProps;

interface BuildingState {
  add: boolean;
  fileList: UploadFile[];
  modifyApplyFor: boolean;
  modifyVehicleLicense: boolean;
  modifyAlarmFor: boolean;
  authInfo: any;
  addCarModalVisible: boolean;
  personDetailVisible: boolean;
  childrenDetailVisible: boolean;
  carDetailVisible: boolean;
  authInfoVisible: boolean;
  todoType: string;
  personDeletePayload: {
    id: number;
    originId: number;
    type?: string;
    todoId?: string;
    ext?: string;
  };
  carAuthPayload: {
    todoId: number;
    carId?: number;
    id?: number;
  };
  remark?: string;
  operatingResultsVisible: boolean;
  batchHandleResultsData: { [propName: string]: any };
  kidPayload: {
    todoId: number;
  };
  authInfoPayload: {
    todoId: number;
    licenceId: any;
  };
  authInfoType: 'person' | 'car';
}

@connect(
  mapStateToProps,
  null,
)
class Home extends PureComponent<BuildingProps, BuildingState> {
  searchForm: WrappedFormUtils;
  modelForm: WrappedFormUtils;

  personFormRef: RefObject<PersonForm> = createRef();

  HouseholdRef: RefObject<HouseholdModal> = createRef();
  confirmRef: RefObject<Confirm>;

  currentTodo: any;

  constructor(props: Readonly<BuildingProps>) {
    super(props);
    this.confirmRef = createRef();
    this.state = {
      fileList: [],
      add: false,
      addCarModalVisible: false,
      modifyApplyFor: false,
      modifyVehicleLicense: false,
      modifyAlarmFor: false,
      personDetailVisible: false,
      authInfoVisible: false,
      childrenDetailVisible: false,
      carDetailVisible: false,
      todoType: '',
      personDeletePayload: { id: 0, originId: 0, ext: '' },
      carAuthPayload: { todoId: 0, carId: 0 },
      remark: '',
      operatingResultsVisible: false,
      batchHandleResultsData: {},
      kidPayload: { todoId: 0 },
      authInfo: {},
      authInfoPayload: { todoId: 0, licenceId: 0 },
      authInfoType: 'person',
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    // dispatch({ type: 'home/getHomeQuickEntry', payload: { page: 0 } });
    dispatch({ type: 'app/getDic', payload: { type: DictionaryEnum.CAR_TYPE } });
    dispatch({ type: 'carGlobal/getCarProvince', payload: {} });
    dispatch({ type: 'home/getTodo', payload: {} });

    // dispatch({ type: 'app/query' });
  }
  // tslint:disable-next-line: no-unused-expression
  renderCard() {
    const { administrator, routeList, userInfo } = this.props;
    const data = [
      {
        image: require('../../../assets/images/vilage.png'),
        name: '人员登记',
        value: '小区人员快捷登记入口',
        onClick: this.openPerson,
        route: '/dashboard/basicdata/village',
      },
      {
        image: require('../../../assets/images/house.png'),
        name: '人员注销',
        onClick: this.removePerson,
        value: '小区人员搬离注销入口',
        route: '/dashboard/basicdata/person',
      },
      {
        image: require('../../../assets/images/car.png'),
        name: '车辆登记',
        value: '小区进出车辆登记入口',
        onClick: this.addCar,
        route: '/dashboard/basicdata/car',
      },
      {
        image: require('../../../assets/images/door.png'),
        name: '车辆注销',
        onClick: () => this.pushRouter('/dashboard/basicdata/car'),
        value: '小区车辆注销入口',
        route: '/dashboard/basicdata/car',
      },
    ];

    const items = queryPermission(routeList as RouteList[], data);

    return (
      <div className={styles.cardBox}>
        <Card title={'快捷入口'} className={styles.leftBox} hoverable>
          {items.map((text, index) => (
            <Card.Grid key={index}>
              <div className={styles.gridBox} onClick={text.onClick}>
                <img className={styles.gridImage} src={text.image} />
                <p>{text.name}</p>
                <div className={styles.leftText}>{text.value}</div>
              </div>
            </Card.Grid>
          ))}
        </Card>
        <Card title={'管理员'} className={styles.rightBox}>
          <div className={styles.rightBoxTop}>
            <Img
              image={administrator ? administrator.image : ''}
              defaultImg={require('@/assets/images/residents.png')}
              className={styles.topImage}
              previewImg
            />
            <div className={styles.topLeft}>
              <div>
                {userInfo && userInfo.roleName && <p>{userInfo.roleName}</p>}
                {userInfo && <h2>{userInfo.name}</h2>}
              </div>
              {/* <Icon type={'right'} /> */}
            </div>
          </div>
          <div className={styles.rightBottom}>
            <div>
              <span className={styles.yuan} style={{ background: '#22FEF1' }} />
              <p>
                <span>登记车辆</span>
                <span>{administrator ? administrator.carCount : ''}</span>
              </p>
            </div>
            <div>
              <span className={styles.yuan} style={{ background: '##22C2FE' }} />
              <p>
                <span>登记房屋</span>
                <span>{administrator ? administrator.houseCount : ''}</span>
              </p>
            </div>
            <div>
              <span className={styles.yuan} style={{ background: '#5069E4' }} />
              <p>
                <span>登记人数</span>
                <span>{administrator ? administrator.householdCount : ''}</span>
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // eslint-disable-next-line max-lines-per-function
  renderTable() {
    const { homeList, loading } = this.props;
    const columns: ColumnProps<any>[] = [
      {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
        width: '6%',
        align: 'center',
        render: (text: any, record: object, rowIndex) => {
          return CommonComponent.renderTableCol(rowIndex + 1, record);
        },
      },
      // {
      //   title: '头像',
      //   dataIndex: 'messageType',
      //   key: 'messageType',
      //   width: '10%',
      //   align: 'center',
      //   render: (text: any, record: object) => {
      //     let img: any = '';
      //     switch (text) {
      //       case 1:
      //         img = require('@/assets/images/residents.png');
      //         break;
      //       case 2:
      //         img = require('@/assets/images/tableCar.png');
      //         break;
      //       case 3:
      //         img = require('@/assets/images/equipment.png');
      //         break;
      //       default:
      //         console.log('text: ', text);
      //         break;
      //     }
      //     return <Img image={text} defaultImg={img} className={styles.tableImage} previewImg={true}/>;
      //   },
      // },
      // {
      //   title: '名称',
      //   width: '10%',
      //   align: 'center',
      //   dataIndex: 'name',
      //   key: 'name',
      //   render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      // },
      // {
      //   title: '地址信息',
      //   // width: '20%',
      //   align: 'center',
      //   dataIndex: 'address',
      //   key: 'address',
      //   render: (text: any, record: object) =>
      //     this.props.homeList ? <span className={styles.tableText}>{text || ''}</span> : '',
      // },
      // {
      //   title: '状态',
      //   width: '15%',
      //   align: 'center',
      //   key: 'message',
      //   dataIndex: 'message',
      //   render: (text: any, record: any) =>
      //     this.props.homeList ? (
      //       <Fragment>
      //         <div className={classNames(styles.tableType)}>
      //           <span
      //             className={classNames({
      //               [styles.type1]: record.type === '1',
      //               [styles.type2]: record.type === '2',
      //               [styles.type3]: record.type === '3',
      //             })}
      //           />
      //           <span>{text}</span>
      //         </div>
      //       </Fragment>
      //     ) : (
      //       ''
      //     ),
      // },
      {
        title: '描述',
        width: '65%',
        key: 'remark',
        dataIndex: 'remark',
        render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '时间',
        width: '15%',
        key: 'time',
        dataIndex: 'time',
        render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '操作',
        align: 'center',
        width: '10%',
        key: 'type',
        dataIndex: 'type',
        render: (_text: any, record: object) =>
          this.props.homeList ? (
            <Fragment>
              <Button
                customtype={'icon'}
                size={'small'}
                onClick={e => this.DetailsCheck(record, e)}
                title={'核验'}
                className={styles.tableBtn}
              >
                查看
              </Button>
            </Fragment>
          ) : null,
      },
    ];
    return (
      <Card className={classNames('flexAuto', styles.tableBox)}>
        <h2>待办事项</h2>
        <Table
          loading={loading}
          columns={columns}
          dataSource={homeList}
          hiddenPagination
          scroll={{ y: '100%' }}
          type={'none'}
        />
      </Card>
    );
  }

  // 车辆授权修改
  renderVehicleLicenseForm() {
    const props = {
      items: [
        { type: 'input', field: '１', placeholder: '关联人员', initialValue: '请输入' },
        { type: 'input', field: '２', placeholder: '联系电话', initialValue: '请输入' },
        { type: 'input', field: '３', placeholder: '车牌号', initialValue: '请输入' },
        { type: 'input', field: '４', placeholder: '品牌', initialValue: '请输入' },
        { type: 'input', field: '５', placeholder: '车型', initialValue: '请输入' },
        { type: 'input', field: '６', placeholder: '颜色', initialValue: '请输入' },
        {
          type: 'select',
          field: '７',
          children: [
            { key: '娜娜', value: 1 },
            { key: '3333', value: 2 },
            { key: '2222', value: 3 },
          ],
          placeholder: '车辆类型',
          // onChange: this.onSelectChange,
          initialValue: '请输入',
        },
        {
          type: 'rangePicker',
          children: [
            {
              key: '123',
              value: 1,
            },
            {
              key: '123',
              value: 1,
            },
          ],
          field: '８',
          placeholder: ['授权', '时间'] as [string, string],
          // initialValue: '请输入',
        },
        { type: 'input', field: '９', placeholder: '备注', fill: true, initialValue: '' },
      ],
      actions: [
        { customtype: 'master', title: '确认修改', htmlType: 'submit' as 'submit' },
        { customtype: 'second', title: '忽略', onClick: this.onCancelModel },
      ],
      onSubmit: this.onModelSubmit,
      title: '车辆授权到期',
      onCancel: this.onCancelModel,
      destroyOnClose: true,
      width: '30%',
      bodyStyle: {},
      add: this.state.add,
      modify: this.state.modifyVehicleLicense,
      onGetFormRef: (modelForm: WrappedFormUtils) => {
        this.modelForm = modelForm;
      },
    };
    return <ModalForm {...props} />;
  }

  // 设备告警
  renderAlarmForm() {
    const props = {
      items: [
        { type: 'input', field: '１', placeholder: '设备状态', initialValue: '请输入' },
        {
          type: 'datePicker',
          field: '２',
          onChange: this.onDatePickerChange,
          placeholder: '建设时间',
          initialValue: '请输入',
        },
        { type: 'input', field: '３', placeholder: '设备名称', initialValue: '请输入' },
        {
          type: 'select',
          field: '457',
          children: [{ key: '1', value: 1 }, { key: '2', value: 2 }, { key: '3', value: 3 }],
          placeholder: '设备类型',
          // onChange: this.onSelectChange,
          initialValue: '请输入',
        },
        { type: 'input', field: '5', placeholder: '设备品牌', initialValue: '请输入' },
        { type: 'input', field: '6', placeholder: '设备型号', initialValue: '请输入' },
        { type: 'input', field: '7', placeholder: '设备地址', initialValue: '请输入', fill: true },
        {
          type: 'select',
          field: '8',
          children: [
            { key: '4', value: 1 },
            { key: '5675', value: 2 },
            { key: '575756', value: 3 },
          ],
          placeholder: '建设单位',
          // onChange: this.onSelectChange,
          initialValue: '请输入',
        },
        { type: 'input', field: '9', placeholder: '联系电话', initialValue: '请输入' },
        {
          type: 'select',
          field: '10',
          children: [{ key: '7423', value: 1 }, { key: '2438', value: 2 }, { key: '59', value: 3 }],
          placeholder: '运营单位',
          // onChange: this.onSelectChange,
          initialValue: '请输入',
        },
        { type: 'input', field: '11', placeholder: '联系电话', initialValue: '请输入' },
      ],
      actions: [
        { customtype: 'master', title: '报修', htmlType: 'submit' as 'submit' },
        { customtype: 'second', title: '忽略', onClick: this.onCancelModel },
      ],
      onSubmit: this.onModelSubmit,
      title: '设备告警',
      onCancel: this.onCancelModel,
      destroyOnClose: true,
      width: '30%',
      bodyStyle: {},
      add: this.state.add,
      modify: this.state.modifyAlarmFor,
      onGetFormRef: (modelForm: WrappedFormUtils) => {
        this.modelForm = modelForm;
      },
    };
    return <ModalForm {...props} />;
  }

  // 报修申请
  renderApplyForForm() {
    const props = {
      items: [
        { type: 'input', field: '1', placeholder: '报障人', initialValue: '请输入' },
        { type: 'input', field: '2', placeholder: '联系电话', initialValue: '请输入' },
        {
          type: 'select',
          field: '3',
          children: [
            { key: '1111', value: 1 },
            { key: '3333', value: 2 },
            { key: '2222', value: 3 },
          ],
          placeholder: '故障类型',
          // onChange: this.onSelectChange,
          initialValue: '请输入',
        },
        { type: 'input', field: '4', placeholder: '故障描述', initialValue: '请输入' },
      ],
      actions: [
        { customtype: 'master', title: '确认', htmlType: 'submit' as 'submit' },
        { customtype: 'second', title: '取消', onClick: this.onCancelModel },
      ],
      onSubmit: this.onModelSubmit,
      title: '报修申请',
      onCancel: this.onCancelModel,
      destroyOnClose: true,
      width: '30%',
      bodyStyle: {},
      add: this.state.add,
      modify: this.state.modifyApplyFor,
      onGetFormRef: (modelForm: WrappedFormUtils) => {
        this.modelForm = modelForm;
      },
    };
    return <ModalForm {...props} />;
  }

  // 详情-人员基础信息
  renderPersonDetailModal() {
    const { detailInfo = [], personIcCard } = this.props;
    const { personDetailVisible, personDeletePayload, remark } = this.state;
    const props = {
      items: undefined,
      info: {},
      visible: personDetailVisible,
      onCancel: this.onCancelDetailModel,
      title: '人员详情',
      actions: [
        {
          customtype: 'select',
          title: '通行证回收',
          onClick: () => this.deleteIcCard(personDeletePayload),
          loading: personIcCard,
        },
        { customtype: 'second', title: '取消', onClick: this.onCancelDetailModel },
      ],
      width: '50%',
      remark,
      customRender: () => {
        return (
          detailInfo &&
          detailInfo.map &&
          detailInfo.map(item => {
            return this.renderPermitItem(item);
          })
        );
      },
    };

    return <ModalDetail {...props} />;
  }

  // 孩童信息详情
  renderChildrenDetailModal() {
    const { detailInfo = {}, childrenLoading } = this.props;
    const { childrenDetailVisible, remark } = this.state;
    const props = {
      items: [
        {
          name: '房屋地址',
          value: detailInfo.houseAddress,
        },
        {
          name: '户主姓名',
          value: detailInfo.householderName,
        },
        {
          name: '户主电话',
          value: detailInfo.householderPhone,
        },
        {
          name: '监护人',
          value: detailInfo.guardianName,
        },
        {
          name: '住户类型',
          value: detailInfo.typeName + (detailInfo.foreign ? '（外籍孩童）' : '（孩童）'),
        },
        {
          name: '入住时间',
          value: detailInfo.startTime,
        },
        {
          name: '到期时间',
          value: detailInfo.expireTime,
        },
        {
          name: '孩童姓名',
          value: detailInfo.name,
        },
        {
          name: '证件号码',
          value: detailInfo.idCard,
        },
        {
          name: detailInfo.foreign ? '国籍' : '民族',
          value: detailInfo.foreign ? detailInfo.nationality : detailInfo.nation,
        },
        {
          name: '出生年月',
          value: detailInfo.birthday,
        },
        {
          name: '性别',
          value: detailInfo.sex === '1' ? '男' : '女',
        },
        {
          name: '证件地址',
          value: detailInfo.icCardAddress,
        },
        {
          name: '联系电话',
          value: detailInfo.phone,
        },
        {
          name: '备注',
          value: detailInfo.remark,
        },
      ],
      info: detailInfo,
      visible: childrenDetailVisible,
      onCancel: this.onCancelDetailModel,
      title: '人员详情',
      actions: [
        {
          customtype: 'select',
          title: '孩童注销',
          onClick: () => this.deleteKid(detailInfo.subId),
          loading: childrenLoading,
        },
        { customtype: 'second', title: '取消', onClick: this.onCancelDetailModel },
      ],
      width: '70%',
      remark,
    };

    return <ModalDetail {...props} />;
  }

  // 车辆信息详情
  renderCarDetailModal() {
    const { detailInfo = {}, carLoading, carAuthLoading } = this.props;
    const { carDetailVisible, todoType, remark } = this.state;
    let items = [
      {
        name: '车辆类型',
        value: detailInfo.typeStr,
      },
      {
        name: '车牌号',
        value: detailInfo.licensePlate,
      },
      {
        name: '车辆品牌',
        value: detailInfo.brand,
      },
      {
        name: '车辆颜色',
        value: detailInfo.color,
      },
      {
        name: '备注',
        value: detailInfo.remark,
      },
    ];
    if (detailInfo.ownerName) {
      items = [
        {
          name: '车主姓名',
          value: detailInfo.ownerName,
        },
        {
          name: '联系电话',
          value: detailInfo.ownerPhone,
        },
      ].concat(items);
    }
    const props = {
      items: todoType === '4' ? undefined : items,
      actions: [
        {
          customtype: 'select',
          title: todoType === '4' ? '通行证注销' : '车辆注销',
          onClick: () => this.deleteCar(detailInfo.carVillageId, todoType),
          loading: carLoading || carAuthLoading,
        },
        { customtype: 'second', title: '取消', onClick: this.onCancelDetailModel },
      ],
      info: detailInfo,
      visible: carDetailVisible,
      onCancel: this.onCancelDetailModel,
      title: '车辆详情',
      width: '50%',
      remark,
      customRender: () => {
        return (
          detailInfo &&
          detailInfo.map &&
          detailInfo.map(item => {
            return this.renderPermitItem(item);
          })
        );
      },
    };

    return <ModalDetail {...props} />;
  }

  renderPermitItem(item) {
    return (
      <div className={classNames(styles.permitItem)} key={item.id}>
        <div className={styles.top}>
          <Img type={'others'} image={passportImage} className={styles.icon} />
          <div className={styles.name}>{item.name}</div>
        </div>
        <div className={styles.bottom}>
          <div className={styles.row}>
            <AntdIcon type={'pm-position'} className={styles.icon} />
            <div className={styles.rowContent}>
              {item.passPositionList.map(v => v.passPositionName + '，')}
            </div>
          </div>
          <div className={styles.row}>
            <AntdIcon type={'clock-circle'} theme={'filled'} className={styles.icon} />
            <div className={styles.rowContent}>
              {item.authStartDate}~{item.authEndDate}
            </div>
          </div>
        </div>
      </div>
    );
  }
  renderDetail() {
    const { personDetailVisible, childrenDetailVisible, carDetailVisible } = this.state;
    return (
      (personDetailVisible && this.renderPersonDetailModal()) ||
      (childrenDetailVisible && this.renderChildrenDetailModal()) ||
      (carDetailVisible && this.renderCarDetailModal())
    );
  }

  onCancelOperatingResults = () => {
    this.setState({ operatingResultsVisible: false });
  };

  renderOperatingResults() {
    const { operatingResultsVisible, batchHandleResultsData } = this.state;
    const props = {
      visible: operatingResultsVisible,
      onCancel: this.onCancelOperatingResults,
      data: batchHandleResultsData,
    };
    return <OperatingResults {...props} />;
  }

  renderAuthInfo() {
    const { authInfo, authInfoVisible, authInfoType, authInfoPayload } = this.state;
    const props = {
      updateAuthInfo: () => this.updateAuthInfo(this.currentTodo),
      type: authInfoType,
      onCancel: this.onCancelDetailModel,
      authInfo: authInfo,
      visible: authInfoVisible,
      isTodo: true,
      licenceId: authInfoPayload.licenceId,
      handleTodo: this.handlePermitTodo,
      handleRecover: async () => {
        // const { dispatch } = this.props;
        // if (authInfoType === 'person') {
        //   await dispatch({ type: 'permit/recoverPersonPermit', data });
        // } else if (authInfoType === 'car') {
        //   await dispatch({ type: 'permit/recoverCarPermit', data });
        // }
        // await dispatch({ type: 'per' })
      },
    };
    return <AuthInfo {...props} />;
  }

  render() {
    return (
      <div className={classNames('height100', 'flexColStart')}>
        <PersonForm personSuccess={() => {}} ref={this.personFormRef} />
        <HouseholdModal ref={this.HouseholdRef} />
        {this.renderCard()}
        {this.renderTable()}
        {this.renderVehicleLicenseForm()}
        {this.renderAlarmForm()}
        {this.renderApplyForForm()}
        {this.renderDetail()}
        {this.renderAuthInfo()}
        <Confirm type={'warning'} ref={this.confirmRef} />
        <AddCarModal
          getList={() => {}}
          haveReGetList={false}
          modalVisible={this.state.addCarModalVisible}
          cancelModel={this.onCancelModel}
        />
        {this.renderOperatingResults()}
      </div>
    );
  }

  openPerson = () => {
    if (this.HouseholdRef.current) {
      this.HouseholdRef.current.open(value => {
        if (this.personFormRef.current) {
          if (value === 'owner') {
            this.personFormRef.current.open('add', EPersonType.owner);
          } else if (value === 'property') {
            this.personFormRef.current.open('add', EPersonType.property);
          } else if (value === 'child') {
            this.personFormRef.current.open('add', EPersonType.child);
          } else if (value === 'temp') {
            this.personFormRef.current.open('add', EPersonType.temp);
          }
        }
      });
    }
  };

  removePerson = () => {
    if (this.HouseholdRef.current) {
      this.HouseholdRef.current.open(value => {
        if (value === 'owner') {
          router.push('/dashboard/basicdata/person');
        } else if (value === 'property') {
          router.push('/dashboard/propertymgmt/personnel/property');
        } else if (value === 'temp') {
          router.push('/dashboard/propertymgmt/personnel/provisional');
        }
      }, 'personRemove');
    }
  };

  addCar = () => {
    this.setState({
      addCarModalVisible: true,
    });
  };

  onChangePage = (page: number) => {
    // this.setState({
    //   current: page,
    // });
    // const { dispatch } = this.props;
    // let searchInfo = this.state.searchQueryData;
    // searchInfo.page = page - 1;
    // dispatch({
    //   type: 'realModel/getCompanyList',
    //   payload: searchInfo,
    // });
  };

  onSearch = () => {
    themeColorClient.changeColor('dark');
  };

  addBuilding = () => {
    this.setState({
      add: true,
    });
  };

  addMultipleBuilding = () => {};

  onReset = () => {
    themeColorClient.changeColor('light');
    // themeColorClient.changeColor(Object.values(light));
  };

  modifyCheck = (record: any) => {
    switch (record.messageType) {
      case 2:
        this.setState({
          modifyVehicleLicense: true,
        });
        break;
      case 3:
        this.setState({
          modifyAlarmFor: true,
        });
        break;
      case 4:
        this.setState({
          modifyApplyFor: true,
        });
        break;
      default:
        break;
    }
  };

  onCancelModel = () => {
    this.setState({
      addCarModalVisible: false,
      modifyVehicleLicense: false,
      modifyAlarmFor: false,
      modifyApplyFor: false,
    });
  };

  onGetFormRef = (form: WrappedFormUtils) => {
    this.searchForm = form;
  };

  onChangeFile = info => {
    this.setState({
      fileList: info.fileList,
    });
  };

  pushRouter = (path: string) => {
    router.push(path);
  };

  onDatePickerChange = (date: moment.Moment, dateString: string) => {
    console.log('dateString: ', dateString);
    console.log('date: ', date);
  };

  onModelSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    this.modelForm.validateFields((err, fieldsValue) => {
      if (!err) {
        console.log('Received values of form: ', fieldsValue);
      }
    });
  };

  handlePermitTodo = async () => {
    const { authInfoPayload } = this.state;
    const { dispatch } = this.props;
    const data = await dispatch({ type: 'permit/deleteTodo', data: [authInfoPayload.todoId] });
    if (data && !data.error) {
      Message.success(SUCCESS_DONE);
    }
    this.onCancelDetailModel();
    dispatch({ type: 'home/getTodo', payload: {} });
  };

  async updateAuthInfo(record) {
    const { dispatch } = this.props;
    const { id, originId, todoType } = record;
    if (todoType === '5') {
      const authInfo = await dispatch({
        type: 'permit/getPersonAuthBaseInfo',
        data: { id: originId },
      });
      copyArrParam(authInfo.personTypeList, { type: 'key', value: 'typeStr' });
      this.setState({
        authInfo,
        todoType,
        authInfoType: 'person',
        authInfoVisible: true,
        authInfoPayload: { todoId: id, licenceId: originId },
      });
    } else if (todoType === '6') {
      const authInfo = await dispatch({
        type: 'permit/getCarAuthBaseInfo',
        data: { id: originId },
      });
      copyArrParam(authInfo.personTypeList, { type: 'key', value: 'typeStr' });
      this.setState({
        authInfo,
        todoType,
        authInfoType: 'car',
        authInfoVisible: true,
        authInfoPayload: { todoId: id, licenceId: originId },
      });
    }
  }

  // 查看待办事件
  DetailsCheck = async (record, e) => {
    if (e) {
      e.preventDefault();
    }
    this.currentTodo = record;
    const { id, originId, ext, todoType, remark } = record;
    const { dispatch } = this.props;
    let type = '';
    const payload: { [propName: string]: any } = {};
    if (todoType === '1') {
      type = 'home/getPersonTodoData';
      payload.id = originId;
      payload.type = ext;
      this.setState({
        personDetailVisible: true,
        personDeletePayload: { todoId: id, id: originId, type: ext } as any,
      });
    } else if (todoType === '2') {
      type = 'home/getchildrenDetail';
      payload.personId = originId;
      this.setState({ childrenDetailVisible: true, kidPayload: { todoId: id } });
    } else if (todoType === '3') {
      type = 'home/getCarDetail';
      payload.carId = originId;
      this.setState({
        carDetailVisible: true,
        todoType,
        carAuthPayload: { todoId: id, carId: originId },
      });
    } else if (todoType === '4') {
      type = 'home/getCarTodoData';
      payload.id = originId;
      this.setState({
        todoType,
        carDetailVisible: true,
        carAuthPayload: { todoId: id, id: originId },
      });
    } else if (todoType === '5') {
      payload.id = originId;
      const authInfo = await dispatch({ type: 'permit/getPersonAuthBaseInfo', data: payload });
      copyArrParam(authInfo.personTypeList, { type: 'key', value: 'typeStr' });
      this.setState({
        authInfo,
        todoType,
        authInfoType: 'person',
        authInfoVisible: true,
        authInfoPayload: { todoId: id, licenceId: originId },
      });
      return;
    } else if (todoType === '6') {
      payload.id = originId;
      const authInfo = await dispatch({ type: 'permit/getCarAuthBaseInfo', data: payload });
      copyArrParam(authInfo.personTypeList, { type: 'key', value: 'typeStr' });
      this.setState({
        authInfo,
        todoType,
        authInfoType: 'car',
        authInfoVisible: true,
        authInfoPayload: { todoId: id, licenceId: originId },
      });
      return;
    }
    this.setState({ remark });

    dispatch({
      type,
      payload,
    });
  };

  // 取消详情弹窗
  onCancelDetailModel = () => {
    this.setState({
      personDetailVisible: false,
      childrenDetailVisible: false,
      carDetailVisible: false,
      authInfoVisible: false,
    });
  };

  // 车辆
  deleteCar = (carVillageId, todoType) => {
    const { carAuthPayload } = this.state;
    if (todoType === '3') {
      if (this.confirmRef.current) {
        this.confirmRef.current.open(
          () => {
            this.deteleAndGetToDo('home/carDelete', {
              todoId: carAuthPayload.todoId,
              carId: carAuthPayload.carId,
              carVillageRefIds: carVillageId ? [carVillageId] : undefined,
            });
          },
          '注销车辆',
          '注销将删除车辆全部信息，是否确认删除？',
        );
      }
    } else {
      if (this.confirmRef.current) {
        this.confirmRef.current.open(
          () => this.deteleAndGetToDo('permit/recoverCarPermit', carAuthPayload),
          '回收车辆通行证',
          '回收将删除车辆通行证，是否确认回收？',
        );
      }
    }
  };

  // 人员-通行证回收
  deleteIcCard = personDeletePayload => {
    if (this.confirmRef.current) {
      this.confirmRef.current.open(
        async () => {
          const data = await this.props.dispatch({
            type: 'permit/recoverPersonPermit',
            data: personDeletePayload,
          });
          if (data && !data.error) {
            Message.success(SUCCESS_DONE);
            this.props.dispatch({ type: 'home/getTodo', payload: {} });
            this.onCancelDetailModel();
          } else {
            this.setState({
              operatingResultsVisible: true,
              batchHandleResultsData: data,
            });
          }
          // this.deteleAndGetToDo('home/deletePersonIcCard', personDeletePayload),
        },
        '回收通行证',
        '回收将删除通行证，是否确认回收？',
      );
    }
  };

  // 孩童注销
  deleteKid = subId => {
    const { kidPayload } = this.state;
    const payload = {
      subId,
      ...kidPayload,
    };
    if (this.confirmRef.current) {
      this.confirmRef.current.open(
        () => this.deteleAndGetToDo('home/deleteKid', payload),
        '注销孩童',
        '注销将删除孩童，是否确认删除？',
      );
    }
  };

  deteleAndGetToDo = (type, payload) => {
    const { dispatch } = this.props;
    dispatch({
      type,
      payload,
    }).then(res => {
      if (res.data) {
        const { error } = res.data;
        if (error === 1) {
          Message.error(res.data.message);
        } else if (error > 1) {
          this.setState({ operatingResultsVisible: true, batchHandleResultsData: res.data });
        } else if (!error) {
          Message.success(SUCCESS_WRITTEN_OFF);
        }
      }
      this.onCancelDetailModel();
      dispatch({ type: 'home/getTodo', payload: {} });
    });
  };
}

export default Home;
