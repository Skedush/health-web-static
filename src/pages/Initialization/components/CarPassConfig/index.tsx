import React, { PureComponent } from 'react';
import styles from './index.less';
import { connect } from '@/utils/decorators';
// import classNames from 'classnames';
import { FormComponentProps } from '@/components/Library/type';
import { GlobalState, UmiComponentProps } from '@/common/type';
import PermitForm from '@/pages/Dashboard/Device/Permit/components/PermitForm';
import Form from '@/components/Library/Form';
import classNames from 'classnames';
import { Button, Switch } from '@/components/Library';
import { router } from '@/utils';

const mapStateToProps = (state: GlobalState) => {
  return {};
};

type CarPassConfigStateProps = ReturnType<typeof mapStateToProps>;
type CarPassConfigProps = CarPassConfigStateProps & UmiComponentProps & FormComponentProps;

interface CarPassConfigState {
  showForm: boolean;
  showErrorMsg: boolean;
  formTreeData: any[];
  dataSource: any[];
}

@connect(
  mapStateToProps,
  null,
)
class CarPassConfig extends PureComponent<any, CarPassConfigState> {
  constructor(props: Readonly<CarPassConfigProps>) {
    super(props);
    this.state = {
      showForm: true,
      showErrorMsg: false,
      formTreeData: [],
      dataSource: [],
    };
  }

  componentDidMount() {
    this.getList();
  }

  renderTable() {
    const { formTreeData, dataSource } = this.state;
    return (
      <div className={styles.listContainer}>
        <PermitForm
          initialzation
          getList={() => this.getList()}
          treeData={formTreeData}
          dataSource={dataSource}
          type={'car'}
        />
      </div>
    );
  }

  renderCarPassConfig() {
    return Form.create()((props: FormComponentProps) => {
      const { getFieldDecorator, validateFields } = props.form;
      const formItemLayout = {
        labelCol: { span: 10 },
        wrapperCol: { span: 14 },
      };
      return (
        <Form {...formItemLayout} className={styles.accessForm}>
          <div className={styles.formTitle}>车辆道闸设置</div>
          <div className={styles.formFields}>
            <Form.Item label={'道闸权限'}>
              {getFieldDecorator('authState', {
                initialValue: false,
                rules: [{ required: true, message: '选择是否启用' }],
              })(<Switch />)}
            </Form.Item>
          </div>
          <div className={classNames(styles.submitBtn, 'flexCenter', 'itemCenter')}>
            <Button
              customtype={'master'}
              onClick={() => this.confirmAccess(validateFields)}
              style={{ width: 200 }}
            >
              下一步
            </Button>
          </div>
        </Form>
      );
    });
  }

  render() {
    const ConfigForm = this.renderCarPassConfig();
    const { showForm, showErrorMsg } = this.state;
    return (
      <div className={styles.carPass}>
        {this.renderTable()}
        {showForm && <ConfigForm />}

        {!showForm && (
          <div className={classNames(styles.submitBtn, 'flexCenter', 'itemCenter')}>
            <Button customtype={'master'} onClick={this.complete} className={styles.nextButton}>
              完成
            </Button>
          </div>
        )}
        {showErrorMsg && <div className={styles.red}>请添加至少一个通行证</div>}
      </div>
    );
  }

  async getList() {
    const data = await this.props.dispatch({
      type: 'permit/getPermitList',
      data: { type: 2 },
    });
    const treeData = await this.props.dispatch({
      type: 'permit/getPositionList',
      data: { type: '2' },
    });
    this.setState({
      formTreeData: treeData,
    });
    this.setState({
      dataSource: data,
      showErrorMsg: false,
    });
  }

  confirmAccess = async validateFields => {
    try {
      const result = await validateFields();
      await this.props.dispatch({ type: 'init/updateCarBanAuthSetting', payload: result });
      if (result.authState) {
        this.setState({
          showForm: false,
        });
      } else {
        this.complete();
      }
    } catch (error) {}
  };

  onStepNext = () => {
    if (!this.state.dataSource.length) {
      this.setState({
        showErrorMsg: true,
      });
    } else {
      if (this.props.onStepNext) {
      }
      this.setState({
        showErrorMsg: false,
      });
    }
  };

  complete = () => {
    this.props.dispatch({
      type: 'app/operateUsageGuide',
      visible: true,
    });
    router.push('/dashboard/home');
  };
}
export default CarPassConfig;
