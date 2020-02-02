import React, { PureComponent, RefObject, createRef } from 'react';
import {
  Modal,
  Button,
  FormSimple,
  Steps,
  Tabs,
  Message,
  OperatingResults,
} from '@/components/Library';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { isPhone, isIdCard } from '@/utils/validater';
import AuthForm from '@/pages/Dashboard/BasicData/Person/components/PersonFormAuthForm';
import { connect } from '@/utils/decorators';
import { SUCCESS_ADD, SUCCESS_IMPOWER } from '@/utils/message';
import { GlobalState } from '@/common/type';
import { PersonBaseInfo } from '@/models/person';
import AuthTimeFormInstance, {
  AuthTimeForm,
} from '@/pages/Dashboard/BasicData/Person/components/PersonFormAuthTimeForm';
import { EPersonType } from '@/pages/Dashboard/BasicData/Person/components/PerosonForm';

export enum EOpenType {
  add = 'add',
  change = 'change',
  issued = 'issued',
}

enum EActiveKey {
  info = 'info',
  auth = 'auth',
  authTime = 'authTime',
}

interface State {
  msg: string;
  currentActivekey: EActiveKey;
  currentIndex: number;
  openType: EOpenType;
  licenceId: string;
}

interface Props {
  visible: boolean;
  onCancel: Function;
  addSuccess: Function;
  openType: EOpenType;
  modifyData: any;
  [key: string]: any;
}

const mapStateToProps = (state: GlobalState) => {
  return {
    state,
    loading: state.loading.effects['icCard/addIcCard'],
  };
};

@connect(
  mapStateToProps,
  null,
)
export default class IcCardForm extends PureComponent<Props, State> {
  static getDerivedStateFromProps(preProps: Props, preState: State) {
    if (!preProps.visible && preState.currentIndex) {
      console.log(preState.currentIndex, preState);
      return {
        currentActivekey: EActiveKey.info,
        currentIndex: 0,
      };
    }
    return null;
  }

  licenceId: string;

  personData: {
    personName: string;
    personPhone: string;
    personIdCard: string;
  };

  icCardId: string;

  icCards: string[];

  authFormRef: RefObject<AuthForm>;

  operateResultRef: RefObject<OperatingResults>;

  authTimeFormRef: AuthTimeForm;

  icCardForm: WrappedFormUtils;

  constructor(props) {
    super(props);
    this.authFormRef = createRef();
    this.operateResultRef = createRef();
    this.state = {
      msg: '',
      currentActivekey: EActiveKey.info,
      currentIndex: 0,
      openType: EOpenType.add,
      licenceId: '',
    };
  }

  renderForm() {
    const { modifyData, openType } = this.props;
    const props = {
      items: [
        {
          type: 'input',
          field: 'personName',
          initialValue: openType === EOpenType.add ? '' : modifyData ? modifyData.personName : '',
          span: 12,
          placeholder: '人员姓名',
        },
        {
          type: 'input',
          field: 'personPhone',
          span: 12,
          initialValue: openType === EOpenType.add ? '' : modifyData ? modifyData.personPhone : '',
          placeholder: '联系电话',
          rules: [{ validator: isPhone }],
        },
        {
          type: 'input',
          field: 'personIdCard',
          initialValue: openType === EOpenType.add ? '' : modifyData ? modifyData.personIdCard : '',
          span: 12,
          placeholder: '身份证号',
          rules: [{ validator: isIdCard }],
        },
      ],
      actions: [],
      onGetFormRef: (modelForm: WrappedFormUtils) => {
        this.icCardForm = modelForm;
      },
    };
    return <FormSimple {...props} />;
  }

  renderFooter() {
    const { currentActivekey } = this.state;
    const { loading, openType } = this.props;
    return (
      <>
        <Button customtype={'master'} onClick={this.submit} loading={loading}>
          {openType === EOpenType.change || currentActivekey === EActiveKey.authTime
            ? '确认'
            : '下一步'}
        </Button>
        <Button customtype={'second'} onClick={this.close}>
          关闭
        </Button>
      </>
    );
  }

