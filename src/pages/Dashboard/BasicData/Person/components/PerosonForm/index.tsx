import React, { PureComponent, RefObject, createRef } from 'react';
import { Modal, Tabs, Steps, Button, Icon, Message } from '@/components/Library';
import connect from '@/utils/decorators/connect';
import { GlobalState, DictionaryEnum } from '@/common/type';
import { PersonBaseInfo } from '@/models/person';
import styles from './index.less';
import CarFormInstance, { CarForm } from '../PersonFormCarForm';
import FormBodyInstance, { FormBody } from '../PersonFormBody';
import { SUCCESS_SETTING } from '@/utils/message';
import AuthForm from '../PersonFormAuthForm';
import AuthTimeFormInstance, { AuthTimeForm } from '../PersonFormAuthTimeForm';
import HouseSelectorForm from '../HouseSelectorForm';
import { CarBaseInfo } from '../../../Car/model';
import ParkingRegisterForm from '../../../Car/components/ParkingRegisterForm';

const mapStateToProps = (state: GlobalState) => {
  return {
    state,
    ButtonLoading: state.loading.effects['person/addPerson'],
    idCardReaderLoading: state.loading.effects['person/readIdCard'],
    addIcCardLoading: state.loading.effects['person/addIcCard'],
    addCarLoading: state.loading.effects['person/addCar'],
    addChildLoading: state.loading.effects['person/addChild'],
    icCardIssuedLoading: state.loading.effects['person/icCardIssued'],
    carIssuedLoading: state.loading.effects['person/updateCarAuthTime'],
    getHouseLoading: state.loading.effects['person/getHouse'],
    bindingParkingLoading: state.loading.effects['parkingGlobal/bindingParkingItemForCar'],
    carTypes: state.app.dictionry[DictionaryEnum.CAR_TYPE] || [],
    personTypes: state.app.dictionry[DictionaryEnum.HOUSEHOLD_PERSON_TYPE] || [],
    professionTypes: state.app.dictionry[DictionaryEnum.PROFESSION_TYPE] || [],
    doorAuthConfig: state.carGlobal.doorBanAuthSettingData,
    carAuthConfig: state.carGlobal.carBanAuthSettingData,
    parkingConfig: state.parkingGlobal.parkingConfig,
  };
};

export enum EPersonType {
  temp = 'temp',
  property = 'property',
  owner = 'owner',
  child = 'child',
}

enum EActiveKey {
  house = 'house',
  form = 'form',
  auth = 'auth',
  issuedAuth = 'issuedAuth',
  car = 'car',
  carParking = 'carParking',
  carAuth = 'carAuth',
}

interface PersonFormState {
  visible: boolean;
  title: string;
  isWard: boolean;
  currentStep: number;
  activeKey: EActiveKey;
  openType: 'add' | 'edit';
  isCarformTip: boolean;
  personType?: EPersonType;
  personId: string;
  personSourceType: string;
  houseData?: any;
  withoutGuardian: boolean;
  personData: PersonBaseInfo | null;
  carData: CarBaseInfo | null;
  forceRender: boolean;
  parkingData: any;

  // 全局配置
  doorAuth: boolean;
  faceCollect: boolean;
  IcCardCollecet: boolean;
  // doorAutoConfig: boolean;
  carAutoConfig: boolean;

  parkingEnabled: boolean;

  parkingName: string;
  parkingItemInfo: any;
  parkingId: string;
}

// ----------------------------表单弹出窗主体---------------------
@connect(
  mapStateToProps,
  null,
  null,
  { forwardRef: true },
)
class PersonForm extends PureComponent<any, PersonFormState> {
  formBodyRef: FormBody;

  carFromRef: CarForm;

  authFormRef: RefObject<AuthForm>;

  houseSeletor: RefObject<HouseSelectorForm>;

  authTimeFormRef: AuthTimeForm;

  carFormAuthRef: AuthTimeForm;

  carParkingRef: RefObject<ParkingRegisterForm>;

  personType: any[];

  occupationType: any[];

  editId: number;

  personData: PersonBaseInfo | null = null;

  constructor(props) {
    super(props);
    this.houseSeletor = createRef();
    this.authFormRef = createRef();
    this.carParkingRef = createRef();
    this.state = {
      activeKey: EActiveKey.house,
      visible: false,
      openType: 'add',
      title: '新增人员',
      isCarformTip: true,
      isWard: false,
      currentStep: 0,
      personType: undefined,
      parkingData: {},
      personId: '',
      personSourceType: '',
      houseData: undefined,
      withoutGuardian: false,
      personData: null,
      carData: null,
      forceRender: false,

      // 全局配置项
      doorAuth: true,
      faceCollect: true,
      IcCardCollecet: true,
      // doorAutoConfig: true,
      carAutoConfig: true,
      parkingEnabled: true,
      parkingName: '',
      parkingItemInfo: {},
      parkingId: '',
    };
  }

