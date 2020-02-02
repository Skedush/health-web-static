import React, { PureComponent, RefObject, createRef } from 'react';
import {
  Modal,
  Button,
  SimplyTable,
  Message,
  OperatingResults,
  Img,
  Tabs,
  Badge,
  Confirm,
  Carousel,
} from '@/components/Library';
import { connect } from '@/utils/decorators';
import { GlobalState } from '@/common/type';
import styles from './index.less';
import { ISimplyColumn } from '@/components/Library/type';
import { IAuthData } from '@/models/passport';
import { SUCCESS_IMPOWER } from '@/utils/message';
import AntdIcon from '@/components/Library/Icon';
import AuthTimeFormInstance from '@/pages/Dashboard/BasicData/Person/components/PersonFormAuthTimeForm';
import { PersonBaseInfo } from '@/models/person';
import AuthTimeModalFormInstance, {
  AuthTimeFormModal,
} from '@/pages/Dashboard/BasicData/Person/components/PersonFormAuthFormModal';
import ReletModalInstance, {
  ReletModal,
} from '@/pages/Dashboard/BasicData/Person/components/ReletModal';
import classNames from 'classnames';

interface State {
  authData: IAuthData | null;
  visible: boolean;
  imgVisble: boolean;
  image: string;
  licenceId: string;
  permitTreeData: any[];
  faceCollect: boolean;
  icCardCollect: boolean;
  authState: boolean;
}

interface Props {
  authInfo: IAuthData;
  type: 'car' | 'person' | 'unchecked';
  onCancel: Function;
  visible: boolean;
  licenceId: string;
  updateAuthInfo: Function;
  updateAllAuth?: Function;
  isTodo?: boolean;
  handleTodo?: Function;
  handleRecover?: Function;
  deleteIcCard?: Function;
  [key: string]: any;
}

const mapStateToProps = (state: GlobalState) => {
  return {
    state,
    doorAuthConfig: state.carGlobal.doorBanAuthSettingData,
    parkingConfig: state.parkingGlobal.parkingConfig,
    authTimeloading: state.loading.effects['passport/passWayAllLicence'],
  };
};

@connect(
  mapStateToProps,
  null,
)
export default class AuthInfo extends PureComponent<Props, State> {
  static getDerivedStateFromProps(preProps: Props, preState: State) {
    return null;
  }

  operateRef: RefObject<OperatingResults>;

  confirmRef: RefObject<Confirm>;

  issuedAuthRef: AuthTimeFormModal;

  reletModalRef: ReletModal;

  carouselRef: Carousel | null;

  deviceTableColumns: ISimplyColumn[] = [
    { key: 'deviceName', name: '设备位置', span: 8 },
    {
      name: '有效期',
      span: 10,
      render(item) {
        return item.authStartDate.split(' ')[0] + '~' + item.authEndDate.split(' ')[0];
      },
    },
    {
      name: '设备状态',
      span: 6,
      render(item) {
        return (
          <div>
            {item.state === '1' ? <Badge status={'success'} /> : <Badge status={'error'} />}
            {item.stateStr}
          </div>
        );
      },
    },
  ];

  personPermitList: ISimplyColumn[] = [
    { key: 'id', type: 'key', name: '卡序号', span: 6 },
    { key: 'value', name: 'IC卡编号', span: 18 },
  ];

  personData: any;

  constructor(props) {
    super(props);
    this.confirmRef = createRef();
    this.operateRef = createRef();
    this.state = {
      authData: null,
      visible: false,
      licenceId: '',
      imgVisble: false,
      image: '',
      permitTreeData: [],
      faceCollect: false,
      icCardCollect: false,
      authState: false,
    };
  }

  componentDidMount() {
    this.getGlobalConfig();
    this.getList();
  }

  async getGlobalConfig() {
    const { doorAuthConfig, dispatch } = this.props;
    let doorConfig = doorAuthConfig;
    if (!doorAuthConfig) {
      const [doorResConig] = await Promise.all([
        dispatch({ type: 'person/getDoorBanAuthSetting' }),
      ]);
      doorConfig = doorResConig;
    }
    console.log(doorConfig);
    const icCardCollect = doorConfig.passWay ? doorConfig.passWay.indexOf('2') > -1 : false;
    const faceCollect = doorConfig.passWay ? doorConfig.passWay.indexOf('1') > -1 : false;
    this.setState({
      faceCollect,
      icCardCollect,
      authState: !(faceCollect || icCardCollect) ? false : doorConfig.authState,
    });
  }

