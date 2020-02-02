import React, { PureComponent, RefObject, createRef } from 'react';
import styles from './index.less';
import {
  Form,
  Col,
  Row,
  Img,
  Confirm,
  Message,
  OperatingResults,
  Button,
  ModalForm,
  Tooltip,
} from '@/components/Library';
import { FormComponentProps, WrappedFormUtils } from '@/components/Library/Form';
import { PersonBaseInfo } from '@/models/person';
import { EPersonType } from '../PerosonForm';
import { CarBaseInfo } from '../../../Car/model';
import { SUCCESS_UNBINDING, SUCCESS_UPDATE, SUCCESS_BINDING } from '@/utils/message';
import passportImage from '@/assets/images/permit/passport.png';
import moment from 'moment';
import AntdIcon from '@/components/Library/Icon';
import { copyArrParam } from '@/utils';
import classNames from 'classnames';

interface Props extends FormComponentProps {
  dispatch: Function;
  personType?: EPersonType;
  personData?: PersonBaseInfo | null;
  carData: CarBaseInfo | null;
  parkingData?: any;
  authPermitList?: any[];
  tableStyle?: 'vertical';
  onCancelModel?: Function;
  inTheCarForm?: boolean;
}

interface State {
  bindingFormVisible: boolean;
  authroizeTimeVisible: boolean;
  permitList: any[];
  modifyData?: any;
  carPermitList: any[];
  showError: boolean;
}

export class CarFormAuth extends PureComponent<Props, State> {
  confirmRef: RefObject<Confirm>;

  operateResultRef: RefObject<OperatingResults>;

  bindingForm: WrappedFormUtils;

  authorizeTimeForm: WrappedFormUtils;

  constructor(props) {
    super(props);
    this.confirmRef = createRef();
    this.operateResultRef = createRef();
    this.state = {
      bindingFormVisible: false,
      authroizeTimeVisible: false,
      permitList: [],
      carPermitList: [],
      showError: false,
    };
  }

  componentDidMount() {
    const { carData } = this.props;
    this.getPermitList();
    if (carData && carData.carId) {
      this.getCarPermitList();
    }
  }

  async getPermitList() {
    const list = await this.props.dispatch({
      type: 'permit/getSelectPermitList',
      data: { type: '2' },
    });
    copyArrParam(list, { id: 'key', name: 'value' });
    this.setState({
      permitList: list,
    });
  }

  reset() {
    this.props.form.resetFields();
  }

  async setTimeDefault() {
    const { carData } = this.props;
    if (carData) {
      this.getCarPermitList();
    }
  }

  async getCarPermitList() {
    const { carData } = this.props;
    if (carData) {
      const data = await this.props.dispatch({
        type: 'permit/getCarPermitList',
        data: { id: carData.carId },
      });
      this.setState({
        carPermitList: data,
        showError: false,
      });
    }
  }

  submit() {
    const { carData, onCancelModel } = this.props;
    const { carPermitList } = this.state;
    return new Promise(async resolve => {
      if (carPermitList && carPermitList.length && carData) {
        try {
          await this.props.dispatch({
            type: 'permit/updateCarPermit',
            data: { id: carData.carId },
          });
          if (onCancelModel) {
            onCancelModel();
          }
          resolve(true);
        } catch (error) {
          resolve();
        }
      } else {
        resolve();
        this.setState({
          showError: true,
        });
      }
    });
  }

  renderBindingPermit() {
    const { bindingFormVisible, permitList } = this.state;
    const props = {
      items: [
        {
          type: 'select',
          field: 'passId',
          fill: true,
          onChange: this.permitChange,
          children: permitList,
          placeholder: '选择通行证',
          rules: [{ required: true, message: '请选择通行证!' }],
        },
        {
          type: 'rangePicker',
          field: 'time',
          fill: true,
          children: permitList,
          showTime: false,
          placeholder: '通行证有效期',
          rules: [{ required: true, message: '请设置通行证有效期!' }],
        },
      ],
      actions: [
        {
          customtype: 'select',
          // loading: loading,
          title: '确定',
          htmlType: 'submit' as 'submit',
        },
      ],
      onSubmit: this.bindingSubmit,
      title: '绑定通行证',
      destroyOnClose: true,
      onCancel: this.cancelBinding,
      width: '35%',
      add: bindingFormVisible,
      onGetFormRef: (modelForm: WrappedFormUtils) => {
        this.bindingForm = modelForm;
      },
    };
    return <ModalForm {...props} />;
  }