  async componentDidMount() {
    const { dispatch } = this.props;
    await Promise.all([
      dispatch({ type: 'app/getDic', payload: { type: DictionaryEnum.CAR_TYPE } }),
      this.getGlobalConfig(),
    ]);
  }

  async getGlobalConfig() {
    const { parkingConfig, dispatch } = this.props;
    const [doorConfig, carConfig] = await Promise.all([
      dispatch({ type: 'carGlobal/getDoorBanAuthSetting' }),
      dispatch({ type: 'carGlobal/getCarBanAuthSetting' }),
      dispatch({ type: 'parkingGlobal/getParkingSetting' }),
    ]);
    console.log(doorConfig, carConfig);
    const IcCardCollecet = doorConfig.passWay ? doorConfig.passWay.indexOf('2') > -1 : false;
    const faceCollect = doorConfig.passWay ? doorConfig.passWay.indexOf('1') > -1 : false;
    this.setState({
      doorAuth: !!doorConfig.authState,
      // doorAutoConfig: !!doorConfig.autoAuth,
      faceCollect,
      IcCardCollecet,
      carAutoConfig: carConfig.authState,
      parkingEnabled: parkingConfig.enabled,
    });
  }

  async open(type: 'add' | 'edit', personType: EPersonType, personData?: PersonBaseInfo) {
    if (!this.state.forceRender) {
      await new Promise(resolve => {
        this.setState(
          {
            forceRender: true,
            personData: personData || null,
          },
          resolve,
        );
      });
    }
    if (this.formBodyRef) {
      this.formBodyRef.reset();
    }
    if (this.authFormRef.current) {
      this.authFormRef.current.reset();
    }
    if (this.houseSeletor.current) {
      this.houseSeletor.current.reset();
    }
    if (this.carParkingRef.current) {
      this.carParkingRef.current.reset();
    }
    this.setState({ personType }, () => {
      if (this.carFromRef) {
        this.carFromRef.reset();
      }
    });
    const data: PersonBaseInfo | null = personData ? { ...personData } : null;
    this.personData = null;
    if (personData) {
      this.setState({ personData });
    }
    if (type === 'edit' && data) {
      data.personTypeMetaData = data.personType;
      data.personType = personType;
      await this.editForm(data, personType);
    } else if (type === 'add' && personType === EPersonType.child && data) {
      this.handleTitle(type, personType, EActiveKey.form);
      this.setState({ withoutGuardian: true });
      await this.childAddAtList(data);
    } else if (type === 'add' && personType === EPersonType.child && !data) {
      this.handleTitle(type, personType, EActiveKey.house);
    } else if (type === 'add' && personType === EPersonType.owner) {
      this.handleTitle(type, personType, EActiveKey.house);
    } else if (type === 'add' && personType === EPersonType.property) {
      this.handleTitle(type, personType, EActiveKey.form);
    } else if (type === 'add' && personType === EPersonType.temp) {
      this.handleTitle(type, personType, EActiveKey.form);
    }

    this.setState({
      openType: type,
      visible: true,
      isCarformTip: true,
      isWard: personType === 'child',
    });
  }

  async childAddAtList(personData: PersonBaseInfo) {
    const data = await this.props.dispatch({ type: 'person/getHouse', id: personData.houseId });
    const houseData = {
      unitId: personData.unitId,
      buildingId: personData.buildingId,
      ...data,
    };
    this.setState({
      activeKey: EActiveKey.form,
      houseData: houseData,
    });
    if (this.formBodyRef) {
      await this.formBodyRef.addChildren(personData);
    }
  }

  editForm = async (record: PersonBaseInfo, personType: EPersonType) => {
    this.handleTitle('edit', personType, EActiveKey.form);
    if (personType === EPersonType.owner || personType === EPersonType.child) {
      const data = await this.props.dispatch({ type: 'person/getHouse', id: record.houseId });
      this.setState({
        houseData: data,
      });
    }
    if (this.formBodyRef) {
      this.editId = +record.subId;
      this.personData = { ...record };
      this.formBodyRef.forceUpdate();
      await this.formBodyRef.modifyPerson(record);
    }
  };