  renderFooter() {
    const { isTodo, handleTodo, updateAllAuth } = this.props;
    return (
      <>
        {isTodo && (
          <div className={styles.todoButton}>
            <Button customtype={'master'} onClick={handleTodo as any}>
              已处理
            </Button>
            {/* <Button customtype={'second'} onClick={handleRecover as any}>
              回收通行证
            </Button> */}
          </div>
        )}
        <Button customtype={'second'} onClick={updateAllAuth ? this.closeAndUpdate : this.close}>
          {'关闭'}
        </Button>
      </>
    );
  }

  renderDeviceList() {
    const { authInfo, type } = this.props;
    const personDevicelist =
      authInfo && authInfo.personLicenseNoAuthList ? authInfo.personLicenseNoAuthList : [];
    const carList = authInfo && authInfo.deviceList ? authInfo.deviceList : [];
    const list = type === 'person' ? personDevicelist : carList;
    const disabledBtn =
      (authInfo.pmPassCardAuthList && !authInfo.pmPassCardAuthList.length) ||
      (authInfo.passCardList && !authInfo.passCardList.length);
    const operate = (
      <div className={styles.deviceOperate}>
        <div className={styles.operatePrompt}>
          <Button
            customtype={'icon'}
            icon={'sync'}
            disabled={disabledBtn}
            size={'small'}
            className={styles.syncIcon}
            onClick={this.updatePersonDeviceInfo}
          />
          更新设备授权信息
        </div>
        <Button
          customtype={'master'}
          disabled={disabledBtn}
          size={'small'}
          onClick={this.updatePersonDeviceInfo}
        >
          更新
        </Button>
      </div>
    );
    return (
      <SimplyTable
        columns={this.deviceTableColumns}
        dataSource={list}
        scrollH={280}
        headerSlot={operate}
        tableStyle={'noBorder'}
      />
    );
  }