  renderModifyAuthorizeTime() {
    const { authroizeTimeVisible, modifyData } = this.state;
    const props = {
      items: [
        {
          type: 'datePicker',
          field: 'authStartDate',
          span: 12,
          showTime: false,
          initialValue: modifyData ? moment(modifyData.authStartDate) : undefined,
          placeholder: '起始时间',
          rules: [{ required: true, message: '请选择起始时间!' }],
        },
        {
          type: 'datePicker',
          field: 'authEndDate',
          span: 12,
          showTime: false,
          initialValue: modifyData ? moment(modifyData.authEndDate) : undefined,
          placeholder: '截止时间',
          rules: [{ required: true, message: '请选择截止时间!' }],
        },
      ],
      actions: [
        {
          customtype: 'select',
          title: '确定',
          htmlType: 'submit' as 'submit',
        },
      ],
      onSubmit: this.authorizeSubmit,
      title: '修改授权时间',
      destroyOnClose: true,
      onCancel: this.closeAuthorizeTime,
      width: '30%',
      add: authroizeTimeVisible,
      onGetFormRef: (modelForm: WrappedFormUtils) => {
        this.authorizeTimeForm = modelForm;
      },
    };
    return <ModalForm {...props} />;
  }

  renderTableItem(item) {
    const { tableStyle } = this.props;
    return (
      <div
        className={classNames(styles.permitItem, tableStyle === 'vertical' ? styles.vertical : '')}
        key={item.id}
      >
        <div className={styles.top}>
          <Img type={'others'} image={passportImage} className={styles.icon} />
          <div className={styles.name} title={item.name}>
            {item.name}
          </div>
        </div>
        <div className={styles.bottom}>
          <div className={styles.row}>
            <AntdIcon type={'pm-position'} className={styles.icon} />
            <Tooltip
              placement={'topRight'}
              title={item.passPositionList.map(v => v.passPositionName + '，')}
            >
              <div className={styles.rowContent}>
                {item.passPositionList.map(v => v.passPositionName + '，')}
              </div>
            </Tooltip>
          </div>
          <div className={styles.row}>
            <AntdIcon type={'clock-circle'} theme={'filled'} className={styles.icon} />
            <div className={styles.rowContent}>
              {item.authStartDate}~{item.authEndDate}
            </div>
          </div>
          <Row className={styles.operate}>
            <Button
              customtype={'icon'}
              icon={'pm-edit'}
              onClick={() => this.openAuthorizeTime(item)}
              title={'修改'}
            />
            <Button
              customtype={'icon'}
              icon={'pm-trash-can'}
              onClick={() => this.unBindingPermit(item)}
              title={'删除'}
            />
          </Row>
        </div>
      </div>
    );
  }

  renderTable() {
    const { tableStyle, authPermitList } = this.props;
    const { carPermitList } = this.state;
    const list = carPermitList && carPermitList.length ? carPermitList : authPermitList;
    return (
      <div className={styles.listContainer}>
        <div
          className={classNames(
            styles.permitItemPlus,
            tableStyle === 'vertical' ? styles.vertical : '',
          )}
        >
          <div className={styles.plus} onClick={this.openBindingForm}>
            <AntdIcon type={'pm-add'} className={styles.icon} />
            <label>绑定车辆通行证</label>
          </div>
        </div>
        {list &&
          list.map(item => {
            return this.renderTableItem(item);
          })}
      </div>
    );
  }