  handleTitle(type: 'add' | 'edit', personType: EPersonType, activeKey: EActiveKey) {
    let result = '';
    if (type === 'add') {
      if (personType === EPersonType.child) {
        result = '孩童新增';
      } else if (personType === EPersonType.owner) {
        result = '住户新增';
      } else if (personType === EPersonType.temp) {
        result = '临时人员新增';
      } else if (personType === EPersonType.property) {
        result = '物业人员新增';
      }
    } else if (type === 'edit') {
      result = personType === 'child' ? '孩童修改' : '修改';
    } else if (type === 'auth') {
      result = '通行权限';
    } else if (type === 'issuedAuth') {
      result = '下发权限';
    } else if (type === 'car') {
      result = '车辆新增';
    }
    this.setState({
      currentStep: 0,
      title: result,
      activeKey,
      withoutGuardian: false,
    });
  }

  close = () => {
    this.setState({ visible: false });
  };

  preStep = () => {
    const { openType, activeKey, personType, withoutGuardian, personData } = this.state;
    let active = EActiveKey.house;
    if (
      (openType === 'add' && activeKey === EActiveKey.form && personType === EPersonType.owner) ||
      (!withoutGuardian && activeKey === EActiveKey.form && personType === EPersonType.child)
    ) {
      active = EActiveKey.house;
    } else if (activeKey === EActiveKey.issuedAuth && this.authFormRef.current) {
      active = EActiveKey.auth;
      if (personData) {
        this.authFormRef.current.setDefaultData(personData);
      }
    }
    this.setState({
      currentStep: this.state.currentStep - 1,
      activeKey: active,
    });
  };

  nextStep = (key: EActiveKey) => {
    console.log(key);
    const { currentStep } = this.state;
    // if (currentStep + 1 === 1 && this.personData) {
    //   activeKey = EActiveKey.auth;
    // } else if (currentStep + 1 === 2) {
    //   activeKey = EActiveKey.car;
    // }
    this.setState({
      currentStep: currentStep + 1,
      activeKey: key,
    });
  };

  carFormCanAdd = () => {
    this.setState({
      isCarformTip: false,
    });
  };

  skip = () => {
    const { activeKey } = this.state;
    if (activeKey === EActiveKey.auth || activeKey === EActiveKey.issuedAuth) {
      this.nextStep(EActiveKey.car);
    } else if (activeKey === EActiveKey.car) {
      this.close();
    }
    // this.nextStep();
  };

  removeParameter(obj: Object, name: string) {
    if (!obj[name]) {
      delete obj[name];
    }
  }

