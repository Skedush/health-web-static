import React, { PureComponent, RefObject, createRef } from 'react';
import Form, { FormComponentProps, WrappedFormUtils } from '@/components/Library/Form';
import styles from './index.less';
import {
  Row,
  Img,
  Confirm,
  Message,
  OperatingResults,
  ModalForm,
  Button,
  // Tooltip,
  Col,
  Modal,
  Icon,
  // Modal,
} from '@/components/Library';
import { SUCCESS_BINDING, SUCCESS_UPDATE, SUCCESS_UNBINDING } from '@/utils/message';
import { PersonBaseInfo } from '@/models/person';
import { EPersonType } from '../PerosonForm';
import moment from 'moment';
import { copyArrParam } from '@/utils';
import AntdIcon from '@/components/Library/Icon';
import passportImage from '@/assets/images/permit/passport.png';
import { GlobalState, DictionaryEnum } from '@/common/type';
import { connect } from '@/utils/decorators';
import classNames from 'classnames';
import { CarBaseInfo } from '../../../Car/model';

const mapStateToProps = (state: GlobalState) => {
  return {
    state,
    ButtonLoading: state.loading.effects['person/addPerson'],
    timeMenu: state.app.dictionry[DictionaryEnum.PERMIT_TIME_MENU],
  };
};
interface Props extends FormComponentProps {
  dispatch: Function;
  personData?: PersonBaseInfo | null;
  permitType: 'car' | 'person';
  donotUpdateModal?: boolean;
  personType?: EPersonType;
  tableStyle?: 'vertical';
  carData?: CarBaseInfo | null;
  personTypes?: any[];
  authPermitList?: any[];
  isUnchecked?: boolean;
  inTheCarForm?: boolean;
  updateData?: Function;
  onCancelModel?: Function;
  [key: string]: any;
}

interface State {
  bindingFormVisible: boolean;
  authroizeTimeVisible: boolean;
  permitList: any[];
  modifyData?: any;
  beforeModifyData?: any;
  updateType: string;
  personPermitList: any[];
  carPermitList: any[];
  showError: boolean;
  removePermitVisible: boolean;
  reletModalVisible: boolean;
  updateAuthInfoVisible: boolean;
}

@connect(
  mapStateToProps,
  null,
  null,
  { forwardRef: true },
)
export class AuthTimeForm extends PureComponent<Props, State> {
  confirmRef: RefObject<Confirm>;

  operateResultRef: RefObject<OperatingResults>;

  bindingForm: WrappedFormUtils;

  authorizeTimeForm: WrappedFormUtils;

  reletModalForm: WrappedFormUtils;

  constructor(props) {
    super(props);
    this.operateResultRef = createRef();
    this.confirmRef = createRef();
    this.state = {
      permitList: [],
      bindingFormVisible: false,
      authroizeTimeVisible: false,
      personPermitList: [],
      carPermitList: [],
      showError: false,
      updateAuthInfoVisible: false,
      removePermitVisible: false,
      reletModalVisible: false,
      updateType: '',
    };
  }

  componentDidMount() {
    const { carData } = this.props;
    this.props.dispatch({ type: 'app/getDic', payload: { type: DictionaryEnum.PERMIT_TIME_MENU } });
    this.getPermitList();
    if (carData && carData.carId) {
      this.getBindingPermitList();
    }
  }

  async getPermitList() {
    const { permitType } = this.props;
    const list = await this.props.dispatch({
      type: 'permit/getSelectPermitList',
      data: { type: permitType === 'person' ? '1' : '2' },
    });
    copyArrParam(list, { id: 'key', name: 'value' });
    this.setState({
      permitList: list,
    });
  }

  async setDefaultTime() {
    const { personData, carData } = this.props;
    if (personData || carData) {
      this.getBindingPermitList();
    }
  }

