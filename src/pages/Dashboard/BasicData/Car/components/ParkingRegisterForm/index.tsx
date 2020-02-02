import React, { PureComponent, RefObject, createRef } from 'react';
import { WrappedFormUtils } from '@/components/Library/type';
import { FormSimple, OperatingResults, Icon, Message } from '@/components/Library';
import { connect } from '@/utils/decorators';
import { GlobalState, UmiComponentProps } from '@/common/type';
import { SUCCESS_BINDING } from '@/utils/message';
import styles from './index.less';
import { debounce, Cancelable } from 'lodash';

const mapStateToProps = ({ parkingGlobal, carGlobal, loading }: GlobalState) => {
  return {
    parkingConfig: parkingGlobal.parkingConfig,
    parkingList: parkingGlobal.parkingList,
    carBanAuthSettingData: carGlobal.carBanAuthSettingData,
    bindingLoading: loading.effects['parkingGlobal/bindingParkingItemForCar'],
    getListLoading: loading.effects['parkingGlobal/getParkingItem'],
    bindingParkingForCarLoading: loading.effects['carGlobal/bindingParkingForCar'],
    bindingParkingItemForCarLoading: loading.effects['parkingGlobal/bindingParkingItemForCar'],
  };
};

type ParkingRegisterFormStateProps = ReturnType<typeof mapStateToProps>;

type ParkingRegisterFormProps = UmiComponentProps &
  ParkingRegisterFormStateProps & {
    onFormNext?: Function;
    setParkingName: Function;
    setParkingItemInfo: Function;
    hasCarChange?: Function;
    onCancelModel: Function;
    setParkingId: Function;
    carId: string;
    personId: string;
  };
interface ParkingRegisterFormState {
  parkingInfo: any;
  haveParking: boolean;
  parkingSpaceList: any[];
  parkingList: any[];
  searchType: 'PERSON' | 'CODE';
  parkingLotId: string;
}
@connect(
  mapStateToProps,
  null,
  null,
  { forwardRef: true },
)
class ParkingRegisterForm extends PureComponent<any, ParkingRegisterFormState> {
  parkingRegisterForm: WrappedFormUtils;

  inputInterval: Cancelable & Function;

  operateResultRef: RefObject<OperatingResults>;

  constructor(props: Readonly<ParkingRegisterFormProps>) {
    super(props);
    this.operateResultRef = createRef();
    this.state = {
      haveParking: true,
      parkingInfo: null,
      parkingSpaceList: [],
      parkingList: [],
      searchType: 'PERSON',
      parkingLotId: '',
    };
  }

  componentDidMount() {
    this.getParkingList();
  }

  async getParkingList() {
    const data = await this.props.dispatch({ type: 'parkingGlobal/getParkingList', payload: {} });
    const list = data || [];
    list.forEach(item => {
      item.key = item.id;
      item.value = item.name;
    });
    this.setState({
      haveParking: list[0] && list[0].type === '1',
      parkingList: list,
      parkingLotId: list[0] ? list[0].id : undefined,
    });
  }

  render() {
    return (
      <div>
        <FormSimple {...this.getCarTypeFormProps()} />
        <OperatingResults ref={this.operateResultRef} />
      </div>
    );
  }

  onParkingChange = value => {
    if (!value) return;
    const { parkingList } = this.state;
    const { hasCarChange, setParkingItemInfo, setParkingName } = this.props;
    const findParking = parkingList.find(item => item.id === value);
    if (findParking) {
      this.setState({
        haveParking: findParking.type === '1',
      });
      if (hasCarChange) {
        hasCarChange(findParking.type === '1');
      }
    }
    if (setParkingName) {
      setParkingName(findParking.name);
    }
    if (findParking.type === '2' && setParkingItemInfo) {
      setParkingItemInfo({ parkingItemName: null, parkingAuthTime: null });
    }
    this.parkingRegisterForm.resetFields(['parking']);
    this.setState({ parkingLotId: value, parkingInfo: null });
  };

  onParkingLotChange = value => {
    const { setParkingItemInfo } = this.props;
    const findParking = this.state.parkingSpaceList.find(item => item.key === value);
    if (findParking) {
      this.setState({
        parkingInfo: {
          ownerName: findParking.name || '未租售',
          time: findParking.startTime
            ? `${findParking.startTime}~${findParking.endTime}`
            : '未租售',
        },
      });
    }
    if (setParkingItemInfo) {
      setParkingItemInfo({
        parkingItemName: findParking.code,
        parkingAuthTime: `${findParking.startTime}~${findParking.endTime}`,
      });
    }
  };

