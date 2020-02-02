import React, { PureComponent, Fragment, RefObject, createRef } from 'react';
import { WrappedFormUtils, ISimplyColumn } from '@/components/Library/type';
import {
  FormSimple,
  Modal,
  SimplyTable,
  Select,
  Col,
  Form,
  Button,
  ButtonGroup,
  Confirm,
  Message,
  Spin,
  OperatingResults,
} from '@/components/Library';
import { connect } from '@/utils/decorators';
import { GlobalState, UmiComponentProps } from '@/common/type';
import Navlink from 'umi/navlink';
import TransferParkingSpace from '../TransferParkingSpace';
import ParkingRenewalModal from '../ParkingRenewalModal';
import { SUCCESS_BINDING, SUCCESS_UNBINDING, SUCCESS_UPDATE } from '@/utils/message';
import { debounce } from 'lodash';
import classNames from 'classnames';
const FormItem = Form.Item;

const mapStateToProps = ({ parking, loading: { effects } }: GlobalState) => {
  return {
    parkingItemInfo: parking.parkingItemInfo,
    carList: parking.carList,
    loading: {
      getSelectCarListLoading: effects['parking/getSelectCarList'],
      getParkingItemByIdLoading: effects['parking/getParkingItemById'],
      getCarAreaLoading: effects['carGlobal/getCarArea'],
      resellParkingItemLoading: effects['parking/resellParkingItem'],
      getCarProvinceLoading: effects['carGlobal/getCarProvince'],
      unbindParkingItemPersonLoading: effects['parking/unbindParkingItemPerson'],
      unbindParkingForCarLoading: effects['parking/unbindParkingForCar'],
      bindingParkingItemForCarLoading: effects['parking/bindingParkingItemForCar'],
      renewParkingItemLoading: effects['parking/renewParkingItem'],
    },
  };
};

type ParkingItemDetailModalStateProps = ReturnType<typeof mapStateToProps>;

type ParkingItemDetailModalProps = UmiComponentProps &
  ParkingItemDetailModalStateProps & {
    cancelModel: Function;
    reGetList: Function;
    modalVisible: boolean;
    parkingSpaceId: string;
    // visible: boolean;
  };
interface ParkingItemDetailModalState {
  carPlate: any;
  transferParkingVisible: boolean;
  parkingRenewalModalVisible: boolean;
  haveSearchValue: boolean;
  operatingResultsVisible: boolean;
  batchHandleResultsData: {};
}

@connect(
  mapStateToProps,
  null,
)
class ParkingItemDetailModal extends PureComponent<any, ParkingItemDetailModalState> {
  modalForm: WrappedFormUtils;
  confirmRef: RefObject<Confirm> = createRef();
  debounce: any;

  constructor(props: Readonly<ParkingItemDetailModalProps>) {
    super(props);
    this.state = {
      carPlate: { province: '', area: '', carNumber: '' },
      transferParkingVisible: false,
      parkingRenewalModalVisible: false,
      haveSearchValue: false,
      operatingResultsVisible: false,
      batchHandleResultsData: {},
    };
  }

  componentDidMount() {
    this.props.dispatch({ type: 'carGlobal/getCarProvince', payload: {} });
  }

  // componentDidUpdate(preProps) {
  //   if (preProps.parkingSpaceId !== this.props.parkingSpaceId && this.props.modalVisible) {
  //     this.getParkingItemDetail();
  //   }
  // }

  renderNoCar() {
    return (
      <div className={classNames('flexColCenter', 'itemCenter')}>
        暂无该车辆
        <div>
          是否前往
          <Navlink to={'/dashboard/basicdata/car' || '#'}>
            <span>登记车辆</span>
          </Navlink>
        </div>
      </div>
    );
  }

  renderButtonGroup() {
    const { parkingItemInfo, loading } = this.props;
    const ButtonGroupProps = {
      actions: [
        {
          customtype: 'second',
          title: '车位转让',
          onClick: () => this.tansferParking(),
        },
        {
          customtype: 'second',
          title: '人员解绑',
          loading: loading.unbindParkingItemPersonLoading,
          onClick: this.unbindParkingItemPerson,
        },
      ],
      flexState: 'right' as 'right',
    };
    if (parkingItemInfo.saleState !== '2') {
      ButtonGroupProps.actions.unshift({
        customtype: 'master',
        title: '租转售',
        loading: this.props.loading.resellParkingItemLoading,
        onClick: this.parkingResell,
      });
      ButtonGroupProps.actions.unshift({
        customtype: 'select',
        title: '续期',
        loading: this.props.loading.renewParkingItemLoading,
        onClick: () => this.setState({ parkingRenewalModalVisible: true }),
      });
    }
    const sellButtonProps = {
      actions: [
        {
          customtype: 'master',
          title: '租售',
          onClick: () => this.props.sellParking(parkingItemInfo.id, parkingItemInfo.code),
        },
      ],
      flexState: 'right' as 'right',
    };
    return (
      <ButtonGroup {...(parkingItemInfo.saleState === '1' ? sellButtonProps : ButtonGroupProps)} />
    );
  }