  // eslint-disable-next-line max-lines-per-function
  submit = async () => {
    const {
      personType,
      openType,
      activeKey,
      carAutoConfig,
      doorAuth,
      // doorAutoConfig,
      faceCollect,
      IcCardCollecet,
      parkingEnabled,
    } = this.state;
    const { personSuccess } = this.props;
    if (openType === 'add') {
      if (activeKey === 'house' && this.houseSeletor.current) {
        const houseOrPerosn: any = await this.houseSeletor.current.submit();
        if (!houseOrPerosn) {
          return;
        }
        console.log(houseOrPerosn);
        if (personType === EPersonType.child) {
          this.childAddAtList(houseOrPerosn);
        } else {
          this.setState({
            houseData: houseOrPerosn,
          });
        }
        this.nextStep(EActiveKey.form);
      } else if (activeKey === 'form') {
        const data: any = await this.formBodyRef.submit('add');
        if (data && personSuccess) {
          personSuccess();
          this.setState({
            personSourceType: data.type,
            personId: data.personId,
          });
          // if (personType === EPersonType.owner) {
          this.setState({ personData: data });
          // }
          this.personData = data;
          const hasDoorAuth = doorAuth ? faceCollect || IcCardCollecet : doorAuth;
          if (hasDoorAuth) {
            this.nextStep(EActiveKey.auth);
            if (this.authFormRef.current) {
              this.authFormRef.current.setDefaultData(data);
            }
          } else if (!hasDoorAuth && personType === EPersonType.child) {
            this.close();
          } else {
            if (this.carFromRef) {
              this.carFromRef.reset();
            }
            this.nextStep(EActiveKey.car);
          }
        }
      } else if (activeKey === 'auth') {
        if (this.authFormRef.current && this.personData) {
          try {
            const data = await this.authFormRef.current.submit(this.personData);
            if (data) {
              if (personSuccess) {
                personSuccess();
              }
              if (doorAuth && this.authTimeFormRef) {
                this.authTimeFormRef.setDefaultTime();
                this.nextStep(EActiveKey.issuedAuth);
              } else if (personType === EPersonType.child) {
                this.close();
              } else {
                this.carFromRef.reset();
                this.nextStep(EActiveKey.car);
              }
              Message.success(SUCCESS_SETTING);
            }
            if (this.carFromRef) {
              this.carFromRef.props.form.resetFields();
            }
          } catch (error) {}
        }
      } else if (activeKey === 'issuedAuth') {
        if (this.authTimeFormRef) {
          const data: any = await this.authTimeFormRef.submit();
          if (data && !data.error) {
            if (personSuccess) {
              personSuccess();
            }
            if (this.carFromRef) {
              this.carFromRef.reset();
            }
            if (personType === EPersonType.child) {
              this.close();
            } else {
              this.nextStep(EActiveKey.car);
            }
          }
        }
      } else if (activeKey === 'car') {
        if (this.personData) {
          try {
            const data: any = await this.carFromRef.submit(this.personData);
            if (data) {
              this.setState({
                carData: data,
              });
              if (parkingEnabled && this.carParkingRef.current) {
                this.carFormAuthRef.setDefaultTime();
                this.carParkingRef.current.reset();
                this.nextStep(EActiveKey.carParking);
              } else if (carAutoConfig && this.carFormAuthRef) {
                this.carFormAuthRef.setDefaultTime();
                this.nextStep(EActiveKey.carAuth);
              } else {
                this.close();
              }
            }
          } catch (error) {}
        }
      } else if (activeKey === 'carParking') {
        if (this.carParkingRef.current) {
          const data = await this.carParkingRef.current.submit();
          if (carAutoConfig) {
            this.setState({
              parkingData: data,
            });
            if (data && !data.error) {
              this.nextStep(EActiveKey.carAuth);
            }
          } else if (data && !data.error) {
            this.close();
          }
        }
      } else if (activeKey === 'carAuth') {
        if (this.carFormAuthRef) {
          const data: any = await this.carFormAuthRef.submit();
          if (data) {
            this.close();
          }
        }
      }
    } else if (openType === 'edit') {
      await this.formBodyRef.submit('edit');
      personSuccess();
      this.close();
    }
  };

  renderFooter() {
    const { activeKey, isCarformTip, personType } = this.state;
    const {
      ButtonLoading,
      addIcCardLoading,
      addCarLoading,
      icCardIssuedLoading,
      addChildLoading,
      bindingParkingLoading,
      carIssuedLoading,
      getHouseLoading,
    } = this.props;
    const showSkip = personType !== EPersonType.child && activeKey === EActiveKey.issuedAuth;
    return (
      <div className={styles.modalFooter}>
        <div>
          {activeKey === EActiveKey.issuedAuth ? (
            <Button customtype={'second'} onClick={this.preStep}>
              上一步
            </Button>
          ) : (
            ''
          )}
        </div>
        <div>
          {showSkip && (
            <Button customtype={'second'} onClick={this.skip}>
              跳过
            </Button>
          )}
          {isCarformTip && activeKey === 'car' ? (
            ''
          ) : (
            <Button
              customtype={'master'}
              onClick={this.submit}
              disabled={getHouseLoading}
              loading={
                ButtonLoading ||
                addIcCardLoading ||
                addCarLoading ||
                icCardIssuedLoading ||
                addChildLoading ||
                carIssuedLoading ||
                bindingParkingLoading
              }
            >
              {activeKey === EActiveKey.house ? '下一步' : '提交'}
            </Button>
          )}
          <Button customtype={'second'} onClick={this.close}>
            关闭
          </Button>
        </div>
      </div>
    );
  }

  renderLoading(loading: boolean) {
    return loading && <Icon className={styles.loading} type={'loading'} />;
  }

