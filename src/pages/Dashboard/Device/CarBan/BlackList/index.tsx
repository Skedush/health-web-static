import React, { PureComponent, Fragment, RefObject, createRef } from 'react';
import moment from 'moment';
import { connect } from '@/utils/decorators';
import classNames from 'classnames';
import { isEmpty } from 'lodash';
import {
  Table,
  SearchForm,
  ButtonGroup,
  Button,
  CommonComponent,
  ModalForm,
  Confirm,
  OperatingResults,
  Message,
} from '@/components/Library';
import {
  FormComponentProps,
  PaginationConfig,
  WrappedFormUtils,
  ColumnProps,
  UploadFile,
} from '@/components/Library/type';
import { GlobalState, UmiComponentProps } from '@/common/type';
import { FIVE_COLUMN_WIDTH, DOUBLE_COLUMN_WIDTH } from '@/utils/constant';

const mapStateToProps = ({ loading: { effects }, blackList: { blackListData } }: GlobalState) => {
  return {
    blackListData: blackListData,
    blackListLoading: effects['blackList/getCarBlackList'],
    addBlackLoading: effects['blackList/addCarBlackList'],
    updateBlackLoading: effects['blackList/updateCarBlackList'],
    deleteBlackLoading: effects['blackList/deleteCarBlackList'],
  };
};

type BlackListStateProps = ReturnType<typeof mapStateToProps>;
type BlackListProps = BlackListStateProps & UmiComponentProps & FormComponentProps;

interface BlackListState {
  add: boolean;
  modify: boolean;
  fileList: UploadFile[];
  showDeleteConfirm: boolean;
  selectedRowKeys: number[];
  searchFields: { [propName: string]: any };
  blackInfo?: { [propName: string]: any };
  operatingResultsVisible: boolean;
  batchHandleResultsData: { [propName: string]: any };
}

@connect(
  mapStateToProps,
  null,
)
class BlackList extends PureComponent<BlackListProps, BlackListState> {
  searchForm: WrappedFormUtils;
  modelForm: WrappedFormUtils;
  confirmRef: RefObject<Confirm>;

  constructor(props: Readonly<BlackListProps>) {
    super(props);
    this.confirmRef = createRef();
    this.state = {
      showDeleteConfirm: true,
      fileList: [],
      add: false,
      modify: false,
      selectedRowKeys: [],
      searchFields: {},
      blackInfo: {},
      operatingResultsVisible: false,
      batchHandleResultsData: {},
    };
  }

  componentDidMount() {
    this.getBlackListData({ page: 0 });
  }
  renderSearchForm() {
    const SearchFormProps = {
      items: [{ type: 'input', field: 'carPlate', placeholder: '车牌号' }],
      actions: [
        { customtype: 'select', title: '查询', htmlType: 'submit' as 'submit' },
        { customtype: 'reset', title: '重置', onClick: this.searchFormReset },
      ],
      columnNumOfRow: 4,
      onSubmit: this.onSearch,
      onGetFormRef: this.onGetFormRef,
    };
    return <SearchForm {...SearchFormProps} />;
  }
  renderButtonGroup() {
    const { deleteBlackLoading } = this.props;
    const ButtonGroupProps = {
      actions: [
        { customtype: 'master', title: '新增', onClick: this.addBlackList },
        {
          customtype: 'warning',
          title: '删除',
          disabled: !this.state.selectedRowKeys.length,
          onClick: this.batchDeleteBlackList,
          loading: deleteBlackLoading,
        },
      ],
    };
    return <ButtonGroup {...ButtonGroupProps} />;
  }

  // eslint-disable-next-line max-lines-per-function
  renderTable() {
    const { blackListData, blackListLoading } = this.props;
    const { selectedRowKeys } = this.state;

    if (isEmpty(blackListData) || !blackListData) {
      return null;
    }

    const columns: ColumnProps<any>[] = [
      {
        title: '车牌号',
        dataIndex: 'carPlate',
        key: 'carPlate',
        width: DOUBLE_COLUMN_WIDTH,
        render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '登记理由',
        width: FIVE_COLUMN_WIDTH,
        dataIndex: 'reason',
        key: 'reason',
        render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '登记时间',
        width: DOUBLE_COLUMN_WIDTH,
        key: 'checkTime',
        dataIndex: 'checkTime',
        render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      },

      {
        title: '操作',
        width: DOUBLE_COLUMN_WIDTH,
        key: 'action',
        render: (_text: any, record: any) =>
          blackListData ? (
            <Fragment>
              <Button
                customtype={'icon'}
                onClick={() => this.updateBlackList(record)}
                icon={'pm-edit'}
                title={'修改'}
              />
              <Button
                customtype={'icon'}
                onClick={() => this.deleteBlackList(record.id)}
                title={'删除'}
                icon={'pm-trash-can'}
              />
            </Fragment>
          ) : null,
      },
    ];

    const pagination: PaginationConfig = {
      position: 'bottom',
      current: blackListData.pageable.pageNumber + 1,
      total: blackListData.totalElements,
      pageSize: blackListData.pageable.pageSize,
      defaultCurrent: 1,
      // onChange: this.onChangePage,
    };

    return (
      <div className={classNames('flexAuto')}>
        <Table
          columns={columns}
          dataSource={blackListData.content}
          scroll={{ y: '100%' }}
          pagination={pagination}
          loading={blackListLoading}
          onSelectRow={this.onTableSelectRow}
          onChange={this.onTableChange}
          selectedRow={selectedRowKeys}
        />
      </div>
    );
  }
  // eslint-disable-next-line max-lines-per-function
  renderModalForm() {
    const { modify, add, blackInfo = {} } = this.state;
    const { addBlackLoading, updateBlackLoading } = this.props;
    const props = {
      items: [
        {
          type: 'hiddenInput',
          field: 'id',
          initialValue: blackInfo.id,
          hidden: true,
        },
        {
          type: 'input',
          field: 'carPlate',
          maxLength: 9,
          initialValue: blackInfo.carPlate,
          placeholder: '车牌号',
          rules: [{ required: true, message: '请输入车牌号!' }],
        },
        {
          type: 'textArea',
          initialValue: blackInfo.reason,
          field: 'reason',
          maxLength: 255,
          fill: true,
          placeholder: '理由',
          rules: [{ required: true, message: '请输入登记理由!' }],
        },
      ],
      actions: [
        {
          customtype: 'select',
          loading: addBlackLoading || updateBlackLoading,
          icon: 'search',
          title: '确定',
          htmlType: 'submit' as 'submit',
        },
        { customtype: 'second', title: '取消', onClick: this.onCancelModel },
      ],
      onSubmit: this.onModelSubmit,
      title: modify ? '修改黑名单信息' : '新增黑名单信息',
      onCancel: this.onCancelModel,
      destroyOnClose: true,
      width: '50%',
      bodyStyle: {},
      add: add,
      modify: modify,
      onGetFormRef: (modelForm: WrappedFormUtils) => {
        this.modelForm = modelForm;
      },
    };
    return <ModalForm {...props} />;
  }

