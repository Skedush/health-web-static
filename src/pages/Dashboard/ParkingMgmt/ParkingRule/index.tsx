import React, { PureComponent } from 'react';
import { GlobalState, UmiComponentProps } from '@/common/type';
import connect from '@/utils/decorators/connect';
import styles from './index.less';
import { Form, Radio, Button, Col, Row, InputNumber, RadioGroup } from '@/components/Library';
import { FormComponentProps } from '@/components/Library/Form';
import classNames from 'classnames';

const mapStateToProps = (state: GlobalState) => {
  return {
    state,
    loading: state.loading.effects['parkingRule/updateParkingSetting'],
  };
};

interface Props extends ReturnType<typeof mapStateToProps>, UmiComponentProps, FormComponentProps {}

interface State {
  disabled: boolean;
}

@connect(
  mapStateToProps,
  null,
)
class ParkingRule extends PureComponent<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      disabled: false,
    };
  }

  componentDidMount() {
    this.initializeValue();
  }

  async initializeValue() {
    const data = await this.props.dispatch({ type: 'parkingGlobal/getParkingSetting' });
    const { setFieldsValue } = this.props.form;
    setFieldsValue({
      state: data.state,
      carLimit: data.carLimit,
    });
    this.setState({
      disabled: data.state === '0',
    });
  }

  renderForm() {
    const { getFieldDecorator } = this.props.form;
    const { loading } = this.props;
    const { disabled } = this.state;
    return (
      <div className={styles.form}>
        <Row>
          <Col span={8}>
            <Form.Item label={'停车场'}>
              {getFieldDecorator('state', {
                initialValue: '0',
                rules: [{ required: true, message: '停车开关是必选的' }],
              })(
                <RadioGroup onChange={this.disabledChange}>
                  <Radio value={'1'}>启用</Radio>
                  <Radio value={'0'}>停用</Radio>
                </RadioGroup>,
              )}
              {!disabled && (
                <div className={classNames(styles.tip)}>
                  在停车场功能启用时，车辆登记时，需增加选择停车场功能。
                </div>
              )}
            </Form.Item>
            <Form.Item label={'车位车辆登记限制'}>
              {getFieldDecorator('carLimit', {
                initialValue: 0,
                rules: [{ required: true, message: '请输入车辆数量' }],
              })(<InputNumber disabled={disabled} min={0} placeholder={'车位车辆登记限制'} />)}
            </Form.Item>
          </Col>
        </Row>
        <Button customtype={'master'} onClick={this.submit} loading={loading}>
          保存并更新
        </Button>
      </div>
    );
  }

  render() {
    return (
      <div className={classNames('height100', 'flexColStart', styles.parkingRule)}>
        <div className={classNames(styles.content, 'flexColStart')}>
          <div className={styles.header}>停车场规则配置</div>
          {this.renderForm()}
        </div>
      </div>
    );
  }

  disabledChange = event => {
    console.log(event.target.value);
    this.setState({
      disabled: event.target.value === '0',
    });
  };

  submit = () => {
    const { validateFields } = this.props.form;
    validateFields(async (error, values) => {
      if (error) {
        return;
      }
      const data = await this.props.dispatch({
        type: 'parkingRule/updateParkingSetting',
        data: values,
      });
      await this.props.dispatch({ type: 'parkingGlobal/getParkingSetting' });
      console.log(data);
    });
  };
}

export default Form.create<Props>()(ParkingRule);
