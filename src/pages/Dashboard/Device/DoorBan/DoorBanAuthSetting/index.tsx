import React, { PureComponent } from 'react';
import styles from './index.less';
import { connect } from '@/utils/decorators';
import classNames from 'classnames';
// import { isEmpty } from 'lodash';
import { Form, Button, Row, Col, Switch, Checkbox, Spin } from '@/components/Library';
import { FormComponentProps } from '@/components/Library/type';
import { GlobalState, UmiComponentProps, DictionaryEnum } from '@/common/type';

const { Item } = Form;
const mapStateToProps = ({ app, carGlobal, loading: { effects } }: GlobalState) => {
  return {
    doorBanAuthSettingData: carGlobal.doorBanAuthSettingData || {},
    doorAuthTimeCofig: app.dictionry[DictionaryEnum.DOOR_AUTH_TIME_CONFIG],
    // personType: app.dictionry[DictionaryEnum.PERSON_TYPE],
    doorBanPassWay: app.dictionry[DictionaryEnum.DOOR_BAN_PASS_WAY],
    doorBanPassType: app.dictionry[DictionaryEnum.DOOR_BAN_PASS_TYPE],
    loading: {
      getDoorBanAuthSettingLoading: effects['carGlobal/getDoorBanAuthSetting'],
      updateDoorBanAuthSettingLoading: effects['doorBanAuthSetting/updateDoorBanAuthSetting'],
    },
  };
};

type ColItem = { key: string; value: string; bigDoor: boolean; unitDoor: boolean };

type DoorBanAuthSettingStateProps = ReturnType<typeof mapStateToProps>;
type DoorBanAuthSettingProps = DoorBanAuthSettingStateProps &
  UmiComponentProps &
  FormComponentProps;

interface DoorBanAuthSettingState {
  authState: boolean;
}