  async getBindingPermitList() {
    if (this.props.updateData) {
      this.props.updateData();
      return;
    }
    const { personData, isUnchecked, carData } = this.props;
    if (personData) {
      const data =
        typeof isUnchecked === 'boolean' && isUnchecked // 未认证人员
          ? await this.props.dispatch({
              type: 'permit/getUncheckedPermitList',
              licenceId: personData.licenceId,
            })
          : await this.props.dispatch({
              type: 'permit/getPersonPermitList',
              data: { id: personData.personId },
            });
      this.setState({
        personPermitList: data,
        showError: false,
      });
    }
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

  validate() {
    return new Promise(resolve => {
      this.props.form.validateFields(async (error, values) => {
        if (error) {
          resolve(null);
          return;
        }
        resolve(values);
      });
    });
  }

  submit() {
    const { personData, carData, onCancelModel } = this.props;
    const { personPermitList, carPermitList } = this.state;
    const carValidate = carPermitList && carPermitList.length && carData;
    const personValidate = personPermitList && personPermitList.length && personData;
    return new Promise(async resolve => {
      if (carValidate || personValidate) {
        let data;
        try {
          if (carValidate && carData) {
            await this.props.dispatch({
              type: 'permit/updateCarPermit',
              data: { id: carData.carId },
            });
          } else if (personData && personValidate) {
            data = await this.props.dispatch({
              type: 'permit/updatePersonPermit',
              data: { id: personData.licenceId },
            });
          }
          if (onCancelModel) {
            onCancelModel();
          }
          if (data && data.error && this.operateResultRef.current) {
            this.operateResultRef.current.open(data);
            resolve();
            return;
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
      onSubmit: e => {
        e.preventDefault();
        this.authorizeSubmit('modify');
      },
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

  renderBindingPermit() {
    const { personTypes, isUnchecked, permitType } = this.props;
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
          disabledDate: this.disabledEndDate,
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
    if (this.props.tableStyle === 'vertical' && !isUnchecked && permitType === 'person') {
      props.items.unshift({
        type: 'select',
        field: 'type',
        fill: true,
        children: personTypes || [],
        placeholder: '选择人员类型',
        rules: [{ required: true, message: '请选择人员类型!' }],
      } as any);
    }
    return <ModalForm {...props} />;
  }

  renderUpdateAuth() {
    const { updateAuthInfoVisible, modifyData, beforeModifyData, updateType } = this.state;
    const footer = (
      <div className={styles.updateFooter}>
        <Button customtype={'master'} onClick={this.updateAuthInfo}>
          更新
        </Button>
        <Button
          customtype={'second'}
          onClick={() => this.setState({ updateAuthInfoVisible: false })}
        >
          关闭
        </Button>
      </div>
    );
    const props = {
      title: '更新授权信息',
      width: updateType === 'relet' ? '800px' : '400px',
      footer,
      onCancel: () => this.setState({ updateAuthInfoVisible: false }),
      visible: updateAuthInfoVisible,
    };
    return (
      <Modal {...props}>
        <div
          className={classNames(
            styles.updateUpdateInfo,
            updateType === 'relet' ? styles.updateUpdateInfo2 : '',
          )}
        >
          {updateType === 'relet' && this.renderTableItem(beforeModifyData, false)}
          {updateType === 'relet' && <Icon className={styles.arrowIcon} type={'double-right'} />}
          {this.renderTableItem(modifyData || {}, false)}
        </div>
      </Modal>
    );
  }

  renderReletModal() {
    const { timeMenu } = this.props;
    const { modifyData, reletModalVisible } = this.state;
    const props = {
      items: [
        {
          type: 'label',
          field: 'name',
          span: 24,
          value: modifyData ? modifyData.name : '',
          placeholder: '通行证名称',
        },
        {
          type: 'label',
          field: 'time',
          span: 24,
          value: modifyData ? modifyData.authStartDate + '~' + modifyData.authEndDate : '',
          placeholder: '租赁时间',
        },
        {
          type: 'radio',
          field: 'time',
          span: 24,
          initialValue: '1',
          onChange: this.reletTimeChange,
          children: timeMenu,
          placeholder: '续期',
        },
        {
          type: 'datePicker',
          field: 'authEndDate',
          span: 24,
          showTime: false,
          disabledDate: this.disabledEndDate,
          initialValue: modifyData ? moment().add(1, 'week') : undefined,
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
      onSubmit: e => {
        e.preventDefault();
        this.authorizeSubmit('relet');
      },
      title: '续期',
      destroyOnClose: true,
      onCancel: this.closeAuthorizeTime,
      width: '30%',
      add: reletModalVisible,
      onGetFormRef: (modelForm: WrappedFormUtils) => {
        this.reletModalForm = modelForm;
      },
    };
    return <ModalForm {...props} />;
  }

  renderRemovePermit() {
    const { removePermitVisible, modifyData } = this.state;
    const footer = (
      <div className={styles.updateFooter}>
        <Button customtype={'master'} onClick={this.removePermit}>
          解绑并更新授权
        </Button>
        <Button customtype={'second'} onClick={() => this.setState({ removePermitVisible: false })}>
          关闭
        </Button>
      </div>
    );
    const props = {
      title: '解绑通行证',
      width: '400px',
      footer,
      onCancel: () => this.setState({ removePermitVisible: false }),
      visible: removePermitVisible,
    };
    return (
      <Modal {...props}>
        <div className={styles.updateUpdateInfo}>
          {this.renderTableItem(modifyData || {}, false)}
        </div>
      </Modal>
    );
  }

  renderTableItem(item, noOperate = true) {
    const { tableStyle } = this.props;
    return (
      <div
        className={classNames(
          styles.permitItem,
          tableStyle === 'vertical' ? styles.vertical : '',
          item.state ? styles.isExpire : '',
        )}
        key={item.id}
      >
        <div className={styles.top}>
          <Img type={'others'} image={passportImage} className={styles.icon} />
          <div className={styles.name} title={item.name}>
            {item.name}
            <label className={styles.expire}>（{item.state}）</label>
          </div>
        </div>
        <div className={styles.bottom}>
          <div className={styles.row}>
            <AntdIcon type={'pm-position'} className={styles.icon} />
            {/* <Tooltip
              placement={'topRight'}
              title={item.passPositionList.map(v => v.passPositionName + '，')}
            >
            </Tooltip> */}
            <div className={styles.rowContent}>
              {(item.passPositionList || []).map(v => v.passPositionName + '，')}
            </div>
          </div>
          <div className={styles.row}>
            <AntdIcon type={'clock-circle'} theme={'filled'} className={styles.icon} />
            <div className={styles.rowContent}>
              {item.authStartDate}~{item.authEndDate}
            </div>
          </div>
          {noOperate && (
            <Row className={styles.operate}>
              {!item.state && (
                <Button
                  customtype={'icon'}
                  icon={'pm-edit'}
                  onClick={() => this.openAuthorizeTime(item)}
                  title={'修改'}
                />
              )}
              {item.state && (
                <Button
                  customtype={'icon'}
                  icon={'exception'}
                  onClick={() => this.openReletTime(item)}
                  title={'续期'}
                />
              )}
              <Button
                customtype={'icon'}
                icon={'pm-trash-can'}
                onClick={() => this.unBindingPermit(item)}
                title={'删除'}
              />
            </Row>
          )}
        </div>
      </div>
    );
  }

  renderTable() {
    const { tableStyle, authPermitList, permitType } = this.props;
    const { personPermitList, carPermitList } = this.state;
    const personList =
      personPermitList && personPermitList.length ? personPermitList : authPermitList || [];
    const carList = carPermitList && carPermitList.length ? carPermitList : authPermitList || [];
    const list = personList.length ? personList : carList.length ? carList : [];
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
            <label>绑定{permitType === 'person' ? '人员' : '车辆'}通行证</label>
          </div>
        </div>
        {list &&
          list.map(item => {
            return this.renderTableItem(item);
          })}
      </div>
    );
  }

  renderCarFormButton() {
    return this.props.inTheCarForm ? (
      <Row gutter={16} justify={'center'} style={{ marginLeft: '0', marginRight: '0' }}>
        <Row style={{ padding: '12px 24px' }}>
          <Col
            style={{
              padding: '28px 8px 0 8px',
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <Button style={{ width: '160px' }} customtype={'master'} onClick={() => this.submit()}>
              提交
            </Button>
          </Col>
        </Row>
      </Row>
    ) : (
      ''
    );
  }

  render() {
    const { tableStyle } = this.props;
    const { showError } = this.state;
    return (
      <div>
        <div
          className={classNames(
            styles.authTimeForm,
            tableStyle === 'vertical' ? styles.verticalList : '',
          )}
        >
          {this.renderReletModal()}
          {this.renderRemovePermit()}
          {this.renderUpdateAuth()}
          {this.renderBindingPermit()}
          {this.renderModifyAuthorizeTime()}
          <Confirm ref={this.confirmRef} />
          <OperatingResults ref={this.operateResultRef} />
          {this.renderTable()}
          {showError && <div className={styles.red}>至少要绑定一个通行证</div>}
        </div>
        {this.renderCarFormButton()}
      </div>
    );
  }

  disabledEndDate = endValue => {
    const startValue = moment().subtract('day', 1);
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  };

  permitChange = id => {
    const foundItem = this.state.permitList.find(item => item.id === id);
    if (foundItem) {
      this.bindingForm.setFieldsValue({
        time: [moment(foundItem.authStartDate), moment(foundItem.authEndDate)],
      });
    }
  };

  openBindingForm = () => {
    this.setState({
      bindingFormVisible: true,
    });
  };

  bindingSubmit = e => {
    e.preventDefault();
    const { personData, carData, permitType, donotUpdateModal } = this.props;
    this.bindingForm.validateFields(async (error, values) => {
      if (error) {
        return;
      }
      if (personData) {
        values.id = personData.licenceId;
        values.type = values.type || personData.type;
      } else if (carData) {
        values.id = carData.carId;
        values.type = carData.type;
      }
      values.authStartDate = values.time[0].format('YYYY-MM-DD HH:mm:ss');
      values.authEndDate = values.time[1].format('YYYY-MM-DD HH:mm:ss');
      delete values.time;
      let data;
      if (permitType === 'person') {
        data = await this.props.dispatch({ type: 'permit/personBindingPermit', data: values });
      } else if (permitType === 'car') {
        data = await this.props.dispatch({ type: 'permit/carBindingPermit', data: values });
      }
      if (data && !data.error) {
        this.setState({
          updateType: 'add',
          modifyData: data,
        });
        Message.success(SUCCESS_BINDING);
        this.cancelBinding();
        if (!donotUpdateModal) {
          this.openUpdateAuthInfo();
        }
        this.getBindingPermitList();
      }
    });
  };

  cancelBinding = () => {
    this.setState({
      bindingFormVisible: false,
    });
  };

  reletTimeChange = event => {
    const {
      target: { value },
    } = event;
    const data = JSON.parse(JSON.stringify(this.state.modifyData));
    let date;
    if (value === '1') {
      date = moment(data.authEndDate).add('1', 'week');
    } else if (value === '2') {
      date = moment(data.authEndDate).add('1', 'month');
    } else if (value === '3') {
      date = moment(data.authEndDate).add('3', 'month');
    } else if (value === '4') {
      date = moment(data.authEndDate).add('6', 'month');
    } else if (value === '5') {
      date = moment(data.authEndDate).add('1', 'year');
    }
    this.reletModalForm.setFieldsValue({
      authEndDate: date,
    });
  };

  openUpdateAuthInfo = () => {
    this.setState({ updateAuthInfoVisible: true });
  };

  updateAuthInfo = async () => {
    const { personData, carData, updateData } = this.props;
    let data;
    if (carData) {
      await this.props.dispatch({
        type: 'permit/updateCarPermit',
        data: { id: carData.carId },
      });
    } else if (personData) {
      data = await this.props.dispatch({
        type: 'permit/updatePersonPermit',
        data: { id: personData.licenceId },
      });
    }
    if (data && data.error && this.operateResultRef.current) {
      this.operateResultRef.current.open(data);
    }
    if (updateData) {
      updateData();
    }
    this.setState({
      updateAuthInfoVisible: false,
    });
  };

  authorizeSubmit = (type: 'modify' | 'relet') => {
    const { personData, carData, permitType, donotUpdateModal } = this.props;
    const { modifyData } = this.state;
    (type === 'modify' ? this.authorizeTimeForm : this.reletModalForm).validateFields(
      async (error, values) => {
        if (error) {
          return;
        }
        if (modifyData) {
          if (personData) {
            values.id = personData.licenceId;
            values.type = values.type || personData.type;
          } else if (carData) {
            values.id = carData.carId;
            values.type = values.type || carData.type;
          }
          values.passId = modifyData.id;
          values.authStartDate =
            type === 'relet'
              ? modifyData.authStartDate
              : values.authStartDate.format('YYYY-MM-DD HH:mm:ss');
          values.authEndDate = values.authEndDate.format('YYYY-MM-DD HH:mm:ss');
          const data = await this.props.dispatch({
            type:
              permitType === 'person'
                ? 'permit/modifyPersonPermitTime'
                : 'permit/modifyCarPermitTime',
            data: values,
          });
          if (data && !data.error) {
            Message.success(SUCCESS_UPDATE);
            this.setState({
              updateType: type,
              modifyData: data,
            });
            if (!donotUpdateModal) {
              this.openUpdateAuthInfo();
            }
            this.getBindingPermitList();
            this.closeAuthorizeTime();
          }
        }
      },
    );
  };

  openAuthorizeTime = item => {
    this.setState({
      modifyData: item,
      authroizeTimeVisible: true,
    });
  };

  openReletTime = item => {
    const beforeData = JSON.parse(JSON.stringify(item));
    beforeData.id = beforeData.id + 1;
    this.setState({
      beforeModifyData: beforeData,
      modifyData: item,
      reletModalVisible: true,
    });
  };

  unBindingPermit(item) {
    this.setState({
      modifyData: item,
      removePermitVisible: true,
    });
  }

  removePermit = async () => {
    const { modifyData } = this.state;
    const { personData, carData } = this.props;
    let data;
    if (personData) {
      data = await this.props.dispatch({
        type: 'permit/personUnbindingPermit',
        data: { id: personData.licenceId, passId: modifyData.id },
      });
    } else if (carData) {
      data = await this.props.dispatch({
        type: 'permit/carUnbindingPermit',
        data: { id: carData.carId, passId: modifyData.id },
      });
    }
    if (data && !data.error) {
      Message.success(SUCCESS_UNBINDING);
      this.setState({
        removePermitVisible: false,
      });
      this.getBindingPermitList();
      this.updateAuthInfo();
    }
  };

  closeAuthorizeTime = () => {
    this.setState({
      authroizeTimeVisible: false,
      reletModalVisible: false,
    });
  };
}

const AuthTimeFormInstance = Form.create<Props>()(AuthTimeForm);

export default AuthTimeFormInstance;