  render() {
    const { currentActivekey, currentIndex, licenceId } = this.state;
    const { visible, dispatch, openType } = this.props;
    return (
      <Modal
        title={openType === EOpenType.change ? 'IC卡变更' : 'IC卡新增'}
        visible={visible}
        onCancel={this.close}
        footer={this.renderFooter()}
        destroyOnClose
        maskClosable={false}
        width={'40%'}
      >
        <OperatingResults ref={this.operateResultRef} />
        {openType === EOpenType.add && (
          <Steps size={'small'} current={currentIndex}>
            <Steps.Step title={'用户信息'} />
            <Steps.Step title={'采集IC卡'} />
            <Steps.Step title={'下发授权'} />
          </Steps>
        )}
        <Tabs hiddenTabButton defaultActiveKey={currentActivekey} activeKey={currentActivekey}>
          <Tabs.TabPane tab={'1'} key={'info'}>
            {this.renderForm()}
          </Tabs.TabPane>
          <Tabs.TabPane tab={'2'} key={'auth'}>
            <AuthForm
              hiddenfaceCollect
              ref={this.authFormRef}
              dispatch={dispatch}
              personId={''}
              showIcCard
              openType={'add'}
              limitMaxIcCard
              personData={{} as PersonBaseInfo}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab={'3'} key={'authTime'}>
            <AuthTimeFormInstance
              donotUpdateModal
              permitType={'person'}
              personData={{ licenceId } as PersonBaseInfo}
              personType={EPersonType.owner}
              isUnchecked
              wrappedComponentRef={ins => (this.authTimeFormRef = ins)}
              dispatch={dispatch}
            />
          </Tabs.TabPane>
        </Tabs>
      </Modal>
    );
  }

  nextStep = (key: EActiveKey) => {
    this.setState(
      {
        currentActivekey: key,
        currentIndex: 1 + this.state.currentIndex,
      },
      () => {
        console.log(22);
      },
    );
  };

  close = () => {
    const { onCancel } = this.props;
    if (onCancel) {
      onCancel();
    }
  };

  submit = async () => {
    const { addSuccess, openType, modifyData } = this.props;
    const { currentActivekey } = this.state;
    if (currentActivekey === EActiveKey.info) {
      this.icCardForm.validateFields(async (error, values) => {
        if (error) {
          return;
        }
        if (openType === EOpenType.change) {
          values.id = modifyData.id;
          await this.props.dispatch({
            type: 'icCard/updateIcCard',
            data: values,
          });
          this.close();
          addSuccess();
        } else {
          const data = await this.props.dispatch({
            type: 'icCard/addICCardLicence',
            data: values,
          });
          this.setState({
            licenceId: data,
          });
          this.licenceId = data;
        }
        this.personData = values;
        this.nextStep(EActiveKey.auth);
      });
    } else if (currentActivekey === EActiveKey.auth && this.authFormRef.current) {
      const icCards = this.authFormRef.current.validator();
      if (icCards && icCards.icCards) {
        this.icCards = icCards.icCards;
        const data = await this.props.dispatch({
          type: 'icCard/addIcCard',
          data: { ...this.personData, icCardNo: icCards.icCards, licenceId: this.state.licenceId },
        });
        if (data && data.error && this.operateResultRef.current) {
          this.operateResultRef.current.open(data);
        } else {
          addSuccess();
          Message.success(SUCCESS_ADD);
          this.nextStep(EActiveKey.authTime);
        }
      }
    } else if (currentActivekey === EActiveKey.authTime && this.authTimeFormRef) {
      const resData: any = await this.authTimeFormRef.submit();

      // if (data) {
      //   const requestData = {
      //     icCardNo: this.icCards,
      //     authorizeStartTime: data.time[0].format('YYYY-MM-DD HH:mm:ss'),
      //     authorizeEndTime: data.time[1].format('YYYY-MM-DD HH:mm:ss'),
      //   };
      //   const resData = await this.props.dispatch({
      //     type: 'icCard/iussedIcCardAuth',
      //     data: requestData,
      //   });
      // }
      if (resData && !resData.error) {
        this.close();
        addSuccess();
        Message.success(SUCCESS_IMPOWER);
      }
    }
  };
}
