import React, { PureComponent } from 'react';
import { connect } from '@/utils/decorators';
import { GlobalState, UmiComponentProps } from '@/common/type';
import styles from './index.less';
import { FormComponentProps } from '@/components/Library/type';
import { Button, Input, Icon, Form } from '@/components/Library';

const mapStateToProps = ({ loading, login: { displayPwd, currentlyfocus } }: GlobalState) => ({
  loading,
  displayPwd,
  currentlyfocus,
});

type StateProps = ReturnType<typeof mapStateToProps>;
interface LoginProps extends StateProps, UmiComponentProps, FormComponentProps {}

@connect(
  mapStateToProps,
  null,
)
class Login extends PureComponent<LoginProps> {
  render() {
    const { form, displayPwd, currentlyfocus } = this.props;
    const { getFieldDecorator } = form;

    return (
      <div className={styles.loginPage}>
        <div className={styles.title}>
          <div className={styles.titleIcon} />
          <label className={styles.titleName}>物业助手</label>
        </div>
        <div className={styles.loginBody}>
          <div className={styles.bodyImage} />
          <div className={styles.content}>
            <div className={styles.contentTop}>
              <div className={styles.contentTitle}>物业助手</div>
              <label className={styles.contentEn}>PROPERTY ASSISTANT</label>
            </div>
            <Form onSubmit={this.onLogin} className={styles.contentForm} layout={'vertical'}>
              <Form.Item className={styles.formItem}>
                {getFieldDecorator('userName', {
                  rules: [{ required: true, message: '用户名不能为空!' }],
                })(
                  <Input
                    className={styles.input}
                    onFocus={() => this.focusTypeChange('userName')}
                    onBlur={() => this.focusTypeChange(null)}
                    prefix={
                      <Icon
                        type="pm-user"
                        className={
                          currentlyfocus === 'userName' ? styles.inputIconFocus : styles.inputIcon
                        }
                      />
                    }
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
                    prefix={
                      <Icon
                        type="pm-lock"
                        className={
                          currentlyfocus === 'password' ? styles.inputIconFocus : styles.inputIcon
                        }
                      />
                    }
                    type={displayPwd ? 'text' : 'password'}
                    suffix={
                      <Icon
                        className={
                          currentlyfocus === 'password' ? styles.inputIconFocus : styles.inputIcon
                        }
                        type={displayPwd ? 'pm-eye' : 'pm-close-eyes'}
                        onClick={this.showPassword}
                      />
                    }
                    onFocus={() => this.focusTypeChange('password')}
                    onBlur={() => this.focusTypeChange(null)}
                    placeholder={'请输入密码'}
                  />,
                )}
              </Form.Item>
              <Button type={'primary'} htmlType={'submit'} className={styles.button}>
                登录
              </Button>
            </Form>
          </div>
        </div>
        <div className={styles.loginBottom}>LIDIG Science and technology information co. LTD</div>
      </div>
    );
  }

  focusTypeChange(type: 'userName' | 'password' | null) {
    this.props.dispatch({ type: 'login/focusState', focusType: type });
  }

  showPassword = () => {
    this.props.dispatch({ type: 'login/showPassword' });
  };

  onLogin = e => {
    if (e) {
      e.preventDefault();
    }
    const { dispatch, form } = this.props;
    const { validateFieldsAndScroll } = form;
    validateFieldsAndScroll((errors, values) => {
      console.log('values: ', values);
      if (errors) {
        return;
      }
      dispatch({ type: 'login/login', payload: values }).then(res => {
        if (res) {
          dispatch({ type: 'app/query' });
        }
      });
    });
  };
}

export default Form.create<LoginProps>()(Login);
