import React, { PureComponent } from 'react';
// import styles from './index.less';
import { connect } from '@/utils/decorators';
// import classNames from 'classnames';
import { WrappedFormUtils } from '@/components/Library/type';
import { GlobalState, UmiComponentProps } from '@/common/type';
import classNames from 'classnames';
import { FormSimple, Button } from '@/components/Library';
import styles from './index.less';
import StepTitle from '../StepTitle';

const mapStateToProps = ({ parkingGlobal }: GlobalState) => {
  return {
    parkingConfig: parkingGlobal.parkingConfig,
  };
};

type ParkingLotConfigStateProps = ReturnType<typeof mapStateToProps>;
type ParkingLotConfigProps = ParkingLotConfigStateProps &
  UmiComponentProps & {
    onFormNext: Function;
    onStepNext: Function;
  };

interface ParkingLotConfigState {
  isOpen: string;
}
interface KeyValue<K, V> {
  key: K;
  value: V;
}

@connect(
  mapStateToProps,
  null,
)
class ParkingLotConfig extends PureComponent<any, ParkingLotConfigState> {
  form: WrappedFormUtils;
  carCount: KeyValue<number, number>[] = Array(10)
    .fill(0)
    .map((v, index) => ({ key: index + 1, value: index + 1 }));
  constructor(props: Readonly<ParkingLotConfigProps>) {
    super(props);
    this.state = {
      isOpen: props.parkingConfig.state,
    };
  }

  async componentDidMount() {
    const data = await this.props.dispatch({ type: 'parkingGlobal/getParkingSetting' });
    if (data) {
      this.setState({
        isOpen: data.state,
      });
    }
  }

  renderButton() {
    const ButtonProps = { customtype: 'main', onClick: this.submit };
    return (
      <div className={classNames(styles.bottomButton, 'flexCenter', 'itemCenter')}>
        <Button {...ButtonProps}>下一步</Button>
      </div>
    );
  }

  renderForm() {
    let items: any = [
      {
        formItemLayout: {
          labelCol: { span: 4 },
          wrapperCol: { span: 20 },
        },
        type: 'radio',
        field: 'state',
        height: '50px',
        span: 18,
        initialValue: this.props.parkingConfig.state,
        onChange: this.onChangeOpen,
        children: [{ key: '1', value: '启用' }, { key: '0', value: '禁用' }],
        placeholder: '停车场',
        rules: [{ required: true, message: '请选择停车场是否开启' }],
      },
    ];
    if (this.state.isOpen === '1') {
      items = items.concat([
        {
          type: 'custom',
          height: '40px',
          render: getFieldDecorator => {
            return (
              <div className={classNames(styles.tip)}>
                在停车场功能启用时，车辆登记时，需增加选择停车场功能。
              </div>
            );
          },
        },
        {
          formItemLayout: {
            labelCol: { span: 4 },
            wrapperCol: { span: 4 },
          },
          type: 'select',
          span: 18,
          field: 'carLimit',
          initialValue: this.props.parkingConfig.carLimit,
          children: this.carCount,
          placeholder: '车位车辆限制',
          rules: [{ required: true, message: '请选择车位车辆限制数量' }],
        },
      ]);
    }
    const formProps = {
      items: items,
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

  render() {
    return (
      <div className={classNames('flexColStart', styles.content)}>
        <StepTitle title={'停车场设置'} />
        {this.renderForm()}
        {this.renderButton()}
      </div>
    );
  }

  onChangeOpen = e => {
    this.setState({
      isOpen: e.target.value,
    });
  };

  submit = () => {
    const { onFormNext, onStepNext } = this.props;
    this.form.validateFields(async (err, fieldsValue) => {
      if (!err) {
        fieldsValue.carLimit = fieldsValue.carLimit || 0;
        const res = await this.props.dispatch({
          type: 'parkingGlobal/updateParkingSetting',
          payload: fieldsValue,
        });
        if (res && res.success) {
          if (fieldsValue.state === '1') {
            onFormNext();
          } else {
            onFormNext();
            onFormNext();
            onStepNext();
          }
        }
      }
    });
  };
}
export default ParkingLotConfig;
