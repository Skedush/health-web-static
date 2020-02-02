import React, { Component } from 'react';
import classNames from 'classnames';
import { connect } from '@/utils/decorators';
import { GlobalState, UmiComponentProps } from '@/common/type';
import styles from './index.less';
import { Form, Radio, Button, Message, Select, RadioGroup } from '@/components/Library';
import { SUCCESS_SETTING } from '@/utils/message';
import { FormComponentProps } from '@/components/Library/type';

const mapStateToProps = (state: GlobalState) => {
  return { state };
};

interface VisitConfigProps extends FormComponentProps, UmiComponentProps {}

interface VisitConfigState {
  auto: number;
  transitLimitTime: number;
  loading: boolean;
}
@connect(
  mapStateToProps,
  null,
)
class VisitConfig extends Component<VisitConfigProps, VisitConfigState> {
  numberList: number[] = Array(24)
    .fill(1)
    .map((v, index) => index + 1);

  constructor(props: VisitConfigProps) {
    super(props);
    this.state = {
      auto: 0,
      transitLimitTime: 0,
      loading: false,
    };
  }

  componentDidMount() {
    this.getDefaultData();
  }

  async getDefaultData() {
    const data = await this.props.dispatch({ type: 'visitConfig/getConfigData' });
    this.setState({
      auto: data.auto,
      transitLimitTime: +data.transitLimitTime,
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { auto, transitLimitTime, loading } = this.state;
    return (
      <div className={classNames('height100')}>
        <div className={styles.body}>
          <div className={styles.header}>访客规则配置</div>
          <div className={styles.content}>
            <form className={styles.form}>
              <Form.Item label={'自动授权开关'} labelCol={{ span: 5 }} wrapperCol={{ span: 14 }}>
                {getFieldDecorator('auto', {
                  initialValue: auto,
                  rules: [{ required: true, message: '自动开关是必选的' }],
                })(
                  <RadioGroup>
                    <Radio value={1} className={styles.fontColor}>
                      开启
                    </Radio>
                    <Radio value={0} className={styles.fontColor}>
                      关闭
                    </Radio>
                    <p className={styles.tipColor}>
                      自动授权开启则访客人员按照默认配置自动发放大门门禁权限
                    </p>
                  </RadioGroup>,
                )}
              </Form.Item>
              <Form.Item label={'通行时间(小时)'} labelCol={{ span: 5 }} wrapperCol={{ span: 14 }}>
                {getFieldDecorator('transitLimitTime', {
                  initialValue: transitLimitTime,
                  rules: [{ required: true, message: '通行时间不能为空(小时)' }],
                })(
                  <Select placeholder={'通行时间'}>
                    {this.numberList.map(v => (
                      <Select.Option key={v} value={v}>
                        {v}
                      </Select.Option>
                    ))}
                  </Select>,
                )}
              </Form.Item>
              <br />
              <Button
                className={styles.button}
                loading={loading}
                onClick={this.onSubmit}
                customtype={'select'}
              >
                保存
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  onSubmit = () => {
    const { form, dispatch } = this.props;
    form.validateFieldsAndScroll(async (error, values) => {
      if (error) {
        return;
      }
      values.transitLimitTime = +values.transitLimitTime;
      this.setState({ loading: true });
      const data = await dispatch({ type: 'visitConfig/updateConfig', data: values });
      if (data.success) {
        Message.success(SUCCESS_SETTING);
      }
      this.getDefaultData();
      this.setState({ loading: false });
    });
  };
}

export default Form.create()(VisitConfig);
