import React, { PureComponent, RefObject, createRef, Fragment } from 'react';
// import styles from './index.less';
import { connect } from '@/utils/decorators';
// import classNames from 'classnames';
import { LETTER } from '@/utils/constant';
import { WrappedFormUtils } from '@/components/Library/type';
import { GlobalState, UmiComponentProps, DictionaryEnum } from '@/common/type';
import styles from './index.less';
import chargeParking from '@/assets/images/chargeParking.png';
import freeParking from '@/assets/images/freeParking.png';
import tik from '@/assets/images/tik.png';
import cars from '@/assets/images/cars.png';

import classNames from 'classnames';
import {
  Confirm,
  OperatingResults,
  Button,
  Img,
  Icon,
  Modal,
  FormSimple,
  Steps,
  Tabs,
  Col,
  Select,
} from '@/components/Library';
import StepTitle from '../StepTitle';
import FormItem from 'antd/lib/form/FormItem';
const { TabPane } = Tabs;

const mapStateToProps = ({ parkingGlobal, app }: GlobalState) => {
  return {
    parkingList: parkingGlobal.parkingList,
    parkingDetail: parkingGlobal.parkingDetail,
    parkingType: app.dictionry[DictionaryEnum.PARKING_TYPE],
    parkingHasCharge: app.dictionry[DictionaryEnum.PARKING_HAS_CHARGE],
  };
};

type ParkingLotItemConfigStateProps = ReturnType<typeof mapStateToProps>;
type ParkingLotItemConfigProps = ParkingLotItemConfigStateProps &
  UmiComponentProps & { onFormNext: Function; onStepNext: Function };

interface ParkingLotItemConfigState {
  add: boolean;
  modify: boolean;
  parkingLotId: number;
  tabsActiveKey: string;
  batchHandleResultsData: any;
  operatingResultsVisible: boolean;
  isPublicParking: boolean;
}

interface KeyValue<K, V> {
  key: K;
  value: V;
}

@connect(
  mapStateToProps,
  null,
)
class ParkingLotItemConfig extends PureComponent<any, ParkingLotItemConfigState> {
  parkingItemForm: WrappedFormUtils;
  parkingForm: WrappedFormUtils;
  carCountList: KeyValue<number, number>[] = Array(200)
    .fill(0)
    .map((v, index) => ({ key: index + 1, value: index + 1 }));
  confirmRef: RefObject<Confirm> = createRef();
  constructor(props: Readonly<ParkingLotItemConfigProps>) {
    super(props);
    this.state = {
      add: false,
      parkingLotId: 0,
      isPublicParking: false,
      modify: false,
      tabsActiveKey: '1',
      batchHandleResultsData: {},
      operatingResultsVisible: false,
    };
  }

