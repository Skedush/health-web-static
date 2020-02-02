import React, { PureComponent, RefObject, createRef } from 'react';
import {
  Modal,
  Form,
  Button,
  Message,
  Confirm,
  Img,
  Tabs,
  Steps,
  OperatingResults,
} from '@/components/Library';
import { PersonBaseInfo } from '@/models/person';
import { connect } from '@/utils/decorators';
import { EPersonType } from '../PerosonForm';
import { SUCCESS_INPUT } from '@/utils/message';
import { AuthTimeForm } from '../PersonFormAuthTimeForm';
import AuthForm from '../PersonFormAuthForm';
import styles from './index.less';
import classNames from 'classnames';
import AntdIcon from '@/components/Library/Icon';
import passportImage from '@/assets/images/permit/passport.png';

const mapStateToProps = state => {
  return {
    state,
  };
};

interface State {
  visible: boolean;
  havePassway: boolean;
  personData: PersonBaseInfo;
  personType: EPersonType;
  currentStep: number;
  permitList: any[];
}

@connect(
  mapStateToProps,
  null,
  null,
  { forwardRef: true },
)
export class AuthTimeFormModal extends PureComponent<any, State> {
  personData: PersonBaseInfo;

  confirmRef: RefObject<Confirm>;

  authFormRef: RefObject<AuthForm>;

  permitListRef: AuthTimeForm;

  operateResultRef: RefObject<OperatingResults>;

  constructor(props) {
    super(props);
    this.operateResultRef = createRef();
    this.confirmRef = createRef();
    this.authFormRef = createRef();
    this.state = {
      visible: false,
      personData: {} as PersonBaseInfo,
      havePassway: true,
      currentStep: 0,
      permitList: [],
      personType: EPersonType.owner,
    };
  }

  async open(personData: PersonBaseInfo, pmPassCardAuthList = []) {
    this.personData = personData;
    if (this.authFormRef.current) {
      this.authFormRef.current.reset();
    }
    this.setDefaultTime(personData);
    this.setState({
      permitList: pmPassCardAuthList,
      visible: true,
      currentStep: 0,
    });
  }

  async setDefaultTime(personData: PersonBaseInfo) {
    if (personData) {
      this.setState(
        {
          personData,
        },
        () => {
          if (this.authFormRef.current) {
            this.authFormRef.current.setDefaultData(personData);
          }
        },
      );
    }
  }

  close = () => {
    this.setState({
      visible: false,
    });
  };

  submit = async () => {
    const { personData, currentStep } = this.state;
    const { success } = this.props;
    if (currentStep === 0 && this.authFormRef.current) {
      const data = await this.authFormRef.current.submit(personData);
      if (data) {
        if (success) {
          success();
        }
        Message.success(SUCCESS_INPUT);
        this.setState({
          currentStep: currentStep + 1,
          havePassway: true,
        });
      }
    } else if (currentStep === 1) {
      const data = await this.props.dispatch({
        type: 'permit/updatePersonPermit',
        data: { id: personData.licenceId },
      });
      if (data && !data.error) {
        success();
        this.close();
      } else if (this.operateResultRef.current) {
        this.operateResultRef.current.open(data);
      }
    }
  };

  preStep = async () => {
    await this.setDefaultTime(this.personData);
    this.setState({
      currentStep: this.state.currentStep - 1,
    });
  };

  renderFooter() {
    const { currentStep } = this.state;
    return (
      <div className={styles.footer}>
        <div>
          {currentStep === 1 && (
            <Button customtype={'master'} onClick={this.preStep}>
              上一步
            </Button>
          )}
        </div>
        <Button customtype={'master'} onClick={this.submit}>
          {currentStep === 1 ? '提交' : '下一步'}
        </Button>
      </div>
    );
  }

  renderTableItem(item) {
    return (
      <div className={classNames(styles.permitItem)} key={item.id}>
        <div className={styles.top}>
          <Img type={'others'} image={passportImage} className={styles.icon} />
          <div className={styles.name}>{item.name}</div>
        </div>
        <div className={styles.bottom}>
          <div className={styles.row}>
            <AntdIcon type={'pm-position'} className={styles.icon} />
            <div className={styles.rowContent}>
              {item.passPositionList.map(v => v.passPositionName + '，')}
            </div>
          </div>
          <div className={styles.row}>
            <AntdIcon type={'clock-circle'} theme={'filled'} className={styles.icon} />
            <div className={styles.rowContent}>
              {item.authStartDate}~{item.authEndDate}
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderPermitList() {
    // return <AuthTimeFormModal ref={} />
    return this.state.permitList.map(item => {
      return this.renderTableItem(item);
    });
  }

  renderAuthForm() {
    const { hiddenFaceCollect } = this.props;
    const { personData } = this.state;
    return (
      <AuthForm
        personData={personData}
        hiddenfaceCollect={hiddenFaceCollect}
        ref={this.authFormRef}
      />
    );
  }

  render() {
    const { visible, currentStep } = this.state;
    return (
      <div>
        <Modal
          visible={visible}
          footer={this.renderFooter()}
          onCancel={this.close}
          forceRender
          title={'更新通行证'}
        >
          <Confirm ref={this.confirmRef} />
          <OperatingResults ref={this.operateResultRef} />
          <Steps current={currentStep}>
            <Steps.Step title={'修改通行方式'} />
            <Steps.Step title={'下发通行证'} />
          </Steps>
          <Tabs hiddenTabButton activeKey={currentStep.toString()}>
            <Tabs.TabPane tab={'1'} key={'0'}>
              {this.renderAuthForm()}
            </Tabs.TabPane>
            <Tabs.TabPane tab={'2'} key={'1'}>
              {this.renderPermitList()}
            </Tabs.TabPane>
          </Tabs>
        </Modal>
      </div>
    );
  }
}

const AuthTimeModalFormInstance = Form.create<any>()(AuthTimeFormModal);

export default AuthTimeModalFormInstance;
