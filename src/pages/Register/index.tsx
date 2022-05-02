import React, { PureComponent } from 'react';
import { connect } from '@/utils/decorators';
import { GlobalState, UmiComponentProps } from '@/common/type';
import classNames from 'classnames';
import { FormComponentProps } from '@/components/Library/type';
import { Button, Input, Form, Message, RadioGroup, Radio } from '@/components/Library';
import Config from '@/utils/config';
const { detailDomain } = Config;

const mapStateToProps = (state: GlobalState) => ({});

type StateProps = ReturnType<typeof mapStateToProps>;
interface LoginProps extends StateProps, UmiComponentProps, FormComponentProps {}

@connect(
  mapStateToProps,
  null,
)
class Login extends PureComponent<LoginProps> {
  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <div className={classNames('flexCenter', 'height100', 'itemCenter')}>
        <div className={classNames()}>
          <Form onSubmit={this.onRegister} layout={'vertical'}>
            <Form.Item>
              {getFieldDecorator('username', {
                rules: [
                  { required: true, message: '用户名不能为空!' },
                  { min: 2, message: '用户名长度太短!' },
                ],
              })(<Input placeholder={'请输入用户名'} />)}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('password', {
                rules: [
                  { required: true, message: '密码不能为空!' },
                  { min: 4, message: '请输入最少4位密码!' },
                ],
              })(<Input type={'password'} placeholder={'请输入密码'} />)}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('rePassword', {
                rules: [
                  { required: true, message: '密码不能为空!' },
                  { min: 4, message: '请输入最少4位密码!' },
                ],
              })(<Input type={'password'} placeholder={'请再次输入密码'} />)}
            </Form.Item>

            <Form.Item>
              {getFieldDecorator('gender', {
                initialValue: 1,
                rules: [{ required: true, message: '性别不能为空!' }],
              })(
                <RadioGroup>
                  <Radio key={1} value={1}>
                    男
                  </Radio>
                  <Radio key={0} value={0}>
                    女
                  </Radio>
                </RadioGroup>,
              )}
            </Form.Item>

            <Form.Item>
              {getFieldDecorator('title')(<Input placeholder={'自定义填表表名'} />)}
              <div style={{ color: '#ccc' }}>用户填表的表名称，目前修改需要联系管理员</div>
            </Form.Item>

            <Button customtype={'master'} htmlType={'submit'}>
              注册
            </Button>
            <div style={{ color: '#ccc' }}>注册成功后需要管理员审核后才能登录使用</div>
          </Form>
        </div>
        {/* <div className={styles.loginBottom}>LIDIG Science and technology information co. LTD</div> */}
      </div>
    );
  }

  onRegister = e => {
    if (e) {
      e.preventDefault();
    }
    const { dispatch, form } = this.props;
    const { validateFieldsAndScroll } = form;
    validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return;
      }
      const { password, rePassword } = values;
      if (password !== rePassword) {
        Message.error('两次密码输入不一致');
        return;
      }
      delete values.rePassword;
      values.groups = [];
      values.is_active = false;
      values.last_name = detailDomain;
      values.user_permissions = [];
      dispatch({ type: 'user/createUser', payload: values });
    });
  };
}

export default Form.create<LoginProps>()(Login);
