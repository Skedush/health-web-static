import React, { PureComponent, createRef, RefObject } from 'react';
import { WrappedFormUtils, PaginationConfig } from '@/components/Library/type';
// import moment from 'moment';
import {
  Modal,
  Confirm,
  Table,
  CommonComponent,
  SearchForm,
  ButtonGroup,
  Badge,
  Message,
  OperatingResults,
} from '@/components/Library';
import { connect } from '@/utils/decorators';
import { GlobalState, UmiComponentProps, DictionaryEnum } from '@/common/type';
import classNames from 'classnames';
import styles from './index.less';
import { SUCCESS_BINDING } from '@/utils/message';

const mapStateToProps = ({ app, carGlobal }: GlobalState) => {
  return {
    defaultAuthTime: carGlobal.defaultAuthTime,
    bindingCarState: app.dictionry[DictionaryEnum.PARKING_SELL_STATE],
    buildUnit: app.dictionry[DictionaryEnum.BUILD_UNIT],
    operateType: app.dictionry[DictionaryEnum.OPERATE_TYPE],
    deviceStatus: app.dictionry[DictionaryEnum.DEVICE_STATUS],
  };
};

type TrafficModalStateProps = ReturnType<typeof mapStateToProps>;

type TrafficModalProps = UmiComponentProps &
  TrafficModalStateProps & {
    cancelModel: Function;
    reGetList: Function;
    modalVisible: boolean;
    parkingLotId: string;
    parkingName: string;
    binding: Function;
  };
interface TrafficModalState {
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
class TrafficModal extends PureComponent<any, TrafficModalState> {
  modalForm: WrappedFormUtils;
  confirmRef: RefObject<Confirm> = createRef();
  // timeOut: NodeJS.Timeout;
  searchForm: WrappedFormUtils;

  constructor(props: Readonly<TrafficModalProps>) {
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
    this.featch();
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

  renderTable() {
    const { data } = this.props;

    const { selectedRowKeys } = this.state;
    const pagination: PaginationConfig = {
      position: 'bottom',
      total: data.totalElements,
      current: data.pageable ? data.pageable.pageNumber + 1 : 0,
      pageSize: data.pageable ? data.pageable.pageSize : 10,
      defaultCurrent: 1,
    };

    return (
      <div className={'flexAuto'}>
        <Table
          columns={this.getColums()}
          rowKey={'id'}
          dataSource={data.content || []}
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
          title: '绑定',
          onClick: this.binding,
        },
      ],
      flexState: 'right' as 'right',
    };
    return <ButtonGroup {...ButtonGroupProps} />;
  }

  render() {
    const { buildUnit, operateType, deviceStatus } = this.props;
    const SearchFormProps = {
      items: [
        { type: 'input', field: 'name', placeholder: '设备名称' },
        {
          type: 'select',
          field: 'buildUnit',
          placeholder: '建设单位',
          children: buildUnit,
        },
        { type: 'select', field: 'operator', placeholder: '运营单位', children: operateType },
        { type: 'select', field: 'status', placeholder: '设备状态', children: deviceStatus },
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
      <Modal {...this.getTrafficModalProps()}>
        <SearchForm {...SearchFormProps} />
        {this.renderTable()}
        {this.renderButtonGroup()}
        {this.renderOperatingResults()}
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
      this.props.pagination(fieldsValue);
    });
  };

  searchFormReset = () => {
    this.searchForm.resetFields();
    this.setState({
      searchFields: {},
      selectedRowKeys: [],
    });
    this.props.pagination();
  };

  onTableChange = pagination => {
    const searchFields = { ...this.state.searchFields };
    searchFields.page = --pagination.current;
    searchFields.size = pagination.pageSize;
    this.props.pagination(searchFields);
  };

  onTableSelectRow = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

  getColums = () => {
    return [
      {
        title: '设备名称',
        width: '12%',
        dataIndex: 'name',
        key: 'name',
        render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '设备地址',
        width: '12%',
        dataIndex: 'address',
        key: 'address',
        render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '建设单位',
        width: '12%',
        dataIndex: 'buildUnitStr',
        key: 'buildUnitStr',
        render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '运营单位',
        width: '12%',
        dataIndex: 'operatorStr',
        key: 'operatorStr',
        render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '运营电话',
        width: '15%',
        dataIndex: 'operatorPhone',
        key: 'operatorPhone',
        render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '建设时间',
        // width: '15%',
        dataIndex: 'buildDate',
        key: 'buildDate',
        render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '设备状态',
        dataIndex: 'statusStr',
        key: 'statusStr',
        width: '12%',
        render: (text: any, record: any) => {
          const { status } = record;
          let badge = 'success';
          if (status !== '1') {
            badge = 'error';
          }
          return (
            <div style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}>
              <Badge status={badge as 'success' | 'error'} />
              {text}
            </div>
          );
        },
      },
    ];
  };

  getTrafficModalProps = () => {
    return {
      onCancel: () => {
        this.props.cancelModel();
        this.searchFormReset();
      },
      visible: this.props.addModal,
      title: this.props.title,
      destroyOnClose: true,
      centered: true,
      footer: null,
      maskClosable: false,
      bodyStyle: {},
      width: '60%',
      wrapClassName: classNames('modal', styles.modal),
    };
  };

  binding = () => {
    const { selectedRowKeys } = this.state;
    const { dispatch, unitId } = this.props;

    dispatch({
      type: 'traffic/positionBind',
      payload: {
        id: unitId,
        deviceId: selectedRowKeys,
      },
    }).then(res => {
      if (res && res.data && res.data.success) {
        this.props.cancelModel();
        this.searchFormReset();
        Message.success(SUCCESS_BINDING);
      } else if (res && res.data && res.data.error) {
        this.setState({ operatingResultsVisible: true, batchHandleResultsData: res.data });
      }
    });
  };

  featch = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'app/getDic',
      payload: {
        type: [
          DictionaryEnum.BUILD_UNIT,
          DictionaryEnum.OPERATE_TYPE,
          DictionaryEnum.DEVICE_STATUS,
        ].toString(),
      },
    });
  };
}
export default TrafficModal;
