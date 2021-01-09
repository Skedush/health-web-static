import React, { PureComponent } from 'react';
import { connect } from '@/utils/decorators';
import classNames from 'classnames';
import { FormComponentProps, WrappedFormUtils } from '@/components/Library/type';
import { GlobalState, UmiComponentProps } from '@/common/type';
import { FormSimple, Message } from '@/components/Library';
import styles from './index.less';
import { router } from '@/utils';

const mapStateToProps = ({ title, loading: { effects } }: GlobalState) => {
  return {
    titleDetail: title.titleDetail,
    updateTitleLoading: effects['title/updateTitle'],
    getTitleDetailLoading: effects['title/getTitleDetail'],
  };
};

type TitleStateProps = ReturnType<typeof mapStateToProps>;
type TitleProps = TitleStateProps & UmiComponentProps & FormComponentProps;

interface TitleState {}

@connect(
  mapStateToProps,
  null,
)
class Title extends PureComponent<TitleProps, TitleState> {
  form: WrappedFormUtils;

  constructor(props: Readonly<TitleProps>) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { dispatch } = this.props;
    if (this.props.match.params) {
      dispatch({
        type: 'title/getTitleDetail',
        payload: { id: this.props.match.params.id },
      });
    }
  }

  renderTitle() {
    return <div className={classNames(styles.title)}>修改副标题</div>;
  }

  render() {
    return (
      <div className={classNames('height100', 'flexColCenter', 'itemCenter', styles.container)}>
        {this.renderTitle()}
        <FormSimple {...this.getTitleFormProps()} />
      </div>
    );
  }

  getTitleFormProps = () => {
    const { titleDetail } = this.props;
    return {
      items: [
        {
          type: 'input',
          field: 'title_name',
          span: 24,
          maxLength: 15,
          placeholder: '请输入副标题',
          initialValue: titleDetail ? titleDetail.title_name : '',
          label: ' ',
          rules: [{ required: true, message: '副标题不能为空' }],
        },
      ],

      className: styles.form,
      onGetFormRef: this.onGetFormRef,
      onSubmit: this.onFormSubmit,
      actions: [
        {
          customtype: 'select',
          title: '提交',
          htmlType: 'submit' as 'submit',
        },
      ],
    };
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
      const { titleDetail } = this.props;
      fieldsValue.id = titleDetail.id;
      console.log('fieldsValue: ', fieldsValue);
      const res = await this.props.dispatch({
        type: 'title/updateTitle',
        payload: fieldsValue,
      });
      if (res && res.success) {
        Message.success('提交成功');
        router.replace('/dashboard/home');
      }
    });
  };
}

export default Title;