  renderCarBasicInfo() {
    const { authInfo } = this.props;
    return (
      <div className={styles.carBaiscInfo}>
        <div className={styles.ICtitle}>
          <div className={styles.ICtitleLabel}>车辆信息</div>
          <div className={styles.carInfo}>
            <div className={styles.carNumber}>
              <label>{authInfo.licensePlate}</label>
              <label className={styles.carType}>{authInfo.typeStr}</label>
            </div>
            <div className={styles.carOwner}>
              <label className={styles.label}>
                <AntdIcon type={'pm-user'} />
              </label>
              {authInfo.name}
            </div>
            <div className={styles.carPhone}>
              <label className={styles.label}>
                <AntdIcon type={'phone'} />
              </label>
              {authInfo.phone}
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderParkingInfo() {
    const { authInfo } = this.props;
    const parkingList = authInfo.parkingLotCarList;
    const parkingTabs = (item, i, type) => (
      <div className={styles.parking} key={i}>
        <div className={styles.basicInfo}>
          <div className={styles.house}>{type}</div>
          <div className={styles.registerTime}>
            <label className={styles.label}>
              <AntdIcon type={'car'} />
              车位号
            </label>
            {item.code}
          </div>
          <div className={styles.registerTime}>
            <label className={styles.label}>
              <AntdIcon type={'clock-circle'} />
              有效期
            </label>
            {item.authStartDate}~{item.authEndDate}
          </div>
        </div>
      </div>
    );

    const renderTab = (item, index) => {
      return (
        <Tabs.TabPane tab={item.parkingLotName} key={index.toString()}>
          {item.parkingSpaceCarList.length > 1 && (
            <div className={styles.preButton} onClick={this.arrowLeft}>
              <AntdIcon type={'left'} />
            </div>
          )}
          <Carousel className={styles.carousel} ref={ins => (this.carouselRef = ins)} autoplay>
            {item.parkingSpaceCarList.map((v, i) => parkingTabs(v, i, item.parkingLotTypeStr))}
            {item.parkingLotType === '2' && parkingTabs({}, 0, item.parkingLotTypeStr)}
          </Carousel>
          {item.parkingSpaceCarList.length > 1 && (
            <div className={styles.nextButton} onClick={this.arrowRight}>
              <AntdIcon type={'right'} />
            </div>
          )}
        </Tabs.TabPane>
      );
    };

    return (
      <div className={styles.personBasicInfo}>
        <Tabs type={'card'} className={styles.tabs} animated>
          {parkingList.map((item, index) => {
            return renderTab(item, index);
          })}
        </Tabs>
      </div>
    );
  }

  renderIcCardInfo() {
    const { faceCollect, icCardCollect } = this.state;
    const { authInfo } = this.props;
    let list = authInfo && authInfo.pmPersonPassWayList ? authInfo.pmPersonPassWayList : [];
    const img = list.filter(item => item.passWayType === '1')[0];
    list = list.filter(item => item.passWayType === '2');
    const uncheckedDetail =
      authInfo && authInfo.personDetailList
        ? authInfo.personDetailList.find(item => item.type === '12')
        : null;
    return (
      <div className={styles.icCardInfo}>
        <AuthTimeModalFormInstance
          success={this.props.updateAuthInfo}
          hiddenFaceCollect={!!uncheckedDetail}
          wrappedComponentRef={ins => (this.issuedAuthRef = ins)}
        />
        {!uncheckedDetail && faceCollect && (
          <div className={classNames(styles.ICtitle)}>
            <div className={styles.ICtitleLabel}>人脸采集</div>
            <Img className={styles.pictrue} image={img ? img.value : ''} previewImg={true} />
            {!icCardCollect && (
              <div className={styles.modify} onClick={this.openIcCardInfo}>
                <AntdIcon type={'edit'} />
                修改
              </div>
            )}
          </div>
        )}
        {icCardCollect && (
          <SimplyTable
            columns={this.personPermitList}
            dataSource={list}
            headerSlot={
              !uncheckedDetail ? (
                <div className={styles.modify} onClick={this.openIcCardInfo}>
                  <AntdIcon type={'edit'} />
                  修改
                </div>
              ) : (
                <div className={styles.modify} onClick={this.recoverPermit}>
                  <AntdIcon type={'edit'} />
                  回收
                </div>
              )
            }
            scrollH={230}
            tableStyle={'small'}
          />
        )}
      </div>
    );
  }

  // eslint-disable-next-line max-lines-per-function
  renderPersonBasicInfo() {
    const householdTitle = '住户';
    const property = '物业人员';
    const provisional = '临时人员';
    const uncheckedTitle = '未认证人员';
    const { authInfo } = this.props;
    const { authState, icCardCollect } = this.state;
    const ownerDetail =
      authInfo && authInfo.personDetailList
        ? authInfo.personDetailList.find(item => item.type === 'PM22')
        : null;
    const propertyDetail =
      authInfo && authInfo.personDetailList
        ? authInfo.personDetailList.find(item => item.type === '4')
        : null;
    const provisionDetail =
      authInfo && authInfo.personDetailList
        ? authInfo.personDetailList.find(item => item.type === 'PM25')
        : null;
    const uncheckedDetail =
      authInfo && authInfo.personDetailList
        ? authInfo.personDetailList.find(item => item.type === '12')
        : null;
    const noIcCardClass = !icCardCollect ? styles.personBasicInfo3 : '';
    const renderInfoContent = (item: PersonBaseInfo, title: string) => {
      this.personData = item;
      return (
        <>
          <div
            className={classNames(
              styles.basicInfo,
              !icCardCollect ? styles.basicInfo3 : '',
              !authState ? styles.basicInfo2 : '',
            )}
          >
            <div className={styles.house}>
              {title === '住户' && item.buildingName + item.address}
              {/* {title === '物业人员' && item.positionStr}
              {title === '临时人员' && item.typeStr} */}
            </div>
            {title === '住户' && (
              <div className={styles.namePhone}>
                {/* <AntdIcon type={'pm-user'} /> */}
                户主：
                {item.houseName || '未登记'}
                {/* <AntdIcon type={'phone'} /> */}
                &emsp; 户主电话：
                {item.housePhone || '未登记'}
              </div>
            )}
            {title === '住户' && (
              <div className={styles.rentTime}>
                <label className={styles.label}>
                  <label className={styles.label}>租住时间</label>
                  {item.authorizeExpireTime && item.rentTime + ' ~'}
                  {item.authorizeExpireTime || '永久'}
                </label>
                {item.authorizeExpireTime && (
                  <label className={styles.reletButton} onClick={() => this.reletPerson(item)}>
                    <AntdIcon type={'pm-visitors'} />
                    续租
                  </label>
                )}
              </div>
            )}
            {title !== '住户' && (
              <div className={styles.registerTime}>
                <label>
                  <label className={styles.label}>
                    {title === '物业人员' ? '职位' : '人员类型'}
                  </label>
                  {title === '物业人员' ? item.positionStr : item.typeStr}
                </label>
                <label>
                  <label className={styles.label}>备注</label>
                  {item.remarks}
                </label>
              </div>
            )}
            <div className={styles.registerTime}>
              <label>
                <label className={styles.label}>登记电话</label>
                {item.phone || '未登记'}
              </label>
              <label>
                <label className={styles.label}>登记时间</label>
                {item.registerTime}
              </label>
            </div>
          </div>
        </>
      );
    };
    const renderTabs = (data, title) => {
      return data && data.detailList.length ? (
        <Tabs.TabPane tab={title} key={title}>
          {data.detailList.length > 1 && (
            <div className={styles.preButton} onClick={this.arrowLeft}>
              <AntdIcon type={'left'} />
            </div>
          )}

          <Carousel
            className={
              authState
                ? !icCardCollect
                  ? styles.carouselMode3
                  : styles.carousel
                : styles.carouselMode2
            }
            ref={ins => (this.carouselRef = ins)}
            autoplay
          >
            {data.detailList.map(item => {
              return renderInfoContent(item, title);
            })}
          </Carousel>
          {data.detailList.length > 1 && (
            <div className={styles.nextButton} onClick={this.arrowRight}>
              <AntdIcon type={'right'} />
            </div>
          )}
        </Tabs.TabPane>
      ) : (
        ''
      );
    };
    return (
      <div
        className={classNames(
          styles.personBasicInfo,
          noIcCardClass,
          !authState ? styles.personBasicInfo2 : '',
        )}
      >
        <Tabs type={'card'} animated>
          {renderTabs(ownerDetail, householdTitle)}
          {renderTabs(propertyDetail, property)}
          {renderTabs(provisionDetail, provisional)}
          {renderTabs(uncheckedDetail, uncheckedTitle)}
        </Tabs>
      </div>
    );
  }

  renderPermitListProps() {
    const { authInfo, licenceId } = this.props;
    const personData: any = { licenceId };
    const uncheckedDetail =
      authInfo && authInfo.personDetailList
        ? authInfo.personDetailList.find(item => item.type === '12')
        : null;
    return {
      permitType: 'person' as any,
      updateData: this.props.updateAuthInfo,
      dispatch: this.props.dispatch,
      personData: personData,
      authPermitList: authInfo.pmPassCardAuthList,
      tableStyle: 'vertical' as any,
      isUnchecked: !!uncheckedDetail,
      personTypes: authInfo.personTypeList,
    };
  }

  renderRight() {
    const { authInfo, type } = this.props;
    if (type === 'person') {
      return <AuthTimeFormInstance {...this.renderPermitListProps()} />;
    } else {
      return (
        <AuthTimeFormInstance
          permitType={'car'}
          updateData={this.props.updateAuthInfo}
          carData={authInfo as any}
          dispatch={this.props.dispatch}
          tableStyle={'vertical'}
          authPermitList={authInfo.passCardList}
        />
      );
    }
  }

  renderReletModal() {
    return (
      <ReletModalInstance
        reletSuccess={this.props.updateAuthInfo}
        wrappedComponentRef={ins => (this.reletModalRef = ins)}
      />
    );
  }

  renderTitleName() {
    const { authInfo } = this.props;
    const ownerDetail =
      authInfo && authInfo.personDetailList
        ? authInfo.personDetailList.find(item => item.detailList.length)
        : null;
    const personData = ownerDetail ? ownerDetail.detailList[0] : null;
    return (
      <div className={styles.title}>
        授权信息
        <label className={styles.titleName}>{personData ? `(${personData.name})` : ''}</label>
      </div>
    );
  }

  render() {
    const { authState } = this.state;
    const { visible, type, authInfo, parkingConfig } = this.props;
    const { personDetailList, parkingLotCarList } = authInfo;
    const showTopRight =
      !!(personDetailList && personDetailList.find(v => !!v && !!v.detailList.length)) ||
      !!(parkingLotCarList && parkingLotCarList.length);
    return (
      <Modal
        title={this.renderTitleName()}
        visible={visible}
        onCancel={this.close}
        footer={this.renderFooter()}
        destroyOnClose
        wrapClassName={styles.modalBody}
        width={'61%'}
      >
        <Confirm ref={this.confirmRef} />
        <OperatingResults ref={this.operateRef} />
        {this.renderReletModal()}
        <div className={styles.container}>
          <div className={styles.left}>
            <div className={styles.leftTop}>
              {((type === 'person' && authState) || (type === 'car' && parkingConfig.enabled)) && (
                <div className={styles.topLeft}>
                  {type === 'person' ? this.renderIcCardInfo() : this.renderCarBasicInfo()}
                </div>
              )}
              {showTopRight && authState && <div className={styles.emptyBlock} />}
              {showTopRight && (
                <div className={styles.topRight}>
                  {type === 'person' ? this.renderPersonBasicInfo() : this.renderParkingInfo()}
                </div>
              )}
            </div>
            <div className={styles.leftBottom}>{this.renderDeviceList()}</div>
          </div>
          <div className={styles.right}>{this.renderRight()}</div>
        </div>
      </Modal>
    );
  }

  updatePersonDeviceInfo = async () => {
    const { authInfo, type, licenceId } = this.props;
    const data = await this.props.dispatch({
      type: type === 'person' ? 'permit/updatePersonPermit' : 'permit/updateCarPermit',
      data: { id: type === 'person' ? licenceId : authInfo.carId },
    });
    if (data && data.error && this.operateRef.current) {
      this.operateRef.current.open(data);
    }
    this.props.updateAuthInfo();
  };

  async getList() {
    const { type } = this.props;
    const treeData = await this.props.dispatch({
      type: 'permit/getPositionList',
      data: { type: type === 'person' ? 1 : 0 },
    });
    this.setState({
      permitTreeData: treeData,
    });
  }

  closeAndUpdate = async () => {
    const { onCancel, updateAllAuth } = this.props;
    this.personData = null;
    if (onCancel) {
      onCancel();
    }
    if (updateAllAuth) {
      updateAllAuth();
    }
    // if (updateAuthInfo) {
    //   updateAuthInfo();
    // }
  };

  close = async () => {
    const { onCancel } = this.props;
    this.personData = null;
    if (onCancel) {
      onCancel();
    }
  };

  openIcCardInfo = () => {
    const {
      authInfo: { pmPassCardAuthList },
    } = this.props;
    if (this.issuedAuthRef) {
      const data = { ...this.personData, licenceId: this.props.licenceId };
      this.issuedAuthRef.open(data, pmPassCardAuthList);
    }
  };

  arrowLeft = () => {
    // const tabPane = document.querySelector('.ant-tabs-tabpane-active');
    // if (tabPane) {
    //   tabPane.scrollTo(tabPane.scrollLeft - 200, 0);
    // }
    if (this.carouselRef) {
      this.carouselRef.prev();
    }
  };

  arrowRight = () => {
    // const tabPane = document.querySelector('.ant-tabs-tabpane-active');

    // if (tabPane) {
    //   tabPane.scrollTo(tabPane.scrollLeft + 200, 0);
    // }
    if (this.carouselRef) {
      this.carouselRef.next();
    }
  };

  // tabChange() {

  // }

  openAuthTime = () => {
    this.setState({
      visible: true,
    });
  };

  closeAuthTime = () => {
    this.setState({
      visible: false,
    });
  };

  openImg = image => {
    console.log(image);
    this.setState({
      image,
      imgVisble: true,
    });
  };

  closeImg = () => {
    this.setState({
      imgVisble: false,
    });
  };

  recoverPermit = async () => {
    if (this.confirmRef.current) {
      this.confirmRef.current.open(
        () => {
          if (this.props.deleteIcCard) {
            this.props.deleteIcCard();
          }
          this.close();
        },
        '回收通行证',
        '确定要回收通行证吗？',
      );
    }
  };

  reletPerson(personData: PersonBaseInfo) {
    personData.subId = personData.id;
    this.reletModalRef.open(personData);
  }

  authTimeSubmit = (validateFields: Function) => {
    const { authInfo, updateAuthInfo } = this.props;
    validateFields(async (error, values) => {
      if (error) {
        return;
      }
      const { time } = values;
      const data = {
        licenceNo: authInfo ? authInfo.licenceDetailResp.licenceNo : '',
        rentTime: time[0].format('YYYY-MM-DD HH:mm:ss'),
        authorizeExpireTime: time[1].format('YYYY-MM-DD HH:mm:ss'),
      };
      const resData = await this.props.dispatch({ type: 'passport/passWayAllLicence', data });
      if (resData && !resData.error) {
        this.closeAuthTime();
        if (updateAuthInfo) {
          updateAuthInfo();
        }
        Message.success(SUCCESS_IMPOWER);
      } else if (resData && this.operateRef.current) {
        this.operateRef.current.open(resData);
      }
    });
  };

  submit = async () => {};
}
