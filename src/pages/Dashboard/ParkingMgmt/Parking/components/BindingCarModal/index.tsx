import React, { PureComponent, createRef, RefObject } from 'react';
import { WrappedFormUtils, PaginationConfig } from '@/components/Library/type';
// import moment from 'moment';
import {
  Modal,
  Confirm,
  Table,
  CommonComponent,
  SearchForm,
  OperatingResults,
  ButtonGroup,
} from '@/components/Library';
import { connect } from '@/utils/decorators';
import { GlobalState, UmiComponentProps, DictionaryEnum } from '@/common/type';
import { SINGLE_COLUMN_WIDTH, DOUBLE_COLUMN_WIDTH } from '@/utils/constant';
import { isEmpty } from 'lodash';
import classNames from 'classnames';
import styles from './index.less';
// const { TabPane } = Tabs;

const mapStateToProps = ({ parking, app, carGlobal }: GlobalState) => {
  return {
    notInParkingCarList: parking.notInParkingCarList,
    defaultAuthTime: carGlobal.defaultAuthTime,
    bindingCarState: app.dictionry[DictionaryEnum.PARKING_SELL_STATE],
  };
};
const steps = ['车辆选择', '车辆通行证下发'];

type BindingCarModalStateProps = ReturnType<typeof mapStateToProps>;

type BindingCarModalProps = UmiComponentProps &
  BindingCarModalStateProps & {
    cancelModel: Function;
    reGetList: Function;
    modalVisible: boolean;
    parkingLotId: string;
    parkingName: string;
  };
interface BindingCarModalState {
  selectedRowKeys: number[];
  tabsActiveKey: string;
  searchFields: { [propName: string]: any };
  operatingResultsVisible: boolean;
  batchHandleResultsData: { [propName: string]: any };
}
@connect(
  mapStateToProps,
  null,
)
class BindingCarModal extends PureComponent<any, BindingCarModalState> {
  confirmRef: RefObject<Confirm> = createRef();
  // timeOut: NodeJS.Timeout;
  searchForm: WrappedFormUtils;