  componentDidMount() {
    this.getParkingList();
    this.props.dispatch({
      type: 'app/getDic',
      payload: {
        type: [DictionaryEnum.PARKING_TYPE, DictionaryEnum.PARKING_HAS_CHARGE].toString(),
      },
    });
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

  renderButton() {
    const ButtonProps = { customtype: 'main', onClick: this.submit };
    return (
      <div className={classNames(styles.bottomButton, 'flexCenter', 'itemCenter')}>
        <Button {...ButtonProps}>下一步</Button>
      </div>
    );
  }

  // eslint-disable-next-line max-lines-per-function
  renderModal() {
    const steps = ['添加停车场', '添加车位'];
    const { add, modify, isPublicParking } = this.state;
    const { parkingType, parkingHasCharge } = this.props;
    let { parkingDetail } = this.props;
    if (add) parkingDetail = {};
    const modalProps = {
      onCancel: this.cancelModel,
      visible: add || modify,
      title: steps[parseInt(this.state.tabsActiveKey) - 1],
      destroyOnClose: true,
      centered: true,
      footer: null,
      maskClosable: false,
      bodyStyle: {},
      width: '50%',
      wrapClassName: 'modal',
    };

    let parkingFormItems: any = [
      {
        type: 'input',
        field: 'name',
        span: 12,
        initialValue: parkingDetail.name,
        placeholder: '停车场名称',
        rules: [{ required: true, message: '停车场名称不能为空！' }],
      },
      {
        type: 'select',
        field: 'fee',
        initialValue: parkingDetail.fee || '0',
        disabled: true,
        span: 12,
        children: parkingHasCharge,
        placeholder: '是否收费',
        rules: [{ required: true, message: '请选择收费类型！' }],
      },
    ];
    if (add) {
      parkingFormItems = parkingFormItems.concat([
        {
          type: 'select',
          field: 'type',
          initialValue: parkingDetail.type,
          span: 12,
          children: parkingType,
          onChange: this.onParkingTypeChange,
          placeholder: '停车场类型',
          rules: [{ required: true, message: '请选择停车场类型！' }],
        },
      ]);
    }
    const parkingFormProps = {
      items: parkingFormItems,
      actions: [
        { customtype: 'second', title: '取消', onClick: this.cancelModel },
        {
          customtype: 'select',
          title: add ? (isPublicParking ? '完成' : '下一步') : '完成',
          htmlType: 'submit' as 'submit',
        },
      ],
      onSubmit: this.onParkingFormSubmit,
      onGetFormRef: (modelForm: WrappedFormUtils) => {
        this.parkingForm = modelForm;
      },
    };

    const parkingItemFormProps = {
      items: [
        {
          type: 'label',
          value: 'A-001',
          span: 24,
          placeholder: '车位号实例',
        },
        this.getRegionItem(),
        {
          type: 'select',
          field: 'count',
          span: 12,
          initialValue: 1,
          children: this.carCountList,
          placeholder: '新增数量',
          rules: [{ required: true, message: '请选择新增数量！' }],
        },
      ],
      actions: [
        { customtype: 'second', title: '取消', onClick: this.cancelModel },
        {
          customtype: 'select',
          title: '完成',
          htmlType: 'submit' as 'submit',
        },
      ],
      onSubmit: this.onParkingItemFormSubmit,
      onGetFormRef: (modelForm: WrappedFormUtils) => {
        this.parkingItemForm = modelForm;
      },
    };
    return (
      <Modal {...modalProps}>
        {add && (
          <Steps current={parseInt(this.state.tabsActiveKey) - 1} size={'small'}>
            {steps.map(item => (
              <Steps.Step key={item} title={item} />
            ))}
          </Steps>
        )}
        <Tabs hiddenTabButton={true} activeKey={this.state.tabsActiveKey}>
          <TabPane tab={steps[0]} key={'1'}>
            <FormSimple {...parkingFormProps} />
          </TabPane>
          <TabPane tab={steps[1]} key={'2'}>
            <FormSimple {...parkingItemFormProps} />
          </TabPane>
        </Tabs>
      </Modal>
    );
  }

  renderList() {
    const { parkingList } = this.props;
    return (
      <div className={classNames(styles.list, 'flexColStart')}>
        <div className={classNames('flexStart', 'flexWrap')}>
          {parkingList.map(item => (
            <div
              key={item.id}
              className={classNames(styles.itemNormal, styles.item, 'flexColBetween')}
            >
              <div className={classNames('flexStart', 'itemCenter')}>
                <Img
                  className={styles.icon}
                  image={item.fee === '1' ? chargeParking : freeParking}
                />
                <div className={styles.title}>{item.name}</div>
              </div>
              <div className={classNames('flexStart', 'itemCenter')}>
                <Img className={styles.iconS} image={cars} />
                <div>{item.typeStr}</div>
              </div>
              <div className={classNames('flexBetween', 'itemCenter')}>
                <div className={classNames('flexStart', 'itemCenter')}>
                  <Img className={styles.iconS} image={tik} />
                  <div>{item.feeStr}</div>
                </div>
                <div className={classNames('flexEnd')}>
                  <Button
                    customtype={'icon'}
                    icon={'pm-edit'}
                    title={'修改'}
                    onClick={() => this.updateParking(item.id)}
                  />
                  <Button
                    customtype={'icon'}
                    icon={'pm-trash-can'}
                    title={'删除'}
                    onClick={() => this.deleteParking(item.id)}
                  />
                </div>
              </div>
            </div>
          ))}

          <div
            className={classNames(styles.addItem, styles.item, 'flexColCenter', 'itemCenter')}
            onClick={this.addParking}
          >
            <Icon type={'pm-add'} />
            <div className={styles.addText}>新增停车场</div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className={classNames('flexColStart', styles.content)}>
        <Confirm type={'warning'} ref={this.confirmRef} />
        <StepTitle title={'停车场设置'} />
        {this.renderList()}
        {this.renderButton()}
        {this.renderModal()}
        {this.renderOperatingResults()}
      </div>
    );
  }

  onParkingTypeChange = value => {
    if (value === '1') {
      this.setState({
        isPublicParking: false,
      });
    } else {
      this.setState({
        isPublicParking: true,
      });
    }
  };

  getRegionItem = () => {
    const firstRegion: any = [];
    const secondRegion: any = [];

    LETTER.forEach(item => {
      firstRegion.push({ value: item, key: item });
    });

    for (let i = 1; i < 10; i++) {
      secondRegion.push({ value: i.toString(), key: i.toString() });
    }
    const firstRegionOption = firstRegion.map((item, index) => {
      return (
        <Select.Option key={item.key} value={item.key}>
          {item.value}
        </Select.Option>
      );
    });

    const secondRegionOption = secondRegion.map((item, index) => {
      return (
        <Select.Option key={item.key} value={item.key}>
          {item.value}
        </Select.Option>
      );
    });
    return {
      type: 'custom',
      field: 'ownerName',
      span: 12,
      render: getFieldDecorator => {
        return (
          <Fragment>
            <Col span={14}>
              <FormItem label={'所在区域'}>
                {getFieldDecorator('parkingFirst', {})(
                  <Select placeholder={'空'}>{firstRegionOption}</Select>,
                )}
              </FormItem>
            </Col>
            <Col span={10} style={{ marginTop: '40px' }}>
              <FormItem label={''}>
                {getFieldDecorator('parkingSecond', {})(
                  <Select placeholder={'空'}>{secondRegionOption}</Select>,
                )}
              </FormItem>
            </Col>
          </Fragment>
        );
      },
    };
  };

  cancelModel = () => {
    this.setState({
      add: false,
      modify: false,
      tabsActiveKey: '1',
    });
  };

  onCancelOperatingResults = () => {
    this.setState({ operatingResultsVisible: false });
  };

  addParking = () => {
    this.setState({
      add: true,
      tabsActiveKey: '1',
    });
  };

  updateParking = async id => {
    await this.props.dispatch({ type: 'parkingGlobal/getParkingById', payload: { id } });
    this.setState({
      modify: true,
    });
  };

  deleteParking = id => {
    const payload = [id];
    if (this.confirmRef.current) {
      this.confirmRef.current.open(
        async () => {
          const data = await this.props.dispatch({
            type: 'parkingGlobal/deleteParking',
            payload,
          });
          if (data && data.error) {
            this.setState({
              operatingResultsVisible: true,
              batchHandleResultsData: data,
            });
          } else {
            this.getParkingList();
          }
        },
        '删除',
        `确定要删除该停车场吗？`,
      );
    }
  };

  nextForm = () => {
    this.setState({
      tabsActiveKey: (parseInt(this.state.tabsActiveKey) + 1).toString(),
    });
  };

  getParkingList = () => {
    this.props.dispatch({ type: 'parkingGlobal/getParkingList' });
  };

  onParkingItemFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (e) {
      e.preventDefault();
    }
    this.parkingItemForm.validateFields(async (err, fieldsValue) => {
      if (err) return;
      const area =
        (fieldsValue.parkingFirst ? fieldsValue.parkingFirst : '') +
        (fieldsValue.parkingSecond ? fieldsValue.parkingSecond : '');
      const fields = {
        parkingLotId: this.state.parkingLotId,
        area: area,
        count: fieldsValue.count ? fieldsValue.count : 1,
      };
      const { dispatch } = this.props;
      const res = await dispatch({
        type: 'parkingGlobal/addParkingItem',
        payload: fields,
      });
      if (res && res.success) {
        this.cancelModel();
      }
    });
  };

  onParkingFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (e) {
      e.preventDefault();
    }
    this.parkingForm.validateFields(async (err, fieldsValue) => {
      if (err) return;
      const { add, isPublicParking } = this.state;
      let url = '';
      if (add) {
        url = 'parkingGlobal/addParking';
      } else {
        fieldsValue.id = this.props.parkingDetail.id;
        url = 'parkingGlobal/editParking';
      }
      const { dispatch } = this.props;
      const res = await dispatch({
        type: url,
        payload: fieldsValue,
      });
      if (res && res.success) {
        this.setState({
          parkingLotId: res.data.id,
        });
        this.getParkingList();
        if (add && !isPublicParking) {
          this.nextForm();
        } else {
          this.cancelModel();
        }
      }
    });
  };

  submit = () => {
    const { onFormNext, onStepNext } = this.props;
    onFormNext();
    onStepNext();
  };
}
export default ParkingLotItemConfig;
