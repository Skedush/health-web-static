import React, { PureComponent, createRef, RefObject } from 'react';
import { WrappedFormUtils } from '@/components/Library/type';
import moment from 'moment';
import { FormSimple, Modal, Steps, Tabs, Confirm, Message, Spin } from '@/components/Library';
import { connect } from '@/utils/decorators';
import { GlobalState, UmiComponentProps, DictionaryEnum } from '@/common/type';
import PersonForm, { EPersonType } from '@/pages/Dashboard/BasicData/Person/components/PerosonForm';
import { SUCCESS_DELETE, SUCCESS_SELL } from '@/utils/message';
import HouseholdModal from '@/pages/Dashboard/Home/components/HouseholdModal';
// import { isChinese, isNumber } from '@/utils';
import { clone, debounce } from 'lodash';
import { endTimeAfterNow } from '@/utils/validater';
import classNames from 'classnames';
const { TabPane } = Tabs;

const mapStateToProps = ({ parkingGlobal, app, loading: { effects } }: GlobalState) => {
  return {
    personList: parkingGlobal.personList,
    parkingSellState: app.dictionry[DictionaryEnum.PARKING_SELL_STATE],
    loading: {
      getPersonListLoading: effects['parkingGlobal/getPersonList'],
      deleteParkingItemLoading: effects['parking/deleteParkingItem'],
      sellParkingItemLoading: effects['parking/sellParkingItem'],
    },
  };
};
const steps = ['车位租售', '租售方式'];

type ParkingSellModalStateProps = ReturnType<typeof mapStateToProps>;

type ParkingSellModalProps = UmiComponentProps &
  ParkingSellModalStateProps & {
    cancelModel: Function;
    reGetList: Function;
    modalVisible: boolean;
    parkingSpaceId: string;
    parkingCode: string;
  };
interface ParkingSellModalState {
  bindPersonInfo: any;
  addPersonModalVisible: boolean;
  tabsActiveKey: string;
  haveSearchValue: boolean;
  sellWay: string;
}
@connect(
  mapStateToProps,
  null,
)
class ParkingSellModal extends PureComponent<any, ParkingSellModalState> {
  modalForm: WrappedFormUtils;
  personFormRef: RefObject<PersonForm> = createRef();
  HouseholdRef: RefObject<HouseholdModal> = createRef();
  confirmRef: RefObject<Confirm> = createRef();
  // timeOut: NodeJS.Timeout;
  debounce: any;

