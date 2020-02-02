import React, { PureComponent, RefObject, createRef } from 'react';
import styles from './index.less';
import { Row, Col } from 'antd';
import { Button, Confirm, OperatingResults } from '@/components/Library';
import classNames from 'classnames';
import AntdIcon from '@/components/Library/Icon';
import ParkingForm from '../ParkingForm';
import AssociateDevice from '../AssociateDevice';
import connect from '@/utils/decorators/connect';
import { GlobalState, DictionaryEnum } from '@/common/type';

export interface IParking {
  id: number;
  name: string;
  fee: string;
  feeStr: string;
  type: string;
  typeStr: string;
}
interface State {
  currentParking: number;
  parkingList: IParking[];
  currentParkingId: number;

  // formProps
  visible: boolean;
  title: string;
  modifyData: any;
  openType: 'add' | 'edit';

  // 关联设备属性
  associateVisible: boolean;
  addedDevices: any[];
  optionalDevices: any[];
  associateParkingData: IParking;
}

const mapStateToProps = ({ app }: GlobalState) => {
  return {
    parkingType: app.dictionry[DictionaryEnum.PARKING_TYPE] || [],
  };
};

@connect(
  mapStateToProps,
  null,
)
export default class ParkingList extends PureComponent<any, State> {
  confirmRef: RefObject<Confirm>;

  operateResultRef: RefObject<OperatingResults>;

  constructor(props) {
    super(props);
    this.confirmRef = createRef();
    this.operateResultRef = createRef();
    this.state = {
      optionalDevices: [],
      addedDevices: [],
      associateParkingData: {} as IParking,
      currentParking: 0,
      currentParkingId: 0,
      visible: false,
      modifyData: null,
      parkingList: [],
      title: '',
      openType: 'add',
      associateVisible: false,
    };
  }

  async componentDidMount() {
    await this.getList();
    const { currentParking, parkingList } = this.state;
    if (parkingList && parkingList.length) {
      this.sendSelectedParking(parkingList[currentParking]);
      this.setState({
        currentParkingId: parkingList[currentParking] ? parkingList[currentParking].id : 0,
      });
    }
  }

  renderParkingModal() {
    const {
      visible,
      modifyData,
      title,
      openType,
      associateVisible,
      addedDevices,
      associateParkingData,
      optionalDevices,
    } = this.state;
    const { dispatch } = this.props;
    return (
      <>
        <AssociateDevice
          bindingSuccess={record => this.getDeviceList(record)}
          dispatch={dispatch}
          addedDevice={addedDevices}
          parkingData={associateParkingData}
          onCancel={this.closeAssociateDevice}
          optionalDevices={optionalDevices}
          visible={associateVisible}
        />
        <ParkingForm
          modifyData={modifyData}
          onSubmit={record => this.parkingSuccess(record)}
          visible={visible}
          openType={openType}
          title={title}
          onCancel={this.closeForm}
        />
        <OperatingResults ref={this.operateResultRef} />
        <Confirm ref={this.confirmRef} />
      </>
    );
  }

  renderParkingItem(datum: IParking, index: number) {
    const { currentParking } = this.state;
    return (
      <div
        key={index}
        className={classNames(styles.item, currentParking === index ? styles.selectedItem : '')}
        onClick={() => this.parkingSelect(index)}
      >
        <div className={styles.itemTop}>
          <div>
            <div className={styles.name}>{datum.name}</div>
            <div className={styles.status}>
              <div
                className={classNames(
                  styles.point,
                  datum.fee === '0' ? styles.green : styles.orange,
                )}
              />
              <label>{datum.fee === '0' ? '免费' : '收费'}</label>
            </div>
          </div>
          <Col className={styles.type}>{datum.typeStr}</Col>
        </div>
        <Row className={styles.operate}>
          <Button
            customtype={'icon'}
            icon={'pm-edit'}
            title={'修改'}
            onClick={() => this.editParking(datum)}
          />
          {/* <Button
            customtype={'icon'}
            onClick={() => this.openAssociateDevice(datum)}
            icon={'pm-equipment'}
            title={'关联设备'}
          /> */}
          <Button
            customtype={'icon'}
            icon={'pm-trash-can'}
            title={'删除'}
            onClick={() => this.deleteParking(datum)}
          />
        </Row>
      </div>
    );
  }