  // eslint-disable-next-line max-lines-per-function
  render() {
    const {
      activeKey,
      visible,
      title,
      currentStep,
      isWard,
      openType,
      personType,
      houseData,
      withoutGuardian,
      personData,
      doorAuth,
      forceRender,
      faceCollect,
      IcCardCollecet,
      // doorAutoConfig,
      carAutoConfig,
      parkingEnabled,
      carData,
    } = this.state;
    const {
      ButtonLoading,
      addIcCardLoading,
      addCarLoading,
      icCardIssuedLoading,
      addChildLoading,
      dispatch,
      buidingUnitHouse,
      carTypes,
      carIssuedLoading,
      bindingParkingLoading,
      getHouseLoading,
    } = this.props;
    const hasDoorAuth = doorAuth ? faceCollect || IcCardCollecet : doorAuth;
    return (
      <Modal
        visible={visible}
        title={title}
        width={'56%'}
        maskClosable={false}
        forceRender={forceRender}
        onCancel={this.close}
        footer={this.renderFooter()}
      >
        {openType === 'add' && (
          <Steps size={'small'} current={currentStep} className={styles.stepsFontColor}>
            {!withoutGuardian &&
              personType !== EPersonType.property &&
              personType !== EPersonType.temp && (
                <Steps.Step title={personType === EPersonType.child ? '监护人选择' : '房屋选择'} />
              )}
            <Steps.Step
              title={isWard ? '基本信息' : '基本信息'}
              icon={this.renderLoading(ButtonLoading || addChildLoading)}
            />
            {hasDoorAuth && (
              <Steps.Step title={'通行证'} icon={this.renderLoading(addIcCardLoading)} />
            )}
            {hasDoorAuth && (
              <Steps.Step title={'绑定通行证'} icon={this.renderLoading(icCardIssuedLoading)} />
            )}
            {!isWard && <Steps.Step title={'车辆信息'} icon={this.renderLoading(addCarLoading)} />}
            {!isWard && parkingEnabled && (
              <Steps.Step title={'车位登记'} icon={this.renderLoading(bindingParkingLoading)} />
            )}
            {!isWard && carAutoConfig && (
              <Steps.Step title={'车辆通行证'} icon={this.renderLoading(carIssuedLoading)} />
            )}
          </Steps>
        )}
        <Tabs hiddenTabButton defaultActiveKey={activeKey} activeKey={activeKey}>
          <Tabs.TabPane tab={'4'} key={'house'} forceRender>
            <HouseSelectorForm
              personType={personType}
              dispatch={dispatch}
              getHouseLoading={getHouseLoading}
              ref={this.houseSeletor}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab={'1'} key={'form'} forceRender>
            <FormBodyInstance
              perosnData={personData}
              personType={personType}
              houseData={houseData}
              buidingUnitHouse={buidingUnitHouse}
              openType={openType}
              isWard={isWard}
              wrappedComponentRef={ins => (this.formBodyRef = ins)}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab={'2'} key={'auth'} forceRender={openType === 'add'}>
            <AuthForm
              faceCollect={faceCollect}
              icCardCollecet={IcCardCollecet}
              personData={personData}
              ref={this.authFormRef}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab={'3'} key={'issuedAuth'} forceRender={openType === 'add'}>
            <AuthTimeFormInstance
              donotUpdateModal
              permitType={'person'}
              personData={personData}
              personType={personType}
              wrappedComponentRef={ins => (this.authTimeFormRef = ins)}
              dispatch={dispatch}
            />
          </Tabs.TabPane>
          {!isWard && (
            <Tabs.TabPane tab={'3'} key={'car'}>
              <CarFormInstance
                close={this.close}
                personData={personData}
                personType={personType}
                carTypes={carTypes}
                addCar={this.carFormCanAdd}
                dispatch={dispatch}
                wrappedComponentRef={ins => (this.carFromRef = ins)}
              />
            </Tabs.TabPane>
          )}
          {!isWard && (
            <Tabs.TabPane tab={'4'} key={'carParking'} forceRender={openType === 'add'}>
              <ParkingRegisterForm
                carId={carData ? carData.carId : ''}
                personId={carData ? carData.personId : ''}
                setParkingName={this.setParkingName}
                setParkingItemInfo={this.setParkingItemInfo}
                setParkingId={this.setParkingId}
                ref={this.carParkingRef}
              />
            </Tabs.TabPane>
          )}
          {!isWard && (
            <Tabs.TabPane tab={'5'} key={'carAuth'} forceRender={openType === 'add'}>
              <AuthTimeFormInstance
                donotUpdateModal
                carData={carData}
                permitType={'car'}
                personType={personType}
                wrappedComponentRef={ins => (this.carFormAuthRef = ins)}
                dispatch={dispatch}
              />
            </Tabs.TabPane>
          )}
        </Tabs>
      </Modal>
    );
  }
  setParkingId = parkingId => {
    this.setState({
      parkingId,
    });
  };

  setParkingName = parkingName => {
    this.setState({
      parkingName,
    });
  };

  setParkingItemInfo = parkingItemInfo => {
    this.setState({
      parkingItemInfo,
    });
  };
}

export default PersonForm;