  constructor(props: Readonly<ParkingSellModalProps>) {
    super(props);
    this.state = {
      addPersonModalVisible: false,
      bindPersonInfo: { name: null, phone: null, id: null },
      sellWay: '2',
      tabsActiveKey: '1',
      haveSearchValue: false,
    };
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'app/getDic',
      payload: { type: [DictionaryEnum.PARKING_SELL_STATE].toString() },
    });
  }

  renderNoData() {
    return <div className={classNames('flexColCenter', 'itemCenter')}>暂无数据</div>;
  }

  render() {
    return (
      <Modal {...this.getParkingSellModalProps()}>
        <Steps current={parseInt(this.state.tabsActiveKey) - 1}>
          {steps.map(item => (
            <Steps.Step key={item} title={item} />
          ))}
        </Steps>
        <Tabs hiddenTabButton={true} activeKey={this.state.tabsActiveKey}>
          <TabPane tab={steps[0]} key={'1'}>
            <FormSimple {...this.getSelectPersonFormProps()} />
          </TabPane>
          <TabPane tab={steps[1]} key={'2'}>
            <FormSimple {...this.getSellWayFormProps()} />
          </TabPane>
        </Tabs>
        <PersonForm personSuccess={() => {}} ref={this.personFormRef} />
        <HouseholdModal ref={this.HouseholdRef} />
        <Confirm type={'warning'} ref={this.confirmRef} />
      </Modal>
    );
  }

  addPerson = () => {
    if (this.HouseholdRef.current) {
      this.HouseholdRef.current.open(value => {
        if (this.personFormRef.current) {
          if (value === 'owner') {
            this.personFormRef.current.open('add', EPersonType.owner);
          } else if (value === 'property') {
            this.personFormRef.current.open('add', EPersonType.property);
          } else if (value === 'child') {
            this.personFormRef.current.open('add', EPersonType.child);
          } else if (value === 'temp') {
            this.personFormRef.current.open('add', EPersonType.temp);
          }
        }
      });
    }
  };

  onFormNext = () => {
    this.setState({
      tabsActiveKey: (parseInt(this.state.tabsActiveKey) + 1).toString(),
    });
  };

  onFormPre = () => {
    this.setState({
      tabsActiveKey: (parseInt(this.state.tabsActiveKey) - 1).toString(),
    });
  };

  getParkingSellModalProps = () => {
    return {
      onCancel: () => {
        this.props.cancelModel();
        this.reSetSellData();
      },
      visible: this.props.modalVisible,
      title: steps[parseInt(this.state.tabsActiveKey) - 1] + '(' + this.props.parkingCode + ')',
      destroyOnClose: true,
      centered: true,
      footer: null,
      maskClosable: false,
      bodyStyle: {},
      width: '50%',
      wrapClassName: 'modal',
    };
  };

  getSelectPersonFormProps = () => {
    const { personList, loading } = this.props;
    const personSelectOption: any = [];
    if (personList && personList.content) {
      personList.content.forEach(item => {
        personSelectOption.push({
          key: item.id,
          value: item.name + '|' + item.phone,
        });
      });
    }
    const items: any = [
      {
        type: 'select',
        field: 'search',
        span: 24,
        showSearch: true,
        optionFilterProp: 'children',
        children: personSelectOption,
        maxLength: 20,
        placeholder: '人员搜索',
        rules: [{ required: true, message: '车位绑定人员不能为空' }],
        onSearch: this.onSelectSearch,
        onChange: this.onSearchSelectChange,
        notFoundContent: loading.getPersonListLoading ? (
          <Spin size={'small'} />
        ) : this.state.haveSearchValue ? (
          this.renderNoData()
        ) : null,
      },
      // {
      //   type: 'label',
      //   span: 12,
      //   value: '张三',
      //   placeholder: '关联人员',
      // },
      // {
      //   type: 'label',
      //   span: 12,
      //   value: '15996969696',
      //   placeholder: '联系电话',
      // },
      {
        type: 'button',
        span: 4,
        customtype: 'master',
        onClick: this.addPerson,
        title: '添加人员',
      },
    ];
    return {
      items: items,
      actions: [
        // {
        //   customtype: 'warning',
        //   title: '删除',
        //   loading: loading.deleteParkingItemLoading,
        //   onClick: this.deleteParkingItem,
        // },
        {
          customtype: 'second',
          title: '取消',
          onClick: () => {
            this.props.cancelModel();
            this.reSetSellData();
          },
        },
        {
          customtype: 'select',
          title: '下一步',
          disabled: this.state.bindPersonInfo.id === null,
          htmlType: 'submit' as 'submit',
          onClick: this.onFormNext,
        },
      ],
    };
  };

  getSellWayFormProps = () => {
    const { sellWay, bindPersonInfo } = this.state;
    const { parkingSellState, loading } = this.props;
    const newParkingSellState = clone(parkingSellState);
    if (newParkingSellState) {
      newParkingSellState.forEach(item => {
        if (item.key === '1') {
          newParkingSellState.splice(item, 1);
        }
      });
    }
    const items: any = [
      {
        type: 'label',
        span: 12,
        value: bindPersonInfo.name,
        placeholder: '关联人员',
      },
      {
        type: 'label',
        span: 12,
        value: bindPersonInfo.phone,
        placeholder: '联系电话',
      },
      {
        type: 'select',
        field: 'saleState',
        span: 24,
        children: newParkingSellState,
        placeholder: '租售类型',
        onChange: this.onSellWaySelectChange,
        initialValue: sellWay,
        rules: [{ required: true, message: '车位租售类型不能为空' }],
      },
    ];
    if (sellWay === '3') {
      items.push({
        type: 'rangePicker',
        span: 24,
        field: 'time',
        label: '租赁时间',
        placeholder: ['开始时间', '结束时间'] as [string, string],
        rules: [
          { required: true, message: '请输入租赁时间!' },
          {
            validator: endTimeAfterNow,
          },
        ],
      });
    } else {
      items.push({
        type: 'label',
        field: 'time',
        span: 12,
        value: '永久',
        placeholder: '租赁时间',
      });
    }
    return {
      items: items,
      actions: [
        { customtype: 'second', title: '上一步', onClick: this.onFormPre },
        {
          customtype: 'select',
          title: '完成',
          loading: loading.sellParkingItemLoading,
          htmlType: 'submit' as 'submit',
        },
      ],
      onSubmit: this.onParkingSellSubmit,
      onGetFormRef: (modelForm: WrappedFormUtils) => {
        this.modalForm = modelForm;
      },
    };
  };

  deleteParkingItem = () => {
    if (this.confirmRef.current) {
      const { dispatch, parkingSpaceId } = this.props;
      this.confirmRef.current.open(
        async () => {
          const res = await dispatch({
            type: 'parking/deleteParkingItem',
            payload: [parkingSpaceId],
          });
          if (res && res.success) {
            Message.success(SUCCESS_DELETE);
            this.props.cancelModel();
            this.reSetSellData();
            this.props.reGetList();
          }
        },
        '请注意',
        '是否确认删除车位？',
      );
    }
  };

  onSellWaySelectChange = value => {
    this.setState({
      sellWay: value,
    });
  };

  onSearchSelectChange = (value, _item) => {
    const info = _item.props.children.split('|');
    this.setState({
      bindPersonInfo: { id: value, name: info[0], phone: info[1] },
    });
  };

  onSelectSearch = value => {
    if (this.debounce) {
      this.debounce.cancel();
    }
    if (value) {
      this.debounce = debounce(() => {
        this.setState({
          haveSearchValue: true,
        });
        this.getPersonList({ search: value });
      }, 300);
      this.debounce();
    } else {
      this.setState({
        haveSearchValue: false,
      });
      this.props.dispatch({
        type: 'parkingGlobal/updateState',
        payload: {
          personList: {},
        },
      });
    }

    // if (isChinese(value) && value.length >= 2) {
    //   this.getPersonList({ search: value });
    // } else if (isNumber(value) && value.length >= 8) {
    //   this.getPersonList({ search: value });
    // }
  };

  getPersonList = fields => {
    const { dispatch } = this.props;
    fields.page = 0;
    fields.size = 20;
    dispatch({ type: 'parkingGlobal/getPersonList', payload: fields });
  };

  onParkingSellSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (e) {
      e.preventDefault();
    }
    this.modalForm.validateFields(async (err, fieldsValue) => {
      if (err) return;
      const { dispatch } = this.props;
      fieldsValue.parkingSpaceId = this.props.parkingSpaceId;
      fieldsValue.personId = this.state.bindPersonInfo.id;
      if (fieldsValue.time) {
        fieldsValue.startTime = moment(fieldsValue.time[0]).format('YYYY-MM-DD HH:mm:ss');
        fieldsValue.endTime = moment(fieldsValue.time[1]).format('YYYY-MM-DD HH:mm:ss');
        delete fieldsValue.time;
      }
      const res = await dispatch({ type: 'parking/sellParkingItem', payload: fieldsValue });
      if (res && res.success) {
        Message.success(SUCCESS_SELL);
        this.reSetSellData();
        this.props.reGetList();
        this.props.cancelModel();
      }
      // this.onFormNext();
    });
  };

  reSetSellData = () => {
    this.props.dispatch({
      type: 'parkingGlobal/updateState',
      payload: {
        personList: {},
      },
    });
    this.setState({
      bindPersonInfo: { name: null, phone: null, id: null },
      sellWay: '2',
      tabsActiveKey: '1',
    });
  };
}
export default ParkingSellModal;
