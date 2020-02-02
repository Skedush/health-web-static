import React, { PureComponent } from 'react';
import { WrappedFormUtils } from '@/components/Library/type';
import { FormSimple, Modal } from '@/components/Library';
import { connect } from '@/utils/decorators';
import styles from './index.less';
import { GlobalState, UmiComponentProps, DictionaryEnum } from '@/common/type';

const mapStateToProps = ({ app }: GlobalState) => {
  return {
    carTypes: app.dictionry[DictionaryEnum.CAR_TYPE] || [],
  };
};

type CarTypeFormModalStateProps = ReturnType<typeof mapStateToProps>;

type CarTypeFormModalProps = UmiComponentProps &
  CarTypeFormModalStateProps & {
    cancelModel: Function;
    modalVisible: boolean;
    submitForm: Function;
    // visible: boolean;
  };
interface CarTypeFormModalState {}
@connect(
  mapStateToProps,
  null,
)
class CarTypeFormModal extends PureComponent<any, CarTypeFormModalState> {
  carTypeForm: WrappedFormUtils;

  constructor(props: Readonly<CarTypeFormModalProps>) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Modal {...this.getCarTypeModalProps()}>
        <FormSimple {...this.getCarTypeFormProps()} />
      </Modal>
    );
  }

  getCarTypeModalProps = () => {
    return {
      onCancel: this.props.cancelModel,
      visible: this.props.modalVisible,
      title: '车辆类型选择',
      destroyOnClose: true,
      centered: true,
      footer: null,
      maskClosable: false,
      bodyStyle: {},
      width: '50%',
      wrapClassName: styles.model,
    };
  };

  getCarTypeFormProps = () => {
    return {
      items: [
        {
          type: 'radio',
          field: 'type',
          span: 24,
          children: this.props.carTypes,
          placeholder: '',
          height: '50px',
          rules: [{ required: true, message: '车辆类型不能为空！' }],
        },
      ],
      actions: [
        { customtype: 'second', title: '取消', onClick: this.props.cancelModel },
        {
          customtype: 'select',
          title: '下一步',
          htmlType: 'submit' as 'submit',
        },
      ],
      onSubmit: this.onCarTypeFormSubmit,
      onGetFormRef: (modelForm: WrappedFormUtils) => {
        this.carTypeForm = modelForm;
      },
    };
  };

  onCarTypeFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (e) {
      e.preventDefault();
    }
    this.carTypeForm.validateFields((err, fieldsValue) => {
      if (err) return;
      this.props.submitForm(
        {
          owner: { id: null, name: null, phone: null },
          carType: fieldsValue.type,
          selectedRow: [],
          registerCarVisible: true,
        },
        () => {
          this.getPersonData({ page: 0, carType: fieldsValue.type });
          // this.onFormNext();
        },
      );
      this.props.cancelModel();
      // this.onFormNext();
    });
  };

  getPersonData = Fileds => {
    const { dispatch } = this.props;
    const payload = { ...Fileds };
    if (Fileds.carType === '1') {
      payload.isAdult = true;
    }
    dispatch({ type: 'carGlobal/getPersonTable', payload });
  };
}
export default CarTypeFormModal;
