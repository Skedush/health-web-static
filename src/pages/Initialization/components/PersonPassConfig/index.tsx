import React, { PureComponent } from 'react';
import styles from './index.less';
import { connect } from '@/utils/decorators';
// import { FormComponentProps } from '@/components/Library/type';
import { GlobalState } from '@/common/type';
import Button from '@/components/Library/Button';
import { Form, Checkbox, Switch } from '@/components/Library';
import { FormComponentProps } from '@/components/Library/Form';
import classNames from 'classnames';
import PermitForm from '@/pages/Dashboard/Device/Permit/components/PermitForm';

const mapStateToProps = (state: GlobalState) => {
  return {};
};

// type PersonPassConfiogStateProps = ReturnType<typeof mapStateToProps>;
// type PersonPassConfiogProps = PersonPassConfiogStateProps & UmiComponentProps & FormComponentProps;

interface PersonPassConfiogState {
  enabledAccess: boolean;
  showForm: boolean;
  showErrorMsg: boolean;
  formTreeData: any[];
  dataSource: any[];
}

@connect(
  mapStateToProps,
  null,
)
class PersonPassConfiog extends PureComponent<any, PersonPassConfiogState> {
  constructor(props) {
    super(props);
    this.state = {
      formTreeData: [],
      dataSource: [],
      enabledAccess: true,
      showForm: true,
      showErrorMsg: false,
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
          type={'person'}
        />
      </div>
    );
  }

  renderPersonPassConfig() {
    const { enabledAccess } = this.state;
    return Form.create()((props: FormComponentProps) => {
      const { getFieldDecorator, validateFields } = props.form;
      const formItemLayout = {
        labelCol: { span: 10 },
        wrapperCol: { span: 14 },
      };
      return (
        <Form {...formItemLayout} className={styles.accessForm}>
          <div className={styles.formTitle}>门禁设置</div>
          <div className={styles.formFields}>
            <Form.Item label={'门禁权限'}>
              {getFieldDecorator('authState', {
                initialValue: enabledAccess,
                rules: [{ required: true, message: '选择是否启用' }],
              })(<Switch checked={enabledAccess} onChange={this.isEnabledAccess} />)}
            </Form.Item>
            {enabledAccess && (
              <Form.Item label={'门禁类型(多选)'}>
                {getFieldDecorator('passWay', {
                  initialValue: ['1', '2'],
                  rules: [{ required: true, message: '请选择门禁类型' }],
                })(
                  <Checkbox.Group
                    options={[{ value: '1', label: '人脸门禁' }, { value: '2', label: 'IC卡门禁' }]}
                  />,
                )}
              </Form.Item>
            )}
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
    const ConfigForm = this.renderPersonPassConfig();
    const { showForm, showErrorMsg } = this.state;
    return (
      <div className={styles.personPermit}>
        {this.renderTable()}
        {showForm && <ConfigForm />}

        {!showForm && (
          <div className={classNames(styles.submitBtn, 'flexCenter', 'itemCenter')}>
            <Button customtype={'master'} onClick={this.onStepNext} className={styles.nextButton}>
              下一步
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
      data: { type: 1 },
    });
    const treeData = await this.props.dispatch({
      type: 'permit/getPositionList',
      data: { type: '1' },
    });
    this.setState({
      formTreeData: treeData,
    });
    this.setState({
      dataSource: data,
      showErrorMsg: false,
    });
  }

  isEnabledAccess = value => {
    this.setState({
      enabledAccess: value,
    });
  };

  confirmAccess = async validateFields => {
    try {
      const result = await validateFields();
      await this.props.dispatch({ type: 'init/updateDoorBanAuthSetting', payload: result });
      if (result.authState) {
        this.setState({
          showForm: false,
        });
      } else {
        this.onStepNext();
      }
    } catch (error) {}
  };

  onStepNext = () => {
    if (!this.state.showForm && !this.state.dataSource.length) {
      this.setState({
        showErrorMsg: true,
      });
    } else {
      if (this.props.onStepNext) {
        this.props.onStepNext();
        this.props.onFormNext();
      }
      this.setState({
        showErrorMsg: false,
      });
    }
  };

  addPermit = () => {};
}
export default PersonPassConfiog;