  getCarTypeFormProps = () => {
    const {
      carBanAuthSettingData,
      onFormNext,
      getListLoading,
      bindingParkingItemForCarLoading,
      bindingParkingForCarLoading,
    } = this.props;

    const {
      haveParking,
      parkingInfo,
      parkingSpaceList,
      searchType,
      parkingList,
      parkingLotId,
    } = this.state;
    const parkingInfoItems: any = [
      {
        type: 'label',
        field: 'owner',
        span: 12,
        value: parkingInfo ? parkingInfo.ownerName : '未租售',
        placeholder: '车位所有者',
      },
      {
        type: 'label',
        field: 'time',
        span: 12,
        value: parkingInfo ? parkingInfo.time : null,
        placeholder: '车位有效期',
      },
    ];
    const haveParkingItems: any = [
      {
        type: 'select',
        field: 'searchEnum',
        span: 6,
        initialValue: 'PERSON',
        children: [{ key: 'PERSON', value: '手机号或姓名' }, { key: 'CODE', value: '车位号' }],
        placeholder: '搜索类型',
        rules: [{ required: true, message: '请选择停车场！' }],
        onChange: this.searchEnumChange,
      },
      {
        type: 'select',
        showSearch: true,
        notFoundContent: getListLoading ? (
          <Icon type={'loading'} />
        ) : (
          <div className={styles.tip}>{'没有找到相关车位'}</div>
        ),
        filterOption: false,
        showArrow: false,
        defaultActiveFirstOption: false,
        optionFilterProp: 'children',
        field: 'parkingSpace',
        span: 13,
        loading: getListLoading,
        children: parkingSpaceList,
        placeholder: searchType === 'PERSON' ? '输入手机号或姓名搜索车位' : '输入车位号搜索',
        rules: [{ required: true, message: '请选择车位号！' }],
        onChange: this.onParkingLotChange,
        onSearch: this.onSearch,
      },
    ].concat(parkingInfo !== null ? parkingInfoItems : null);
    return {
      items: [
        {
          type: 'select',
          field: 'parkingId',
          span: 24,
          style: { width: '25%' },
          initialValue: parkingLotId,
          children: parkingList,
          rules: [{ required: true, message: '请先添加停车场！' }],
          placeholder: '选择停车场',
          onChange: this.onParkingChange,
        },
      ].concat(haveParking ? haveParkingItems : null),
      actions: onFormNext
        ? [
            {
              customtype: 'select',
              loading: bindingParkingForCarLoading || bindingParkingItemForCarLoading,
              title: carBanAuthSettingData.authState ? '下一步' : '完成',
              htmlType: 'submit' as 'submit',
              onClick: this.submit,
            },
          ]
        : [],
      // onSubmit: this.onCarTypeFormSubmit,
      onGetFormRef: (modelForm: WrappedFormUtils) => {
        this.parkingRegisterForm = modelForm;
      },
    };
  };

  reset() {
    this.parkingRegisterForm.resetFields();
    this.setState({
      parkingInfo: null,
    });
  }

  onSearch = value => {
    if (value) {
      if (this.inputInterval) {
        this.inputInterval.cancel();
      }
      this.inputInterval = debounce(() => {
        this.getList(value);
      }, 270);
      this.inputInterval();
    } else {
      this.setState({
        parkingSpaceList: [],
      });
    }
  };

  searchEnumChange = value => {
    this.setState({
      searchType: value,
    });
  };

  async getList(search: string) {
    const { dispatch } = this.props;
    const { parkingLotId } = this.state;
    const { content } = await dispatch({
      type: 'parkingGlobal/getParkingItem',
      payload: {
        page: 0,
        size: 9999,
        search,
        searchEnum: this.state.searchType,
        parkingLotId,
      },
    });
    content.forEach(item => {
      item.value = item.code;
      item.key = item.parkingSpaceId;
    });
    this.setState({
      parkingSpaceList: content,
    });
  }

  setParkingId = parkingId => {
    const { setParkingId } = this.props;
    if (setParkingId) {
      setParkingId(parkingId);
    }
  };

  submit = async () => {
    const { carId, personId, onFormNext, carBanAuthSettingData, onCancelModel } = this.props;
    const { haveParking } = this.state;
    const { validateFields } = this.parkingRegisterForm;
    return new Promise<any>((resolve, reject) => {
      validateFields(async (error, values) => {
        this.setParkingId(values.parkingId);
        if (error) {
          resolve(false);
          return;
        }
        if (!haveParking) {
          const res = await this.props.dispatch({
            type: 'carGlobal/bindingParkingForCar',
            payload: {
              id: values.parkingId,
              carIds: [carId],
            },
          });
          if (res.data && res.data.error && this.operateResultRef.current) {
            this.operateResultRef.current.open(res.data);
            resolve(false);
          } else if (res.data) {
            Message.success(SUCCESS_BINDING);
            this.setParkingId(values.parkingId);
            if (!carBanAuthSettingData.authState && onCancelModel) {
              onCancelModel();
            } else if (carBanAuthSettingData.authState && onFormNext) {
              onFormNext();
            }
            resolve({ ...res.data, ...values, carId, personId });
          } else {
            resolve(false);
          }
        } else {
          const res = await this.props.dispatch({
            type: 'parkingGlobal/bindingParkingItemForCar',
            payload: {
              parkingSpaceId: values.parkingSpace,
              carId,
              personId,
            },
          });
          if (res.data && res.data.error && this.operateResultRef.current) {
            this.operateResultRef.current.open(res.data);
            resolve(false);
          } else if (res.data) {
            Message.success(SUCCESS_BINDING);
            if (!carBanAuthSettingData.authState && onCancelModel) {
              onCancelModel();
            } else if (carBanAuthSettingData.authState && onFormNext) {
              onFormNext();
            }
            resolve({ ...res.data, ...values, carId, personId });
            // this.setParkingId(values.parkingId);
          } else {
            resolve(false);
          }
        }
      });
    });
  };
}
export default ParkingRegisterForm;