@connect(
  mapStateToProps,
  null,
)
class DoorBanAuthSetting extends PureComponent<DoorBanAuthSettingProps, DoorBanAuthSettingState> {
  constructor(props: Readonly<DoorBanAuthSettingProps>) {
    super(props);
    this.state = {
      authState: props.doorBanAuthSettingData.authState,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    this.getDoorBanAuthSettingData({});
    dispatch({
      type: 'app/getDic',
      payload: {
        type: [
          DictionaryEnum.DOOR_AUTH_TIME_CONFIG,
          // DictionaryEnum.PERSON_TYPE,
          DictionaryEnum.DOOR_BAN_PASS_WAY,
          DictionaryEnum.DOOR_BAN_PASS_TYPE,
        ].toString(),
      },
    });
  }

  // eslint-disable-next-line max-lines-per-function
  renderForm() {
    const { getFieldDecorator } = this.props.form;
    const { authState } = this.state;
    const {
      doorBanAuthSettingData = {},
      // doorAuthTimeCofig = [],
      doorBanPassWay = [],
      // doorBanPassType = [],
      loading,
    } = this.props;
    // const setting = doorBanAuthSettingData.setting;

    // const options = doorAuthTimeCofig.map((item, index) => {
    //   const { key, value } = item;
    //   return (
    //     <Option key={key} value={key}>
    //       {value}
    //     </Option>
    //   );
    // });

    doorBanPassWay.forEach(item => {
      if (item.label) {
        return;
      }
      item.label = item.value + '';
      item.value = item.key + '';
    });
    return (
      <Form
        className={styles.AddOrEditForm}
        labelAlign={'right'}
        onSubmit={this.onSubmit}
        autoComplete={'off'}
      >
        <Row gutter={16}>
          <Col span={8}>
            <Item label={'门禁功能'} required>
              {getFieldDecorator('authState', {
                valuePropName: 'checked',
                initialValue: doorBanAuthSettingData.authState,
                // rules: [{ required: true }],
              })(<Switch onChange={this.onAuthStateChange} />)}
              <div className={styles.remake}>门禁功能开启时，登记人员时需采集通行方式</div>
            </Item>
          </Col>
          <Col span={8}>
            <Item label={'通行方式配置'}>
              {getFieldDecorator('passWay', {
                initialValue: doorBanAuthSettingData.passWay,
                rules: [{ required: this.state.authState, message: '通行方式必选一项！' }],
                validateTrigger: ['onSubmit', 'onChange'],
              })(<Checkbox.Group options={doorBanPassWay} disabled={!authState} />)}
              <div className={styles.remake}>请选择通行方式采集内容（多选）</div>
            </Item>
          </Col>
          {/* <Col span={8}>
            <Item label={'自动授权'} required>
              {getFieldDecorator('autoAuth', {
                valuePropName: 'checked',
                initialValue: doorBanAuthSettingData.autoAuth,
                // rules: [{ required: true }],
              })(<Switch disabled={!authState} />)}
              <div className={styles.remake}>自动授权开启则新增人员按照默认配置自动发放权限</div>
            </Item>
          </Col> */}
        </Row>
        {/* {setting.map((items, index) => {
          const label = doorBanPassType.find(function(item) {
            return item.key === items.key;
          });
          if (!label) return null;
          return (
            <Row gutter={16} key={index}>
              {getFieldDecorator(`key${items.key}`, {
                initialValue: items.key,
                rules: [{ required: true }],
              })(<Input hidden />)}
              <Col span={8}>
                <Item label={label.value}>
                  {getFieldDecorator(`time${items.key}`, {
                    initialValue: items.value,
                    rules: [{ required: true }],
                  })(
                    <Select placeholder={'授权时间'} disabled={!authState}>
                      {options}
                    </Select>,
                  )}
                </Item>
              </Col>
              {items.bigDoor !== undefined && (
                <Col span={3}>
                  <Item label={'授权设备类型'}>
                    {getFieldDecorator(`bigDoor${items.key}`, {
                      valuePropName: 'checked',
                      initialValue: items.bigDoor === true,
                      rules: [{ required: true }],
                    })(<Checkbox disabled={!authState}>大门门禁</Checkbox>)}
                  </Item>
                </Col>
              )}
              {items.unitDoor !== undefined && (
                <Col span={8}>
                  <Item label={'授权设备类型'}>
                    {getFieldDecorator(`unitDoor${items.key}`, {
                      valuePropName: 'checked',
                      initialValue: items.unitDoor === true,
                      rules: [{ required: true }],
                    })(<Checkbox disabled={!authState}>单元门禁</Checkbox>)}
                  </Item>
                </Col>
              )}
            </Row>
          );
        })} */}
        <Row>
          <Col span={16} className={styles.buttonCol}>
            <Button
              htmlType={'submit'}
              customtype={'select'}
              loading={loading.updateDoorBanAuthSettingLoading}
            >
              保存并更新
            </Button>
            <Button
              onClick={this.onReset}
              customtype={'reset'}
              style={{ marginLeft: 10 }}
              loading={loading.getDoorBanAuthSettingLoading}
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
          <div className={styles.header}>门禁授权配置管理</div>
          <Spin spinning={loading.getDoorBanAuthSettingLoading}>
            <div className={styles.form}>{this.renderForm()}</div>
          </Spin>
        </div>
      </div>
    );
  }

  onAuthStateChange = checked => {
    this.setState(
      {
        authState: checked,
      },
      () => {
        this.props.form.validateFields((err, fieldsValue) => {
          console.log('fieldsValue: ', fieldsValue);
          console.log('err: ', err);
        });
      },
    );
  };

  getDoorBanAuthSettingData = Fileds => {
    const { dispatch } = this.props;
    dispatch({ type: 'carGlobal/getDoorBanAuthSetting', payload: { ...Fileds } });
  };

  onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (e) {
      e.preventDefault();
    }
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) return;
      const setting: ColItem[] = [];
      // const { doorBanAuthSettingData = [] } = this.props;
      // doorBanAuthSettingData.setting.forEach(element => {
      //   const item: any = {
      //     key: fieldsValue[`key${element.key}`],
      //     value: fieldsValue[`time${element.key}`],
      //   };
      //   if (fieldsValue[`bigDoor${element.key}`] !== undefined) {
      //     item.bigDoor = fieldsValue[`bigDoor${element.key}`];
      //   }
      //   if (fieldsValue[`unitDoor${element.key}`] !== undefined) {
      //     item.unitDoor = fieldsValue[`unitDoor${element.key}`];
      //   }
      //   setting.push(item);
      // });
      const payload = {
        authState: fieldsValue.authState || false,
        passWay: fieldsValue.passWay || [],
        autoAuth: fieldsValue.autoAuth || false,
        setting,
      };
      this.onUpdateDoorBanAuthSetting(payload);
      // console.log('payload: ', payload);
    });
  };

  onReset = () => {
    const { doorBanAuthSettingData } = this.props;
    console.log('doorBanAuthSettingData: ', doorBanAuthSettingData);
    this.setState({
      authState: doorBanAuthSettingData.authState,
    });
    this.props.form.resetFields();
  };

  onUpdateDoorBanAuthSetting = fieldsValue => {
    const { dispatch } = this.props;
    dispatch({
      type: 'doorBanAuthSetting/updateDoorBanAuthSetting',
      payload: fieldsValue,
    }).then(() => this.getDoorBanAuthSettingData({}));
  };
}

export default Form.create<DoorBanAuthSettingProps>()(DoorBanAuthSetting);
