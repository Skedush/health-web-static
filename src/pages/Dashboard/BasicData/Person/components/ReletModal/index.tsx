import React, { PureComponent, RefObject, createRef } from 'react';
import {
  Modal,
  Form,
  Button,
  Row,
  Message,
  Confirm,
  DatePicker,
  RadioGroup,
  Radio,
} from '@/components/Library';
import { PersonBaseInfo } from '@/models/person';
import { connect } from '@/utils/decorators';
import { SUCCESS_IMPOWER } from '@/utils/message';
import moment, { Moment } from 'moment';
import styles from './index.less';

const mapStateToProps = state => {
  return {
    state,
    submitLoading: state.loading.effects['person/icCardIssued'],
  };
};

interface State {
  visible: boolean;
  timeZone: string;
  personData: PersonBaseInfo;
  defaultTime: Moment | null;
}

@connect(
  mapStateToProps,
  null,
  null,
  { forwardRef: true },
)
export class ReletModal extends PureComponent<any, State> {
  personData: PersonBaseInfo;

  confirmRef: RefObject<Confirm>;

  endTime: Moment;

  authorizeExpireTime: Moment;

  constructor(props) {
    super(props);
    this.confirmRef = createRef();
    this.state = {
      visible: false,
      defaultTime: null,
      timeZone: '',
      personData: {} as PersonBaseInfo,
    };
  }

  componentDidMount() {}

  async open(personData: PersonBaseInfo) {
    this.personData = personData;
    await this.setDefaultTime(personData);
    this.setState({
      visible: true,
    });
  }

  async setDefaultTime(personData: PersonBaseInfo) {
    const { dispatch } = this.props;
    if (personData) {
      const id = personData.subId;
      const data = await dispatch({
        type: 'person/getAuthTime',
        data: { id, type: personData.type, personId: personData.personId },
      });
      this.setState({
        personData,
      });
      this.endTime = moment(data.rentTime);
      this.authorizeExpireTime = moment(data.authorizeExpireTime);
      this.setState({
        defaultTime: moment(data.authorizeExpireTime).add(1, 'months'),
        timeZone: `${data.rentTime} ~ ${data.authorizeExpireTime}`,
      });
    }
  }

  close = () => {
    this.setState({
      visible: false,
    });
  };

  submit = async () => {
    const { dispatch, reletSuccess } = this.props;
    this.props.form.validateFields(async (error, values) => {
      if (error) {
        return;
      }
      if (this.personData) {
        const data = {
          personId: this.personData.personId,
          subId: this.personData.subId,
          type: this.personData.type,
          rentTime: this.endTime.format('YYYY-MM-DD HH:mm:ss'),
          authorizeExpireTime: values.time.format('YYYY-MM-DD HH:mm:ss'),
        };
        const res = await dispatch({ type: 'person/reletPerson', data });
        if (res && res.error && this.confirmRef.current) {
          this.confirmRef.current.open(
            () => {},
            '提交异常',
            <div>
              {res.message.map((item, i) => (
                <div key={i}>{item}</div>
              ))}
            </div>,
            'warning',
          );
        } else if (res) {
          reletSuccess();
          Message.success(SUCCESS_IMPOWER);
          this.close();
        }
      }
    });
  };

  timeValidator = (rule, value, callback) => {
    if (!value[1]) {
      callback(new Error('请选择结束时间'));
    } else {
      callback();
    }
  };

  reletTimeChange = event => {
    const value = event.target.value;
    const { form } = this.props;
    const { setFieldsValue } = form;
    setFieldsValue({
      time: moment(this.authorizeExpireTime).add(value, 'months'),
    });
  };

  renderFooter() {
    const { submitLoading } = this.props;
    return (
      <Button customtype={'master'} loading={submitLoading} onClick={this.submit}>
        提交
      </Button>
    );
  }

  disabledEndDate = endValue => {
    if (!endValue || !this.authorizeExpireTime) {
      return false;
    }
    return endValue.valueOf() <= this.authorizeExpireTime.valueOf();
  };

  render() {
    const { visible, timeZone, defaultTime } = this.state;
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Modal
          visible={visible}
          destroyOnClose
          footer={this.renderFooter()}
          onCancel={this.close}
          title={'续租'}
        >
          <Confirm ref={this.confirmRef} />
          <Row>
            <Form.Item label={'租住时间'}>
              <div className={styles.personType}>{timeZone}</div>
            </Form.Item>
          </Row>
          <Row>
            <Form.Item label={'续租时间'}>
              <RadioGroup defaultValue={1} onChange={this.reletTimeChange}>
                <Radio value={1}>一个月</Radio>
                <Radio value={3}>三个月</Radio>
                <Radio value={6}>六个月</Radio>
                <Radio value={12}>一年</Radio>
              </RadioGroup>
            </Form.Item>
          </Row>
          <Row>
            <Form.Item label={'到期时间'}>
              {getFieldDecorator('time', {
                initialValue: defaultTime,
                rules: [{ required: true, message: '请选择时间' }],
              })(
                <DatePicker
                  disabledDate={this.disabledEndDate}
                  showTime={false}
                  placeholder={'到期时间'}
                />,
              )}
            </Form.Item>
          </Row>
        </Modal>
      </div>
    );
  }
}

const ReletModalInstance = Form.create<any>()(ReletModal);

export default ReletModalInstance;