  constructor(props: Readonly<BindingCarModalProps>) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      tabsActiveKey: '1',
      searchFields: {},
      operatingResultsVisible: false,
      batchHandleResultsData: {},
    };
  }

  componentDidMount() {
    const { parkingLotId } = this.props;
    this.props.dispatch({
      type: 'app/getDic',
      payload: { type: [DictionaryEnum.PARKING_SELL_STATE].toString() },
    });
    this.getNotInParkingCarData({ page: 0, parkingLotId });
  }

  renderTable() {
    const { notInParkingCarList } = this.props;
    if (!notInParkingCarList || isEmpty(notInParkingCarList)) {
      return null;
    }
    const { selectedRowKeys } = this.state;
    const pagination: PaginationConfig = {
      position: 'bottom',
      total: notInParkingCarList.totalElements,
      current: notInParkingCarList.pageable.pageNumber + 1,
      pageSize: notInParkingCarList.pageable.pageSize,
      defaultCurrent: 1,
    };

    return (
      <div className={'flexAuto'}>
        <Table
          columns={this.getColums()}
          rowKey={'carId'}
          dataSource={notInParkingCarList.content}
          scroll={{ y: '100%' }}
          // loading={getMenuLoading}
          pagination={pagination}
          onSelectRow={this.onTableSelectRow}
          onChange={this.onTableChange}
          selectedRow={selectedRowKeys}
        />
      </div>
    );
  }

  renderButtonGroup() {
    const ButtonGroupProps = {
      actions: [
        { customtype: 'second', title: '取消', onClick: this.props.cancelModel },
        {
          customtype: 'master',
          disabled: !this.state.selectedRowKeys.length,
          title: '完成',
          onClick: () => {
            this.onBindingCarSubmit();
          },
        },
      ],
      flexState: 'right' as 'right',
    };
    return <ButtonGroup {...ButtonGroupProps} />;
  }

  renderOperatingResults() {
    const { operatingResultsVisible, batchHandleResultsData } = this.state;
    const props = {
      visible: operatingResultsVisible,
      onCancel: this.onCancelOperatingResults,
      data: batchHandleResultsData,
    };
    return <OperatingResults {...props} />;
  }

  render() {
    const SearchFormProps = {
      items: [
        { type: 'input', field: 'name', placeholder: '车主姓名' },
        { type: 'input', field: 'phone', placeholder: '联系电话' },
        { type: 'input', field: 'licensePlate', placeholder: '车牌号' },
      ],
      actions: [
        { customtype: 'select', title: '查询', htmlType: 'submit' as 'submit' },
        { customtype: 'reset', title: '重置', onClick: this.searchFormReset },
      ],
      columnNumOfRow: 4,
      onSubmit: this.onSearch,
      onGetFormRef: form => {
        this.searchForm = form;
      },
    };
    return (
      <Modal {...this.getBindingCarModalProps()}>
        <SearchForm {...SearchFormProps} />
        {this.renderTable()}
        {this.renderButtonGroup()}

        {this.renderOperatingResults()}
        <Confirm type={'warning'} ref={this.confirmRef} />
      </Modal>
    );
  }

  onCancelOperatingResults = () => {
    this.setState({ operatingResultsVisible: false });
  };

  onSearch = (e: React.FormEvent<HTMLFormElement>) => {
    if (e) {
      e.preventDefault();
    }
    this.searchForm.validateFields((err, fieldsValue) => {
      if (err) return;
      fieldsValue.parkingLotId = this.props.parkingLotId;
      this.setState({
        searchFields: { ...fieldsValue },
      });
      fieldsValue.page = 0;
      this.getNotInParkingCarData(fieldsValue);
    });
  };

  searchFormReset = () => {
    this.searchForm.resetFields();
    this.setState({
      searchFields: {},
    });
    this.getNotInParkingCarData({ page: 0, parkingLotId: this.props.parkingLotId });
  };

  getNotInParkingCarData = fields => {
    this.props.dispatch({ type: 'parking/getNotInParkingCar', payload: { ...fields } });
  };

  onTableChange = pagination => {
    const searchFields = { ...this.state.searchFields };
    searchFields.page = --pagination.current;
    searchFields.size = pagination.pageSize;
    this.getNotInParkingCarData(searchFields);
  };

  onTableSelectRow = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

  getColums = () => {
    return [
      {
        title: '车牌号',
        dataIndex: 'licensePlate',
        key: 'licensePlate',
        width: DOUBLE_COLUMN_WIDTH,
        render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '车辆类型',
        width: DOUBLE_COLUMN_WIDTH,
        dataIndex: 'typeStr',
        key: 'typeStr',
        render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '姓名',
        width: SINGLE_COLUMN_WIDTH,
        dataIndex: 'name',
        key: 'name',
        render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '联系电话',
        // width: DOUBLE_COLUMN_WIDTH,
        dataIndex: 'phone',
        key: 'phone',
        render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '品牌',
        width: DOUBLE_COLUMN_WIDTH,
        dataIndex: 'brand',
        key: 'brand',
        render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '车型',
        width: SINGLE_COLUMN_WIDTH,
        dataIndex: 'spec',
        key: 'spec',
        render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '颜色',
        width: SINGLE_COLUMN_WIDTH,
        dataIndex: 'color',
        key: 'color',
        render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      },
    ];
  };

  getBindingCarModalProps = () => {
    return {
      onCancel: () => {
        this.props.cancelModel();
        this.reSetBindCarModalData();
      },
      visible: this.props.modalVisible,
      title: steps[parseInt(this.state.tabsActiveKey) - 1],
      destroyOnClose: true,
      centered: true,
      footer: null,
      maskClosable: false,
      bodyStyle: {},
      width: '60%',
      wrapClassName: classNames('modal', styles.modal),
    };
  };

  onBindingCarSubmit = async () => {
    const { dispatch, parkingLotId } = this.props;
    const bindCarsData = {
      id: parkingLotId,
      carIds: this.state.selectedRowKeys,
    };

    const res = await dispatch({ type: 'parking/bindingParkingForCar', payload: bindCarsData });
    if (res && res.success) {
      this.setState({
        selectedRowKeys: [],
      });
      this.getNotInParkingCarData({ page: 0, parkingLotId: this.props.parkingLotId });
      this.props.reGetList();
      this.props.cancelModel();
      this.reSetBindCarModalData();
    } else {
    }
  };

  reSetBindCarModalData = () => {
    this.setState({
      tabsActiveKey: '1',
    });
  };
}
export default BindingCarModal;
