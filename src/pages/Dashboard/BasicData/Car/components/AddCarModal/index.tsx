import React, { PureComponent, Fragment } from 'react';
import { connect } from '@/utils/decorators';
import { Modal, Tabs, Steps, Spin } from '@/components/Library';
import { FormComponentProps } from '@/components/Library/type';
import PersonTableModal from '@/pages/Dashboard/BasicData/Car/components/PerosnTable';
import { GlobalState, UmiComponentProps, DictionaryEnum } from '@/common/type';
import { CarBaseInfo } from '../../model';
import styles from './index.less';
import CarTypeFormModal from '../CarTypeFormModal';
import CarInfoForm from '../CarInfoForm';
import ParkingRegisterForm from '../ParkingRegisterForm';
import AuthTimeFormInstance from '../../../Person/components/PersonFormAuthTimeForm';

const { TabPane } = Tabs;

let steps = ['人员选择', '车辆信息', '车位登记', '车辆授权'];
const mapStateToProps = (state: GlobalState) => {
  return {
    state,
    carTypes: state.app.dictionry[DictionaryEnum.CAR_TYPE] || [],
    personTableData: state.carGlobal.personTableData,
    loading: {
      authCarUpdate: state.loading.effects['carGlobal/updateAuthCar'],
      addCarLoading: state.loading.effects['carGlobal/addCar'],
    },
    defaultAuthTime: state.carGlobal.defaultAuthTime,
    carBanAuthSettingData: state.carGlobal.carBanAuthSettingData,
    parkingConfig: state.parkingGlobal.parkingConfig,
  };
};

type AddCarModalStateProps = ReturnType<typeof mapStateToProps>;
type AddCarModalProps = AddCarModalStateProps &
  UmiComponentProps &
  FormComponentProps & {
    getList: Function;
    haveReGetList: boolean;
    modalVisible: boolean;
    cancelModel: Function;
  };

interface AddCarModalState {
  registerCarVisible: boolean;
  modifyData: CarBaseInfo;
  tabsActiveKey: string;
  carType: string;
  carId: string;
  personId: string;
  selectedRow: any[];
  parkingId: string;
  owner: any;
  parkingName: string;
  parkingItemInfo: any;
}

@connect(
  mapStateToProps,
  null,
)
class AddCarModal extends PureComponent<any, AddCarModalState> {
  constructor(props: Readonly<AddCarModalProps>) {
    super(props);
    this.state = {
      registerCarVisible: false,
      tabsActiveKey: '1',
      selectedRow: [],
      modifyData: {} as CarBaseInfo,
      owner: { name: null, phone: null, id: null },
      parkingItemInfo: {},
      carType: '',
      parkingId: '',
      carId: '',
      personId: '',
      parkingName: '',
    };
  }

  componentDidMount() {
    this.props.dispatch({ type: 'parkingGlobal/getParkingSetting' });
  }

  render() {
    steps = ['人员选择', '车辆信息', '车位登记', '车辆通行证下发'];
    const { carBanAuthSettingData, loading, parkingConfig } = this.props;
    const len = steps.length;
    for (let i = len; i > 0; i--) {
      if (!parkingConfig.enabled && steps[i] === '车位登记') {
        steps.splice(i, 1);
        continue;
      }
      if (!carBanAuthSettingData.authState && steps[i] === '车辆通行证下发') {
        steps.splice(i, 1);
      }
    }
    return (
      <Fragment>
        <Modal {...this.getModalProps()}>
          <Steps current={parseInt(this.state.tabsActiveKey) - 1} size={'small'}>
            {steps.map(item => (
              <Steps.Step key={item} title={item} />
            ))}
          </Steps>
          <Tabs hiddenTabButton={true} activeKey={this.state.tabsActiveKey}>
            <TabPane tab={steps[0]} key={'1'}>
              <PersonTableModal {...this.getPersonTableProps()} />
            </TabPane>
            <TabPane tab={steps[1]} key={'2'}>
              <Spin spinning={!!loading.addCarLoading}>
                <CarInfoForm
                  onFormNext={this.onFormNext}
                  onFormPre={this.onFormPre}
                  onCancelModel={this.onCancelModel}
                  carType={this.state.carType}
                  getList={this.props.getList}
                  haveReGetList={this.props.haveReGetList}
                  owner={this.state.owner}
                  setCarId={this.setCarId}
                />
              </Spin>
            </TabPane>
            {parkingConfig.enabled && (
              <TabPane tab={steps[2]} key={'3'}>
                <Spin spinning={!!loading.addCarLoading}>
                  <ParkingRegisterForm
                    setParkingId={this.setParkingId}
                    onFormNext={this.onFormNext}
                    onCancelModel={this.onCancelModel}
                    carId={this.state.carId}
                    personId={this.state.personId}
                    setParkingName={this.setParkingName}
                    setParkingItemInfo={this.setParkingItemInfo}
                  />
                </Spin>
              </TabPane>
            )}
            {carBanAuthSettingData.authState && (
              <TabPane tab={steps[3]} key={parkingConfig.enabled ? '4' : '3'}>
                <Spin spinning={!!loading.authCarUpdate}>
                  <AuthTimeFormInstance
                    permitType={'car'}
                    donotUpdateModal
                    inTheCarForm
                    carData={{ carId: this.state.carId, type: this.state.carType } as any}
                    dispatch={this.props.dispatch}
                    onCancelModel={this.onCancelModel}
                  />
                </Spin>
              </TabPane>
            )}
          </Tabs>
        </Modal>
        <CarTypeFormModal
          cancelModel={this.props.cancelModel}
          modalVisible={this.props.modalVisible}
          submitForm={this.submitCarTypeForm}
        />
      </Fragment>
    );
  }

  setParkingName = name => {
    this.setState({
      parkingName: name,
    });
  };

  setParkingItemInfo = parkingItemInfo => {
    this.setState({
      parkingItemInfo,
    });
  };

  setCarId = carData => {
    this.setState({
      carId: carData.carId,
      personId: carData.personId,
    });
  };

  submitCarTypeForm = (data, callBack) => {
    this.setState(
      {
        ...this.state,
        ...data,
      },
      callBack,
    );
  };

  setParkingId = parkingId => {
    this.setState({
      parkingId,
    });
  };

  // 人员表格props
  getPersonTableProps = () => ({
    carType: this.state.carType,
    setPersonData: owner => {
      this.setState({
        owner,
      });
    },
    onFormNext: this.onFormNext,
  });

  getModalProps = () => {
    return {
      onCancel: this.onCancelModel,
      visible: this.state.registerCarVisible,
      title: steps[parseInt(this.state.tabsActiveKey) - 1],
      destroyOnClose: true,
      centered: true,
      footer: null,
      maskClosable: false,
      bodyStyle: {},
      width: '50%',
      wrapClassName: styles.model,
    };
  };

  onFormNext = () => {
    this.setState({
      tabsActiveKey: (parseInt(this.state.tabsActiveKey) + 1).toString(),
    });
  };

  onFormPre = () => {
    this.setState({
      tabsActiveKey: (parseInt(this.state.tabsActiveKey) - 1).toString(),
    });
  };

  onCancelModel = () => {
    this.setState({
      tabsActiveKey: '1',
      registerCarVisible: false,
    });
  };
}
export default AddCarModal;
