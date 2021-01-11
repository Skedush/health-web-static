import React, { PureComponent } from 'react';
import { connect } from '@/utils/decorators';
import classNames from 'classnames';
import { FormComponentProps, WrappedFormUtils } from '@/components/Library/type';
import { GlobalState, UmiComponentProps } from '@/common/type';
import { FormSimple, Message } from '@/components/Library';
import styles from './index.less';
import store from 'store';
import { router } from '@/utils';

const mapStateToProps = ({ user, loading: { effects } }: GlobalState) => {
  return {
    updateUserLoading: effects['user/updatePasswordAndUsername'],
  };
};

type UserStateProps = ReturnType<typeof mapStateToProps>;
type UserProps = UserStateProps & UmiComponentProps & FormComponentProps;

interface UserState {}

@connect(
  mapStateToProps,
  null,
)
class User extends PureComponent<UserProps, UserState> {
  form: WrappedFormUtils;

  constructor(props: Readonly<UserProps>) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const userInfo = store.get('userInfo');
    if (!userInfo || !userInfo.username) {
      Message.error('请先登录');
      router.replace('/');
    }
  }

  renderTitle() {
    return <div className={classNames(styles.title)}>修改账号密码</div>;
  }

  render() {
    return (
      <div className={classNames('height100', 'flexColCenter', 'itemCenter', styles.container)}>
        {this.renderTitle()}
        <FormSimple {...this.getUserFormProps()} />
      </div>
    );
  }

  getUserFormProps = () => {
    const { updateUserLoading } = this.props;
    const userInfo = store.get('userInfo');
    return {
      items: [
        {
          type: 'input',
          field: 'username',
          disabled: true,
          autoComplete: 'new-password',
          placeholder: '用户名',
          initialValue: userInfo ? userInfo.username : '',
          rules: [{ required: true, message: '请输入用户名!' }],
          fill: true,
        },
        {
          type: 'password',
          field: 'password',
          autoComplete: 'new-password',
          placeholder: '新密码',
          rules: [{ required: true, message: '请输入新密码!' }],
          fill: true,
        },
        {
          type: 'password',
          field: 'reNewPassword',
          autoComplete: 'new-password',
          placeholder: '再次输入新密码',
          fill: true,
          rules: [
            { required: true, message: '请再次输入新密码!' },
            { validator: this.secondPwdValidator },
          ],
        },
      ],

      className: styles.form,
      onGetFormRef: this.onGetFormRef,
      onSubmit: this.onFormSubmit,
      actions: [
        {
          customtype: 'select',
          loading: updateUserLoading,
          title: '提交',
          htmlType: 'submit' as 'submit',
        },
      ],
    };
  };

  secondPwdValidator = (rule, value, callback) => {
    const newPwd = this.form.getFieldValue('password');
    if (newPwd && newPwd !== value) {
      callback(new Error('新密码不一致！'));
    } else {
      callback();
    }
  };

  onGetFormRef = (form: WrappedFormUtils) => {
    this.form = form;
  };

  onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (e) {
      e.preventDefault();
    }
    this.form.validateFields(async (err, fieldsValue) => {
      if (err) return;
      const userInfo = store.get('userInfo');
      if (!userInfo) {
        Message.error('请先登录');
        router.replace('/');
        return;
      }
      fieldsValue.id = userInfo.id;
      console.log('fieldsValue: ', fieldsValue);
      const res = await this.props.dispatch({
        type: 'user/updatePasswordAndUsername',
        payload: fieldsValue,
      });
      if (res && res.success) {
        Message.success('修改成功');
        router.replace('/dashboard/home');
      }
    });
  };
}

export default User;