  renderOperatingResults() {
    const { operatingResultsVisible, batchHandleResultsData } = this.state;
    const props = {
      visible: operatingResultsVisible,
      onCancel: this.onCancelOperatingResults,
      data: batchHandleResultsData,
    };
    return <OperatingResults {...props} />;
  }

  render() {
    const { parkingItemInfo, parkingSpaceId } = this.props;
    const { transferParkingVisible } = this.state;

    const columns: ISimplyColumn[] = [
      {
        span: 2,
        name: '车位号',
        key: 'code',
      },
      {
        span: 3,
        name: '租售类型',
        key: 'saleStateStr',
      },
      {
        span: 3,
        name: '联系人',
        key: 'name',
      },
      {
        span: 4,
        name: '联系电话',
        key: 'phone',
      },
      {
        span: 3,
        name: '状态',
        key: 'parkingStateStr',
      },
      {
        span: 3,
        name: '车位车辆',
        render(data) {
          return <div>{data.carCount + '/' + data.authCount}</div>;
        },
      },
      {
        span: 6,
        name: '租赁时间',
        render(data) {
          console.log('data: ', data);
          if (data.startTime === null) {
            return <div>未租售</div>;
          }
          return <div>{data.startTime + '~' + data.endTime}</div>;
        },
      },
    ];

    return (
      <Modal {...this.getParkingItemDetailModalProps()}>
        <SimplyTable columns={columns} dataSource={[parkingItemInfo]} />
        {parkingItemInfo.authCount > parkingItemInfo.carCount && (
          <Fragment>
            <FormSimple {...this.getParkingItemDetailFormProps()} />
            <div style={{ height: '25px' }} />
          </Fragment>
        )}
        {parkingItemInfo.carPerson && (
          <SimplyTable
            columns={this.getCarPersonColumns()}
            dataSource={parkingItemInfo.carPerson}
          />
        )}
        {/* {this.renderButtonGroup()} */}
        <ParkingRenewalModal
          reGetList={this.props.reGetList}
          cancelModal={this.cancelModal}
          modalVisible={this.state.parkingRenewalModalVisible}
          timeLine={[parkingItemInfo.startTime, parkingItemInfo.endTime]}
          parkingSpaceId={this.props.parkingSpaceId}
          getParkingItemDetail={this.getParkingItemDetail}
        />
        <Confirm type={'warning'} ref={this.confirmRef} />
        <TransferParkingSpace
          onCancel={this.closeTransferParking}
          parkingSpaceId={parkingSpaceId}
          success={this.getParkingItemDetail}
          visible={transferParkingVisible}
        />
        {this.renderOperatingResults()}
      </Modal>
    );
  }

  onCancelOperatingResults = () => {
    this.setState({ operatingResultsVisible: false });
  };

  cancelModal = () => {
    this.setState({ parkingRenewalModalVisible: false });
  };

  getCarPersonColumns = () => {
    return [
      {
        span: 3,
        name: '车牌号',
        key: 'licensePlate',
      },
      {
        span: 3,
        name: '关联人员',
        key: 'ownerName',
      },
      {
        span: 3,
        name: '联系电话',
        key: 'ownerPhone',
      },
      {
        span: 3,
        name: '品牌',
        key: 'brand',
      },
      {
        span: 2,
        name: '车型',
        key: 'spec',
      },
      {
        span: 2,
        name: '颜色',
        key: 'color',
      },
      {
        span: 3,
        name: '车辆类型',
        key: 'typeStr',
      },
      {
        span: 5,
        name: '操作',
        render: data => {
          return (
            <Button
              customtype={'icon'}
              onClick={() => this.unbindCar(data.parkingSpaceCarId)}
              icon={'pm-delete'}
              loading={this.props.loading.unbindParkingForCarLoading}
              title={'解绑'}
            >
              解绑
            </Button>
          );
        },
      },
    ];
  };

  getParkingItemDetailModalProps = () => {
    return {
      onCancel: () => {
        this.setState({
          carPlate: { province: '', area: '', carNumber: '' },
        });
        this.props.cancelModel();
      },
      visible: this.props.modalVisible,
      title: '车位详情',
      destroyOnClose: true,
      centered: true,
      footer: null,
      maskClosable: true,
      bodyStyle: {},
      width: '65%',
      wrapClassName: 'modal',
    };
  };

  unbindCar = parkingSpaceCarId => {
    if (this.confirmRef.current) {
      const { dispatch } = this.props;
      this.confirmRef.current.open(
        async () => {
          const res = await dispatch({
            type: 'parking/unbindParkingForCar',
            payload: { parkingSpaceCarId },
          });
          if (res && res.success) {
            Message.success(SUCCESS_UNBINDING);
            this.getParkingItemDetail();
          }
        },
        '请注意',
        '是否解绑该车辆？',
      );
    }
  };

