import React, { PureComponent } from 'react';
import { connect } from '@/utils/decorators';
import { GlobalState, UmiComponentProps } from '@/common/type';
import styles from './index.less';
import classNames from 'classnames';
import { FormComponentProps } from '@/components/Library/type';
import { Button, Input, Icon, Form } from '@/components/Library';

const mapStateToProps = ({ loading }: GlobalState) => ({
  loading,
});

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
          <Form onSubmit={this.onLogin} layout={'vertical'}>
            <Form.Item className={styles.formItem}>
              {getFieldDecorator('username', {
                rules: [{ required: true, message: '用户名不能为空!' }],
              })(
                <Input
                  className={styles.input}
                  prefix={<Icon type="pm-user" />}
                  placeholder={'请输入用户名'}
                />,
              )}
            </Form.Item>
            <Form.Item className={styles.formItem}>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: '密码不能为空!' }],
              })(
                <Input
                  className={styles.input}
                  prefix={<Icon type="pm-lock" />}
                  type={'password'}
                  placeholder={'请输入密码'}
                />,
              )}
            </Form.Item>
            <Button customtype={'master'} htmlType={'submit'}>
              登录
            </Button>
          </Form>
        </div>
        {/* <div className={styles.loginBottom}>LIDIG Science and technology information co. LTD</div> */}
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
      dispatch({ type: 'login/login', payload: values }).then(res => {});
    });
  };
}

export default Form.create<LoginProps>()(Login);