  render() {
    const { parkingList } = this.state;
    return (
      <div className={styles.parkingList}>
        <div className={'listTitle'}>停车场列表</div>
        <div className={styles.list}>
          {parkingList.map((item, index) => this.renderParkingItem(item, index))}
          <Button type={'primary'} ghost className={styles.addParking} onClick={this.addParking}>
            <AntdIcon type={'pm-add'} />
            新增停车场
          </Button>
        </div>
        {this.renderParkingModal()}
      </div>
    );
  }

  getList = async () => {
    const data = await this.props.dispatch({ type: 'parking/getParkingList' });
    await new Promise(resolve => {
      this.setState(
        {
          parkingList: data || [],
        },
        resolve,
      );
    });
  };

  sendSelectedParking(record) {
    const { getParking } = this.props;
    if (getParking) {
      getParking(record);
    }
  }

  async parkingSuccess(record) {
    const { openType } = this.state;
    if (openType === 'add') {
      // this.openAssociateDevice(record);
      await this.getList();
      const { parkingList } = this.state;
      this.setState({
        currentParkingId: parkingList[0] ? parkingList[0].id : 0,
        currentParking: 0,
      });
      this.sendSelectedParking(parkingList[0]);
    } else {
      await this.getList();
    }

    const { currentParkingId } = this.state;
    const parkingIndex = this.state.parkingList.findIndex(item => +item.id === +currentParkingId);
    this.setState({
      currentParking: parkingIndex > -1 ? parkingIndex : 0,
    });
  }

  openAssociateDevice = async (record: IParking) => {
    await this.getDeviceList(record);
    const optionalDevices = await this.props.dispatch({ type: 'parking/getParkingOptionalDevice' });
    this.setState({
      associateVisible: true,
      associateParkingData: record,
      optionalDevices,
    });
  };

  async getDeviceList(record) {
    const data = await this.props.dispatch({
      type: 'parking/getParkingDeviceList',
      data: { id: record.id },
    });
    data.forEach((item, i) => {
      item.index = i + 1;
    });
    this.setState({
      addedDevices: data,
    });
  }
  closeAssociateDevice = () => {
    this.setState({
      associateVisible: false,
    });
  };

  parkingSelect = index => {
    this.setState({
      currentParking: index,
      currentParkingId: this.state.parkingList[index].id,
    });
    setTimeout(() => {
      this.sendSelectedParking(this.state.parkingList[index]);
    }, 300);
  };

  deleteParking(record) {
    if (this.confirmRef.current) {
      this.confirmRef.current.open(
        async () => {
          const data = await this.props.dispatch({
            type: 'parking/deleteParking',
            data: [record.id],
          });
          if (data.error && this.operateResultRef.current) {
            this.operateResultRef.current.open(data);
          } else {
            await this.getList();
            const { parkingList } = this.state;
            this.sendSelectedParking(parkingList[0]);
            this.setState({
              currentParkingId: parkingList[0] ? parkingList[0].id : 0,
              currentParking: 0,
            });
          }
        },
        '删除停车场',
        `确定要删除${record.name}停车场吗？`,
        'warning',
      );
    }
  }

  addParking = () => {
    this.setState({
      visible: true,
      modifyData: {
        fee: '0',
      },
      title: '新增停车场',
      openType: 'add',
    });
  };

  closeForm = () => {
    this.setState({
      visible: false,
    });
  };

  editParking = record => {
    this.setState({
      modifyData: record,
      visible: true,
      title: '编辑停车场',
      openType: 'edit',
    });
  };
}
