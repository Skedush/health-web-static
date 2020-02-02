import React, { PureComponent } from 'react';
import styles from './index.less';
import { connect } from '@/utils/decorators';
import classNames from 'classnames';
// import { isEmpty } from 'lodash';
import { Form, Button, Row, Col, Switch, Spin } from '@/components/Library';
import { FormComponentProps } from '@/components/Library/type';
import { GlobalState, UmiComponentProps, DictionaryEnum } from '@/common/type';
import { isEmpty } from 'lodash';

const { Item } = Form;
// const { Option } = Select;
const mapStateToProps = ({ app, carGlobal, loading: { effects } }: GlobalState) => {
  return {
    carBanAuthSettingData: carGlobal.carBanAuthSettingData || {},
    carAuthTimeCofig: app.dictionry[DictionaryEnum.CAR_AUTH_TIME_CONFIG],
    loading: {
      getCarBanAuthSettingLoading: effects['carGlobal/getCarBanAuthSetting'],
      updateCarBanAuthSettingLoading: effects['carBanAuthSetting/updateCarBanAuthSetting'],
    },
  };
};

type CarBanAuthSettingStateProps = ReturnType<typeof mapStateToProps>;
type CarBanAuthSettingProps = CarBanAuthSettingStateProps & UmiComponentProps & FormComponentProps;

interface CarBanAuthSettingState {
  authState: boolean;
}

@connect(
  mapStateToProps,
  null,
)
class CarBanAuthSetting extends PureComponent<CarBanAuthSettingProps, CarBanAuthSettingState> {
  constructor(props: Readonly<CarBanAuthSettingProps>) {
    super(props);
    this.state = {
      authState: props.carBanAuthSettingData.authState,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    // this.getCarBanAuthSettingData({});
    dispatch({
      type: 'app/getDic',
      payload: { type: [DictionaryEnum.CAR_AUTH_TIME_CONFIG].toString() },
    });
  }

  // eslint-disable-next-line max-lines-per-function
  renderForm() {
    const { getFieldDecorator } = this.props.form;
    // const { authState } = this.state;
    const { carBanAuthSettingData, loading } = this.props;
    if (!carBanAuthSettingData || isEmpty(carBanAuthSettingData)) {
      return null;
    }

    // const options = carAuthTimeCofig.map((item, index) => {
    //   const { key, value } = item;
    //   return (
    //     <Option key={key} value={key}>
    //       {value}
    //     </Option>
    //   );
    // });

    return (
      <Form
        className={styles.AddOrEditForm}
        labelAlign={'right'}
        onSubmit={this.onSubmit}
        // {...formItemLayout}
        autoComplete={'off'}
      >
        <Row gutter={16}>
          <Col span={24}>
            <Item label={'道闸功能'}>
              {getFieldDecorator('authState', {
                valuePropName: 'checked',
                initialValue: carBanAuthSettingData.authState,
                rules: [{ required: true }],
              })(<Switch onChange={this.onAuthStateChange} />)}
            </Item>
          </Col>
          {/* <Col span={12}>
            <Item label={'自动授权'}>
              {getFieldDecorator('autoAuth', {
                valuePropName: 'checked',
                initialValue: carBanAuthSettingData.autoAuth,
                rules: [{ required: true }],
              })(<Switch disabled={!authState} />)}
            </Item>
          </Col> */}
        </Row>
        {/* <Row gutter={16}>
          <Col span={8}>
            <Item label={'授权时间'}>
              {getFieldDecorator('authTimeType', {
                initialValue: carBanAuthSettingData.authTimeType,
                rules: [{ required: true }],
              })(
                <Select placeholder={'授权时间' as string} disabled={!authState}>
                  {options}
                </Select>,
              )}
            </Item>
          </Col>
        </Row> */}
        <Row>
          <Col span={16} className={styles.buttonCol}>
            <Button
              htmlType={'submit'}
              customtype={'select'}
              loading={loading.updateCarBanAuthSettingLoading}
            >
              保存并更新
            </Button>
            <Button
              onClick={this.onReset}
              customtype={'reset'}
              style={{ marginLeft: 10 }}
              loading={loading.getCarBanAuthSettingLoading}
            >
              重置
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const { loading } = this.props;
    return (
      <div className={classNames('height100', 'flexColStart')}>
        <div className={classNames(styles.content, 'flexColStart')}>
          <div className={styles.header}>道闸授权配置管理</div>
          <Spin spinning={loading.getCarBanAuthSettingLoading}>
            <div className={styles.form}>{this.renderForm()}</div>
          </Spin>
        </div>
      </div>
    );
  }

  getCarBanAuthSettingData = Fileds => {
    const { dispatch } = this.props;
    dispatch({ type: 'carGlobal/getCarBanAuthSetting', payload: { ...Fileds } });
  };

  onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (e) {
      e.preventDefault();
    }
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.onUpdateCarBanAuthSetting(fieldsValue);
      // for (const item in fieldsValue) {
      //   if (fieldsValue.hasOwnProperty(item)) {
      //     fieldsValue[item] = fieldsValue[item] === -1 ? undefined : fieldsValue[item];
      //   }
      // }
    });
  };

  onAuthStateChange = checked => {
    this.setState({
      authState: checked,
    });
  };

  onReset = () => {
    const { carBanAuthSettingData } = this.props;
    this.setState({
      authState: carBanAuthSettingData.authState,
    });
    this.props.form.resetFields();
  };

  onUpdateCarBanAuthSetting = fieldsValue => {
    const { dispatch } = this.props;
    dispatch({
      type: 'carBanAuthSetting/updateCarBanAuthSetting',
      payload: fieldsValue,
    }).then(() => this.getCarBanAuthSettingData({}));
  };
}

export default Form.create<CarBanAuthSettingProps>()(CarBanAuthSetting);
