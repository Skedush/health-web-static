import React, { PureComponent, RefObject, createRef } from 'react';
// import { Modal } from '@/components/Library';
import AuthForm from '../PersonFormAuthForm';
import { connect } from '@/utils/decorators';
import { GlobalState } from '@/common/type';

const mapStateToProps = (state: GlobalState) => {
  return {
    state,
    idCardReaderLoading: state.loading.effects['person/readIdCard'],
    addIcCardLoading: state.loading.effects['person/addIcCard'],
    doorAuthConfig: state.carGlobal.doorBanAuthSettingData,
  };
};

interface State {
  visible: boolean;
  faceCollect: boolean;
  IcCardCollecet: boolean;
}

@connect(
  mapStateToProps,
  null,
  null,
  { forwardRef: true },
)
export default class ResubmitAuthModal extends PureComponent<any, State> {
  authFormRef: RefObject<AuthForm> = createRef();

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      IcCardCollecet: true,
      faceCollect: true,
    };
  }

  componentDidMount() {
    this.getGlobalConfig();
  }

  reset() {
    if (this.authFormRef.current) {
      this.authFormRef.current.reset();
    }
  }

  setDefaultValue(personData) {
    if (this.authFormRef.current) {
      this.authFormRef.current.setDefaultData(personData);
    }
  }

  async getGlobalConfig() {
    const { doorAuthConfig, dispatch } = this.props;
    let doorConfig = doorAuthConfig;
    if (!doorAuthConfig) {
      const [doorResConig] = await Promise.all([
        dispatch({ type: 'person/getDoorBanAuthSetting' }),
      ]);
      doorConfig = doorResConig;
    }
    const IcCardCollecet = doorConfig.passWay ? doorConfig.passWay.indexOf('2') > -1 : false;
    const faceCollect = doorConfig.passWay ? doorConfig.passWay.indexOf('1') > -1 : false;
    this.setState({
      faceCollect,
      IcCardCollecet,
    });
  }

  async submit() {
    const { personData } = this.props;
    console.log('personData: ', personData);
    if (this.authFormRef.current && personData) {
      return this.authFormRef.current.submit(personData);
    }
  }

  render() {
    const { dispatch, personData } = this.props;
    return (
      <div>
        <AuthForm ref={this.authFormRef} dispatch={dispatch} personData={personData} />
      </div>
    );
  }
}
