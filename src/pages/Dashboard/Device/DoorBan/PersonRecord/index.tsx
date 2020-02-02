import React, { PureComponent, RefObject, createRef } from 'react';
import moment, { isMoment } from 'moment';
import { connect } from '@/utils/decorators';
import classNames from 'classnames';
import { isEmpty } from 'lodash';
import {
  Table,
  SearchForm,
  ButtonGroup,
  CommonComponent,
  Confirm,
  Message,
} from '@/components/Library';
import {
  FormComponentProps,
  PaginationConfig,
  WrappedFormUtils,
  ColumnProps,
  UploadFile,
} from '@/components/Library/type';
import { GlobalState, UmiComponentProps, DictionaryEnum } from '@/common/type';
import { ERROR_EXPORT_NODATA, ERROR_EXPORT_NOTIME } from '@/utils/message';
import { SINGLE_COLUMN_WIDTH, DOUBLE_COLUMN_WIDTH } from '@/utils/constant';

const mapStateToProps = (state: GlobalState) => {
  return {
    personRecordData: state.personRecord.personRecordData,
    passType: state.app.dictionry[DictionaryEnum.PASS_TYPE],
  };
};

type PersonRecordStateProps = ReturnType<typeof mapStateToProps>;
type PersonRecordProps = PersonRecordStateProps & UmiComponentProps & FormComponentProps;

interface PersonRecordState {
  add: boolean;
  modify: boolean;
  fileList: UploadFile[];
  showDeleteConfirm: boolean;
  selectedRowKeys: number[];
  searchFields: { [propName: string]: any };
  personRecord: any;
}

@connect(
  mapStateToProps,
  null,
)
class PersonRecord extends PureComponent<PersonRecordProps, PersonRecordState> {
  searchForm: WrappedFormUtils;
  modelForm: WrappedFormUtils;
  confirmRef: RefObject<Confirm>;

