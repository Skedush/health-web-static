import React, { PureComponent } from 'react';
import styles from './index.less';
import { connect } from '@/utils/decorators';
import store from 'store';
import classNames from 'classnames';
import { WrappedFormUtils } from '@/components/Library/type';
import { GlobalState, UmiComponentProps } from '@/common/type';
import StepTitle from '../StepTitle';
import { Button, FormSimple, OperatingResults } from '@/components/Library';

const mapStateToProps = ({ loading: { effects } }: GlobalState) => {
  return {
    loading: { batchAddBuild: effects['buildGlobal/batchAddBuild'] },
  };
};

type BuildingAndUnitConfigStateProps = ReturnType<typeof mapStateToProps>;
type BuildingAndUnitConfigProps = BuildingAndUnitConfigStateProps &
  UmiComponentProps & {
    onFormNext: Function;
  };

interface BuildingAndUnitConfigState {
  batchHandleResultsData: any;
  operatingResultsVisible: boolean;
  buildTypeIsNumber: number;
}

interface KeyValue<K, V> {
  key: K;
  value: V;
}

@connect(
  mapStateToProps,
  null,
)
class BuildingAndUnitConfig extends PureComponent<any, BuildingAndUnitConfigState> {
  form: WrappedFormUtils;
  buildCount: KeyValue<number, number>[] = Array(100)
    .fill(0)
    .map((v, index) => ({ key: index + 1, value: index + 1 }));
  constructor(props: Readonly<BuildingAndUnitConfigProps>) {
    super(props);
    this.state = {
      batchHandleResultsData: {},
      buildTypeIsNumber: store.get('buildNameType') || 1,
      operatingResultsVisible: false,
    };
  }

  componentDidMount() {}

  renderButton() {
    const { loading } = this.props;
    const ButtonProps = {
      customtype: 'main',
      onClick: this.submit,
      loading: loading.batchAddBuild,
    };
    return (
      <div className={classNames(styles.bottomButton, 'flexCenter', 'itemCenter')}>
        <Button {...ButtonProps}>下一步</Button>
      </div>
    );
  }

  renderForm() {
    const formProps = {
      items: [
        {
          type: 'custom',
          field: 'ownerName',
          render: getFieldDecorator => <StepTitle title={'楼栋设置'} />,
        },
        {
          formItemLayout: {
            labelCol: { span: 4 },
            wrapperCol: { span: 20 },
          },
          type: 'radio',
          field: 'codeType',
          span: 18,
          initialValue: this.state.buildTypeIsNumber || '1',
          onChange: this.buildTypeChange,
          children: [
            { key: 1, value: '数字正序（如：1栋）' },
            { key: 2, value: '英文正序（如：A栋）' },
          ],
          placeholder: '楼栋编号',
          rules: [{ required: true, message: '请选择楼栋编号类型' }],
        },
        {
          formItemLayout: {
            labelCol: { span: 4 },
            wrapperCol: { span: 4 },
          },
          type: 'select',
          span: 18,
          field: 'count',
          children: this.buildCount,
          placeholder: '楼栋数量',
          rules: [{ required: true, message: '请选择楼栋数量' }],
        },
        // {
        //   type: 'custom',
        //   field: 'ownerName',
        //   render: getFieldDecorator => <StepTitle title={'单元设置'} />,
        // },
        // {
        //   formItemLayout: {
        //     labelCol: { span: 4 },
        //     wrapperCol: { span: 20 },
        //   },
        //   type: 'radio',
        //   field: 'unit',
        //   span: 18,
        //   children: [
        //     { key: 1, value: '数字正序（如：1栋）' },
        //     { key: 2, value: '英文正序（如：A栋）' },
        //   ],
        //   placeholder: '单元编号',
        //   rules: [{ required: true, message: '请选择单元编号类型' }],
        // },
      ],
      formItemLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 },
      },
      className: styles.form,
      onGetFormRef: form => {
        this.form = form;
      },
    };
    return <FormSimple {...formProps} />;
  }

  renderOperatingResults() {
    const { operatingResultsVisible, batchHandleResultsData } = this.state;
    const props = {
      visible: operatingResultsVisible,
      onCancel: this.onCancelOperatingResults,
      data: batchHandleResultsData,
    };
    return <OperatingResults {...props} />;
  }

  render() {
    return (
      <div className={classNames('flexColStart', styles.content)}>
        {this.renderForm()}
        {this.renderButton()}
        {this.renderOperatingResults()}
      </div>
    );
  }

  buildTypeChange = e => {
    store.set('buildNameType', e.target.value);
    this.setState({
      buildTypeIsNumber: e.target.value,
    });
  };

  onCancelOperatingResults = () => {
    this.setState({ operatingResultsVisible: false });
  };

  submit = () => {
    const { onFormNext } = this.props;
    this.form.validateFields(async (err, fieldsValue) => {
      if (err) return;
      store.set('buildNameType', fieldsValue.codeType);
      const res = await this.props.dispatch({
        type: 'buildGlobal/batchAddBuild',
        payload: fieldsValue,
      });
      if (res && res.success) {
        onFormNext();
      }
    });
  };
}
export default BuildingAndUnitConfig;
