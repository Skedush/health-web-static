import React, { PureComponent, createRef, RefObject } from 'react';
import { WrappedFormUtils } from '@/components/Library/type';
import moment from 'moment';
import { FormSimple, Modal, Confirm, Message } from '@/components/Library';
import { connect } from '@/utils/decorators';
import { SUCCESS_RENEWAL } from '@/utils/message';
import { GlobalState, UmiComponentProps, DictionaryEnum } from '@/common/type';

const mapStateToProps = ({ parkingGlobal, app, loading: { effects } }: GlobalState) => {
  return {
    personList: parkingGlobal.personList,
    parkingSellState: app.dictionry[DictionaryEnum.PARKING_SELL_STATE],
    loading: {
      renewParkingItemLoading: effects['parking/renewParkingItem'],
    },
  };
};

type ParkingRenewalModalStateProps = ReturnType<typeof mapStateToProps>;

type ParkingRenewalModalProps = UmiComponentProps &
  ParkingRenewalModalStateProps & {
    cancelModal: Function;
    getParkingItemDetail?: Function;
    reGetList: Function;
    modalVisible: boolean;
    timeLine: string[];
    parkingSpaceId: string;
  };
interface ParkingRenewalModalState {}
@connect(
  mapStateToProps,
  null,
)
class ParkingRenewalModal extends PureComponent<any, ParkingRenewalModalState> {
  modalForm: WrappedFormUtils;
  confirmRef: RefObject<Confirm> = createRef();

  constructor(props: Readonly<ParkingRenewalModalProps>) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'app/getDic',
      payload: { type: [DictionaryEnum.PARKING_SELL_STATE].toString() },
    });
  }

  render() {
    return (
      <Modal {...this.getParkingRenewalModalProps()}>
        <FormSimple {...this.getSellWayFormProps()} />
        <Confirm type={'warning'} ref={this.confirmRef} />
      </Modal>
    );
  }

  getParkingRenewalModalProps = () => {
    return {
      onCancel: () => {
        this.props.cancelModal();
      },
      visible: this.props.modalVisible,
      title: '续期',
      destroyOnClose: true,
      centered: true,
      footer: null,
      maskClosable: false,
      bodyStyle: {},
      width: '40%',
      wrapClassName: 'modal',
    };
  };

  getSellWayFormProps = () => {
    const { parkingSellState, timeLine, loading } = this.props;
    if (parkingSellState) {
      parkingSellState.forEach(item => {
        if (item.key === '1') {
          parkingSellState.splice(item, 1);
        }
      });
    }
    const timeBegin = moment(timeLine[1]) || moment();
    const items: any = [
      {
        type: 'label',
        span: 24,
        value: timeLine && timeLine[0] + '~' + timeLine[1],
        placeholder: '当前租赁时间',
      },
      {
        type: 'radio',
        label: '选择时间',
        field: 'timeSpan',
        span: 24,
        onChange: this.timeSpanChange,
        initialValue: 1,
        children: [
          { key: 1, value: '一个月' },
          { key: 3, value: '三个月' },
          { key: 6, value: '六个月' },
          { key: 12, value: '一年' },
        ],
      },
      {
        type: 'datePicker',
        span: 24,
        timeBegin: timeBegin,
        field: 'time',
        initialValue: timeLine ? moment(timeLine[1]).add('month', 1) : moment(),
        // showTime: { defaultValue: moment('00:00:00', 'HH:mm:ss') },
        label: '租赁时间',
        placeholder: '租赁时间',
        rules: [
          { required: true, message: '请输入租赁时间add!' },
          // {
          //   validator: endTimeAfterNow,
          // },
        ],
      },
    ];
    return {
      items: items,
      aciton: [],
      actions: [
        {
          customtype: 'second',
          title: '取消',
          onClick: this.props.cancelModal,
        },
        {
          customtype: 'select',
          loading: loading.renewParkingItemLoading,
          title: '完成',
          htmlType: 'submit' as 'submit',
        },
      ],
      onSubmit: this.onParkingSellSubmit,
      onGetFormRef: (modelForm: WrappedFormUtils) => {
        this.modalForm = modelForm;
      },
    };
  };

  timeSpanChange = event => {
    const { timeLine } = this.props;
    this.modalForm.setFieldsValue({
      time: moment(timeLine[1]).add('month', event.target.value),
    });
  };

  onParkingSellSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (e) {
      e.preventDefault();
    }
    this.modalForm.validateFields(async (err, fieldsValue) => {
      console.log(1);
      if (err) return;
      const { dispatch, timeLine } = this.props;
      fieldsValue.parkingSpaceId = this.props.parkingSpaceId;
      if (fieldsValue.time) {
        fieldsValue.startTime = moment(timeLine[0]).format('YYYY-MM-DD HH:mm:ss');
        fieldsValue.endTime = moment(fieldsValue.time).format('YYYY-MM-DD HH:mm:ss');
        delete fieldsValue.time;
      }
      const res = await dispatch({ type: 'parking/renewParkingItem', payload: fieldsValue });
      if (res && res.success) {
        Message.success(SUCCESS_RENEWAL);
        if (this.props.getParkingItemDetail) this.props.getParkingItemDetail();
        this.props.cancelModal();
        this.props.reGetList();
      }
      // this.onFormNext();
    });
  };
}
export default ParkingRenewalModal;