  constructor(props: Readonly<PersonRecordProps>) {
    super(props);
    this.confirmRef = createRef();
    this.state = {
      showDeleteConfirm: true,
      fileList: [],
      add: false,
      modify: false,
      selectedRowKeys: [],
      searchFields: {},
      personRecord: {},
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    this.getPersonRecordData({ page: 0 });
    dispatch({
      type: 'app/getDic',
      payload: { type: [DictionaryEnum.PASS_TYPE].toString() },
    });
  }
  renderSearchForm() {
    const { passType } = this.props;
    const SearchFormProps = {
      items: [
        { type: 'input', field: 'name', placeholder: '姓名' },
        { type: 'input', field: 'address', placeholder: '出入关卡' },
        { type: 'datePicker', field: 'transitStartDate', placeholder: '开始时间' },
        { type: 'datePicker', field: 'transitEndDate', placeholder: '结束时间' },
        { type: 'select', field: 'transitType', placeholder: '出入类型', children: passType },
      ],
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
    const ButtonGroupProps = {
      actions: [
        { customtype: 'master', title: '导出', icon: 'plus', onClick: this.exportPersonRecord },
      ],
    };
    return <ButtonGroup {...ButtonGroupProps} />;
  }

  // eslint-disable-next-line max-lines-per-function
  renderTable() {
    const { personRecordData } = this.props;
    const { selectedRowKeys } = this.state;

    if (isEmpty(personRecordData) || !personRecordData) {
      return null;
    }

    const columns: ColumnProps<any>[] = [
      {
        title: '姓名',
        width: SINGLE_COLUMN_WIDTH,
        dataIndex: 'name',
        key: 'name',
        render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '联系方式',
        width: DOUBLE_COLUMN_WIDTH,
        dataIndex: 'phone',
        key: 'phone',
        render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '出入关卡',
        width: DOUBLE_COLUMN_WIDTH,
        key: 'address',
        dataIndex: 'address',
        render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '出入类型',
        width: SINGLE_COLUMN_WIDTH,
        key: 'transitTypeStr',
        dataIndex: 'transitTypeStr',
        render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '通行方式',
        width: DOUBLE_COLUMN_WIDTH,
        key: 'transitWayStr',
        dataIndex: 'transitWayStr',
        render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '通行时间',
        // width: DOUBLE_COLUMN_WIDTH,
        key: 'createTime',
        dataIndex: 'createTime',
        render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      },
    ];

    const pagination: PaginationConfig = {
      position: 'bottom',
      total: personRecordData.totalElements,
      current: personRecordData.pageable.pageNumber + 1,
      pageSize: personRecordData.pageable.pageSize,
      defaultCurrent: 1,
      // onChange: this.onChangePage,
    };

    return (
      <div className={classNames('flexAuto')}>
        <Table
          columns={columns}
          dataSource={personRecordData.content}
          scroll={{ y: '100%' }}
          pagination={pagination}
          onSelectRow={this.onTableSelectRow}
          onChange={this.onTableChange}
          selectedRow={selectedRowKeys}
        />
      </div>
    );
  }
  renderConfirm() {
    return <Confirm type={'warning'} ref={this.confirmRef} />;
  }

  render() {
    return (
      <div className={classNames('height100', 'flexColStart')}>
        <div className={'listTitle'}>信息筛选</div>
        {this.renderSearchForm()}
        <div className={'listTitle'}>信息展示</div>
        {this.renderButtonGroup()}
        {this.renderTable()}
        {/* {this.renderConfirm()} */}
      </div>
    );
  }

  onSearch = (e: React.FormEvent<HTMLFormElement>) => {
    if (e) {
      e.preventDefault();
    }
    this.searchForm.validateFields((err, fieldsValue) => {
      if (err) return;
      if (isMoment(fieldsValue.transitEndDate)) {
        fieldsValue.transitEndDate = fieldsValue.transitEndDate.format('YYYY-MM-DD HH:mm:ss');
      }
      if (isMoment(fieldsValue.transitStartDate)) {
        fieldsValue.transitStartDate = fieldsValue.transitStartDate.format('YYYY-MM-DD HH:mm:ss');
      }
      this.setState({
        searchFields: { ...fieldsValue },
      });
      fieldsValue.page = 0;
      this.getPersonRecordData(fieldsValue);
      // for (const item in fieldsValue) {
      //   if (fieldsValue.hasOwnPersonRecord(item)) {
      //     fieldsValue[item] = fieldsValue[item] === -1 ? undefined : fieldsValue[item];
      //   }
      // }
    });
  };

  getPersonRecordData = Fileds => {
    const { dispatch } = this.props;
    this.setState({ selectedRowKeys: [] });
    dispatch({ type: 'personRecord/getPersonRecord', payload: { ...Fileds } });
  };

  exportPersonRecord = () => {
    const { personRecordData = [] } = this.props;
    const { searchFields } = this.state;
    if (personRecordData.content.length <= 0) {
      Message.warning(ERROR_EXPORT_NODATA);
      return;
    }
    if (!searchFields.startTime && !searchFields.endTime) {
      Message.warning(ERROR_EXPORT_NOTIME);
      return;
    }
    const { dispatch } = this.props;
    const newSearchFields = { ...searchFields };
    searchFields.id = this.state.selectedRowKeys;
    dispatch({ type: 'personRecord/exportPersonRecord', payload: { conditions: newSearchFields } });
  };

  onTableChange = (pagination, filters, sorter, extra) => {
    console.log('pagination: ', pagination);
    const searchFields = { ...this.state.searchFields };
    searchFields.page = --pagination.current;
    searchFields.size = pagination.pageSize;
    this.getPersonRecordData(searchFields);
  };

  searchFormReset = () => {
    this.searchForm.resetFields();
    this.setState({
      searchFields: {},
    });
    this.getPersonRecordData({ page: 0 });
  };

  onTableSelectRow = (selectedRowKeys, selectedRows) => {
    console.log('selectedRowKeys: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  };

  onGetFormRef = (form: WrappedFormUtils) => {
    this.searchForm = form;
  };

  onDatePickerChange = (date: moment.Moment, dateString: string) => {};
}

export default PersonRecord;