  parkingResell = () => {
    if (this.confirmRef.current) {
      const { dispatch, parkingSpaceId } = this.props;
      this.confirmRef.current.open(
        async () => {
          const res = await dispatch({
            type: 'parking/resellParkingItem',
            payload: { parkingSpaceId },
          });
          if (res && res.success) {
            Message.success(SUCCESS_UPDATE);
            this.getParkingItemDetail();
            this.props.reGetList();
          }
        },
        '请注意',
        '是否确认车位变更为已售？',
      );
    }
  };

  getParkingItemDetailFormProps = () => {
    return {
      items: [this.getCarPlateItem()],
      action: [],
      onSubmit: this.onParkingItemDetailSubmit,
      onGetFormRef: this.onGetFormRef,
    };
  };

  onGetFormRef = form => {
    this.modalForm = form;
  };

  getParkingItemDetail = () => {
    const { dispatch, parkingSpaceId } = this.props;
    dispatch({ type: 'parking/getParkingItemById', payload: { id: parkingSpaceId } });
  };

  closeTransferParking = () => {
    this.setState({
      transferParkingVisible: false,
    });
  };

  tansferParking = () => {
    const { parkingSpaceId } = this.props;
    this.setState({
      transferParkingVisible: true,
    });
    console.log(parkingSpaceId);
  };

  // eslint-disable-next-line max-lines-per-function
  getCarPlateItem = () => {
    const { carList = [], loading } = this.props;
    const { haveSearchValue } = this.state;
    const carListOption = carList.map((item, index) => {
      return (
        <Select.Option key={item.carId} value={item.carId}>
          {item.licensePlate}
        </Select.Option>
      );
    });
    return {
      type: 'custom',
      field: 'ownerName',
      span: 16,
      render: getFieldDecorator => {
        return (
          <Fragment>
            <Col span={8}>
              <FormItem label={'车牌号'}>
                {getFieldDecorator('carNumber', {
                  // initialValue: carPlate.carNumber,
                  rules: [{ required: true, message: '请选择车牌！' }],
                })(
                  <Select
                    placeholder={'车牌'}
                    onSearch={this.onSelectSearch}
                    notFoundContent={
                      loading.getSelectCarListLoading ? (
                        <Spin size={'small'} />
                      ) : haveSearchValue ? (
                        this.renderNoCar()
                      ) : null
                    }
                  >
                    {carListOption}
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label={''} style={{ marginTop: '40px' }}>
                <Button
                  customtype={'master'}
                  htmlType={'submit'}
                  loading={loading.bindingParkingItemForCarLoading}
                >
                  添加
                </Button>
              </FormItem>
            </Col>
          </Fragment>
        );
      },
    };
  };

  unbindParkingItemPerson = () => {
    if (this.confirmRef.current) {
      const { dispatch, parkingSpaceId } = this.props;
      this.confirmRef.current.open(
        async () => {
          const res = await dispatch({
            type: 'parking/unbindParkingItemPerson',
            payload: { parkingSpaceId },
          });
          if (res && res.success) {
            Message.success(SUCCESS_UNBINDING);
            this.props.reGetList();
            this.props.cancelModel();
          }
        },
        '请注意',
        '是否确认解绑人员？',
      );
    }
  };

  onSelectSearch = value => {
    if (this.debounce) {
      this.debounce.cancel();
    }
    if (value) {
      this.debounce = debounce(() => {
        this.setState({
          haveSearchValue: true,
        });
        this.getCarList({ licensePlate: value });
      }, 300);
      this.debounce();
    } else {
      this.setState({
        haveSearchValue: false,
      });
      this.props.dispatch({
        type: 'parking/updateState',
        payload: {
          carList: [],
        },
      });
    }
  };
  getCarList = payload => {
    this.props.dispatch({
      type: 'parking/getSelectCarList',
      payload,
    });
  };

  onParkingItemDetailSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (e) {
      e.preventDefault();
    }
    this.modalForm.validateFields(async (err, fieldsValue) => {
      if (err) return;
      const { dispatch, parkingSpaceId, carList } = this.props;
      const carId = fieldsValue.carNumber;
      const carItem = carList.find(item => item.carId === carId);
      const res = await dispatch({
        type: 'parking/bindingParkingItemForCar',
        payload: { parkingSpaceId, carId: carId, personId: carItem.personId },
      });
      if (res && res.success) {
        Message.success(SUCCESS_BINDING);
        this.getParkingItemDetail();
        this.props.reGetList();
      }
      if (res && res.success && res.data && res.data.error > 0) {
        this.setState({
          operatingResultsVisible: true,
          batchHandleResultsData: res.data,
        });
      }
    });
  };
}
export default ParkingItemDetailModal;
