import { GlobalState, UmiComponentProps } from '@/common/type';
import { Button, Form, Icon, Input } from '@/components/Library';
import { FormComponentProps } from '@/components/Library/type';
import { connect } from '@/utils/decorators';
import classNames from 'classnames';
import React, { PureComponent } from 'react';
import Link from 'umi/link';
import styles from './index.less';

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
      <div className={classNames('flexColCenter', 'itemCenter', styles.container)}>
        <div className={styles.title}>健康管理系统</div>
        <div>
          <Form onSubmit={this.onLogin} layout={'vertical'}>
            <Form.Item>
              {getFieldDecorator('username', {
                rules: [{ required: true, message: '用户名不能为空!' }],
              })(<Input prefix={<Icon type={'pm-user'} />} placeholder={'请输入用户名'} />)}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: '密码不能为空!' }],
              })(
                <Input
                  prefix={<Icon type={'pm-lock'} />}
                  type={'password'}
                  placeholder={'请输入密码'}
                />,
              )}
            </Form.Item>
            <div className={'flexBetween itemCenter'}>
              <Button customtype={'master'} htmlType={'submit'}>
                登录
              </Button>
              <Link to={'/register'}>注册</Link>
            </div>
          </Form>
        </div>
        {/* <div className={styles.loginBottom}>Science and technology information co. LTD</div> */}
      </div>
    );
  }

  onLogin = e => {
    if (e) {
      e.preventDefault();
    }
    const { dispatch, form } = this.props;
    const { validateFieldsAndScroll } = form;
    validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return;
      }
      dispatch({ type: 'login/login', payload: values });
    });
  };
}

export default Form.create<LoginProps>()(Login);