  renderConfirm() {
    return <Confirm type={'warning'} ref={this.confirmRef} />;
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
    return (
      <div className={classNames('height100', 'flexColStart')}>
        <div className={'listTitle'}>信息筛选</div>
        {this.renderSearchForm()}
        <div className={'listTitle'}>信息展示</div>
        {this.renderButtonGroup()}
        {this.renderTable()}
        {this.renderModalForm()}
        {this.renderConfirm()}
        {this.renderOperatingResults()}
      </div>
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
      console.log('fieldsValue: ', fieldsValue);
      this.setState({
        searchFields: { ...fieldsValue },
      });
      fieldsValue.page = 0;
      this.getBlackListData(fieldsValue);
      // for (const item in fieldsValue) {
      //   if (fieldsValue.hasOwnProperty(item)) {
      //     fieldsValue[item] = fieldsValue[item] === -1 ? undefined : fieldsValue[item];
      //   }
      // }
    });
  };

  getBlackListData = Fileds => {
    const { dispatch } = this.props;
    this.setState({ selectedRowKeys: [] });
    dispatch({ type: 'blackList/getCarBlackList', payload: { ...Fileds } });
  };

  // onChangePage = (page: number, pageSize: number) => {
  //   console.log('page: ', page);
  //   const searchFields = { ...this.state.searchFields };
  //   searchFields.page = --page;
  //   searchFields.size = pageSize;
  //   this.getBlackListData(searchFields);
  // };

  onTableChange = (pagination, filters, sorter, extra) => {
    console.log('pagination: ', pagination);
    const searchFields = { ...this.state.searchFields };
    searchFields.page = --pagination.current;
    searchFields.size = pagination.pageSize;
    this.getBlackListData(searchFields);
  };

  addBlackList = () => {
    this.setState({
      add: true,
    });
  };

  searchFormReset = () => {
    this.searchForm.resetFields();
    this.setState({
      searchFields: {},
    });
    this.getBlackListData({ page: 0 });
  };

  onTableSelectRow = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys });
  };

  updateBlackList = (record: any) => {
    this.setState({
      modify: true,
      blackInfo: record,
    });
  };

  onCancelModel = () => {
    this.setState({
      add: false,
      modify: false,
      blackInfo: {},
    });
  };

  batchDeleteBlackList = () => {
    if (this.confirmRef.current) {
      this.confirmRef.current.open(
        () => this.onDeleteBlackList(this.state.selectedRowKeys),
        '删除',
        '是否确认删除选中的条目？',
      );
    }
  };

  deleteBlackList = (id: number) => {
    if (this.confirmRef.current) {
      this.confirmRef.current.open(() => this.onDeleteBlackList([id]), '删除', '是否确认删除？');
    }
  };

  onDeleteBlackList = async payload => {
    const { dispatch } = this.props;
    const data = await dispatch({ type: 'blackList/deleteCarBlackList', payload });
    if (data) {
      if (data.success) {
        this.getBlackListData({ page: 0 });
        this.onCancelModel();
      } else if (data.error === 1) {
        Message.error(data.message);
      } else if (data.error > 1) {
        this.setState({ operatingResultsVisible: true, batchHandleResultsData: data });
      }
    }
  };

  onGetFormRef = (form: WrappedFormUtils) => {
    this.searchForm = form;
  };

  onChangeFile = info => {
    console.log('info: ', info);
    this.setState({
      fileList: info.fileList,
    });
  };

  onDatePickerChange = (date: moment.Moment, dateString: string) => {};

  onSelectChange = (value, option) => {};

  onAddBlackList = fieldsValue => {
    const { dispatch } = this.props;
    dispatch({
      type: 'blackList/addCarBlackList',
      payload: fieldsValue,
    }).then(() => {
      this.onCancelModel();
      this.getBlackListData({ page: 0 });
    });
  };

  onUpdateBlackList = fieldsValue => {
    const { dispatch } = this.props;
    dispatch({
      type: 'blackList/updateCarBlackList',
      payload: fieldsValue,
    }).then(() => {
      this.onCancelModel();
      this.getBlackListData({ page: 0 });
    });
  };

  onModelSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { add, modify } = this.state;
    this.modelForm.validateFields((err, fieldsValue) => {
      if (!err) {
        if (add) {
          this.onAddBlackList(fieldsValue);
        } else if (modify) {
          this.onUpdateBlackList(fieldsValue);
        }
      }
    });
  };
}

export default BlackList;