  render() {
    const { tableStyle, inTheCarForm } = this.props;
    const { showError } = this.state;
    return (
      <div>
        <div
          className={classNames(
            styles.authTimeForm,
            tableStyle === 'vertical' ? styles.verticalList : '',
          )}
        >
          {this.renderBindingPermit()}
          {this.renderModifyAuthorizeTime()}
          <Confirm ref={this.confirmRef} />
          <OperatingResults ref={this.operateResultRef} />
          {this.renderTable()}
          {showError && <div className={styles.red}>至少要绑定一个通行证</div>}
        </div>
        {inTheCarForm && (
          <Row gutter={16} justify={'center'} style={{ marginLeft: '0', marginRight: '0' }}>
            <Row style={{ padding: '12px 24px' }}>
              <Col
                style={{
                  padding: '28px 8px 0 8px',
                  display: 'flex',
                  justifyContent: 'flex-end',
                }}
              >
                <Button
                  style={{ width: '160px' }}
                  customtype={'master'}
                  onClick={() => this.submit()}
                >
                  提交
                </Button>
              </Col>
            </Row>
          </Row>
        )}
      </div>
    );
  }

  permitChange = id => {
    const foundItem = this.state.permitList.find(item => item.id === id);
    if (foundItem) {
      let days;
      if (foundItem.expirationDate === '1') {
        days = 7;
      } else if (foundItem.expirationDate === '2') {
        days = 30;
      } else if (foundItem.expirationDate === '3') {
        days = 90;
      } else if (foundItem.expirationDate === '4') {
        days = 182;
      } else if (foundItem.expirationDate === '5') {
        days = 365;
      }
      this.bindingForm.setFieldsValue({
        time: [moment(), moment().add(days, 'day')],
      });
    }
  };

  openBindingForm = () => {
    this.setState({
      bindingFormVisible: true,
    });
  };

  cancelBinding = () => {
    this.setState({
      bindingFormVisible: false,
    });
  };

  bindingSubmit = e => {
    e.preventDefault();
    const { carData } = this.props;
    this.bindingForm.validateFields(async (error, values) => {
      if (error) {
        return;
      }
      if (carData) {
        values.id = carData.carId;
        values.type = carData.type;
      }
      values.authStartDate = values.time[0].format('YYYY-MM-DD HH:mm:ss');
      values.authEndDate = values.time[1].format('YYYY-MM-DD HH:mm:ss');
      delete values.time;
      const data = await this.props.dispatch({ type: 'permit/carBindingPermit', data: values });
      if (data && !data.error) {
        Message.success(SUCCESS_BINDING);
        this.cancelBinding();
        this.getCarPermitList();
      }
    });
  };

  openAuthorizeTime = item => {
    this.setState({
      modifyData: item,
      authroizeTimeVisible: true,
    });
  };

  authorizeSubmit = e => {
    e.preventDefault();
    const { carData } = this.props;
    const { modifyData } = this.state;
    this.authorizeTimeForm.validateFields(async (error, values) => {
      if (error) {
        return;
      }
      if (modifyData && carData) {
        values.id = carData.carId;
        values.passId = modifyData.id;
        values.type = carData.type;
        values.authStartDate = values.authStartDate.format('YYYY-MM-DD HH:mm:ss');
        values.authEndDate = values.authEndDate.format('YYYY-MM-DD HH:mm:ss');
        const data = await this.props.dispatch({
          type: 'permit/modifyCarPermitTime',
          data: values,
        });
        if (data && !data.error) {
          Message.success(SUCCESS_UPDATE);
          this.getCarPermitList();
          this.closeAuthorizeTime();
        }
      }
    });
  };

  unBindingPermit(item) {
    const { carData } = this.props;
    if (this.confirmRef.current) {
      this.confirmRef.current.open(
        async () => {
          if (carData) {
            const data = await this.props.dispatch({
              type: 'permit/carUnbindingPermit',
              data: { id: carData.carId, passId: item.id },
            });
            if (data && !data.error) {
              Message.success(SUCCESS_UNBINDING);
              this.getCarPermitList();
            }
          }
        },
        '解除绑定',
        '是否要解除通行证绑定？',
      );
    }
  }

  closeAuthorizeTime = () => {
    this.setState({
      authroizeTimeVisible: false,
    });
  };
}

const CarFromAuthInstance = Form.create<Props>()(CarFormAuth);

export default CarFromAuthInstance;
