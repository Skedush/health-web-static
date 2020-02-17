/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */
/* eslint-disable no-dupe-class-members */
import React, { PureComponent } from 'react';
import { connect } from '@/utils/decorators';
import classNames from 'classnames';
import { FormComponentProps } from '@/components/Library/type';
import { GlobalState, UmiComponentProps, WrappedFormUtils } from '@/common/type';
import { FormSimple, Message } from '@/components/Library';
import styles from './index.less';
import { router } from '@/utils';

const mapStateToProps = ({ fillForm }: GlobalState) => {
  return {
    entryInfoDetail: fillForm.entryInfoDetail,
  };
};

type FillFormStateProps = ReturnType<typeof mapStateToProps>;
type FillFormProps = FillFormStateProps & UmiComponentProps & FormComponentProps;

interface FillFormState {
  id: string;
}

@connect(
  mapStateToProps,
  null,
)
class FillForm extends PureComponent<FillFormProps, FillFormState> {
  form: WrappedFormUtils;

  constructor(props: Readonly<FillFormProps>) {
    super(props);
    this.state = {
      id: '',
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    if (this.props.match.params) {
      this.setState(
        {
          id: this.props.match.params.id,
        },
        () => {
          dispatch({
            type: 'fillForm/getEntryInfoDetail',
            payload: { id: this.props.match.params.id },
          });
        },
      );
    }
  }

  render() {
    return (
      <div className={classNames('height100', 'flexColStart', 'itemCenter', styles.container)}>
        <div className={styles.title}>健康状况自检表</div>
        <FormSimple {...this.getHealthFormProps()} />
      </div>
    );
  }

  // eslint-disable-next-line max-lines-per-function
  getHealthFormProps = () => {
    const { entryInfoDetail } = this.props;
    const items: any = [
      {
        type: 'input',
        field: 'name',
        span: 24,
        // showSearch: true,
        // optionFilterProp: 'children',
        maxLength: 10,
        placeholder: '姓名',
        label: '',
        rules: [{ required: true, message: '姓名不能为空' }],
      },
      {
        type: 'input',
        field: 'phone',
        span: 24,
        // showSearch: true,
        // optionFilterProp: 'children',
        maxLength: 11,
        placeholder: '手机',
        label: '',
        rules: [{ required: true, message: '手机号不能为空' }],
      },
      {
        type: 'textArea',
        field: 'address',
        span: 24,
        maxLength: 255,
        placeholder: '地址',
        label: '',
      },
      {
        type: 'radio',
        field: 'gender',
        span: 12,
        // showSearch: true,
        // optionFilterProp: 'children',
        children: [{ key: '0', value: '女' }, { key: '1', value: '男' }],
        placeholder: '性别',
        label: '',
        rules: [{ required: true, message: '请选择性别' }],
        // onChange: this.onSearchSelectChange,
      },
      {
        type: 'input',
        field: 'age',
        span: 12,
        maxLength: 20,
        placeholder: '年龄',
        label: '',
      },
      {
        type: 'input',
        field: 'height',
        span: 12,
        maxLength: 6,
        placeholder: '身高cm',
        label: '',
      },
      {
        type: 'input',
        field: 'weight',
        span: 12,
        maxLength: 6,
        placeholder: '体重kg',
        label: '',
      },
      {
        type: 'input',
        field: 'waistline',
        span: 12,
        maxLength: 6,
        placeholder: '腰围cm',
        label: '',
      },
      {
        type: 'input',
        field: 'systolic_pressure',
        span: 12,
        maxLength: 6,
        placeholder: '收缩压mmHg',
        label: '',
      },
      {
        type: 'input',
        field: 'diastolic_pressure',
        span: 12,
        maxLength: 6,
        placeholder: '舒张压mmHg',
        label: '',
      },
      {
        type: 'input',
        field: 'blood_sugar',
        span: 12,
        maxLength: 6,
        placeholder: '血糖mmol/L',
        label: '',
      },
      {
        type: 'checkBoxGroup',
        field: 'entry_Ids',
        children: entryInfoDetail.entrys,
        span: 24,
        // onChange: this.onChange,
        label: '症状选择',
        rules: [{ required: true, message: '请选择症状' }],
      },
      {
        type: 'textArea',
        field: 'remark',
        span: 24,
        maxLength: 255,
        placeholder: '备注或其他症状',
        label: '',
      },
    ];
    return {
      items: items,
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
      console.log('fieldsValue: ', fieldsValue);
      fieldsValue.entry_info = this.state.id;
      const res = await this.props.dispatch({
        type: 'fillForm/addUserEntry',
        payload: fieldsValue,
      });
      if (res && res.success) {
        Message.success('提交成功');
        router.replace('/dashboard/success');
      }
    });
  };
}

export default FillForm;
