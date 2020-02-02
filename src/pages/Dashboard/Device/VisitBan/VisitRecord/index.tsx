import React, { PureComponent, RefObject, createRef } from 'react';
import moment, { isMoment } from 'moment';
import { connect } from '@/utils/decorators';
import classNames from 'classnames';
import styles from './index.less';
import {
  Table,
  SearchForm,
  CommonComponent,
  Confirm,
  Img,
  ButtonGroup,
  Message,
} from '@/components/Library';
import {
  FormComponentProps,
  PaginationConfig,
  WrappedFormUtils,
  ColumnProps,
} from '@/components/Library/type';
import { ERROR_EXPORT_NODATA, ERROR_EXPORT_NOTIME } from '@/utils/message';
import { GlobalState, UmiComponentProps } from '@/common/type';
import { SINGLE_COLUMN_WIDTH, DOUBLE_COLUMN_WIDTH } from '@/utils/constant';

const mapStateToProps = (state: GlobalState) => {
  return { state, loading: state.loading.effects['visitRecord/getVisitRecordList'] };
};

type VisitStateProps = ReturnType<typeof mapStateToProps>;
type VisitProps = VisitStateProps & UmiComponentProps & FormComponentProps;

interface VisitState {
  dataSource: any[];
  pageOption: PaginationConfig;
  searchUnitDisabled: boolean;
  searchHouseDisabled: boolean;
  buildingList: any[];
  unitList: any[];
  houseList: any[];
}

@connect(
  mapStateToProps,
  null,
)
class VisitRecord extends PureComponent<VisitProps, VisitState> {
  searchForm: WrappedFormUtils;
  modelForm: WrappedFormUtils;

  confirmRef: RefObject<Confirm>;

  selectedList: any[] = [];

  queryCondition: {
    name?: string;
    buildId?: string;
    unitId?: string;
    houseId?: string;
    personName?: string;
    startTime?: string;
    endTime?: string;
  } = {};
  constructor(props: Readonly<VisitProps>) {
    super(props);
    this.confirmRef = createRef();
    this.state = {
      dataSource: [],
      searchUnitDisabled: true,
      searchHouseDisabled: true,
      buildingList: [],
      unitList: [],
      houseList: [],
      pageOption: {
        current: 1,
        total: 0,
        pageSize: 10,
      },
    };
  }

  componentDidMount() {
    this.getList();
    // this.getBuildingList();
  }

  renderSearchForm() {
    const { houseList } = this.state;
    const SearchFormProps = {
      items: [
        { type: 'input', field: 'name', placeholder: '姓名' },
        {
          type: 'input',
          field: 'buildName',
          onSelect: this.buildingChange,
          placeholder: '楼栋编号',
        },
        {
          type: 'input',
          field: 'unitName',
          onSelect: this.unitChange,
          placeholder: '访问单元',
        },
        { type: 'input', field: 'houseName', children: houseList, placeholder: '门牌号' },
        { type: 'datePicker', field: 'startTime', placeholder: '开始时间' },
        { type: 'datePicker', field: 'endTime', placeholder: '结束时间' },
      ],
      actions: [
        { customtype: 'select', title: '查询', htmlType: 'submit' as 'submit' },
        { customtype: 'reset', title: '重置', onClick: this.onReset },
      ],
      columnNumOfRow: 4,
      onSubmit: this.onSearchSubmit,
      onGetFormRef: this.onGetFormRef,
    };
    return <SearchForm {...SearchFormProps} />;
  }

  // eslint-disable-next-line max-lines-per-function
  renderTable() {
    const columns: ColumnProps<any>[] = [
      {
        title: '访客照',
        dataIndex: 'faceImageUrl',
        key: 'faceImageUrl',
        width: SINGLE_COLUMN_WIDTH,
        render: (text: any, record: object) => (
          <Img image={text} className={styles.image} previewImg={true} />
        ),
      },
      {
        title: '访客姓名',
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
      // {
      //   title: '访问对象',
      //   width: SINGLE_COLUMN_WIDTH,
      //   key: 'personName',
      //   dataIndex: 'personName',
      //   render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      // },
      // {
      //   title: '访问地址',
      //   width: DOUBLE_COLUMN_WIDTH,
      //   key: 'visitAddress',
      //   dataIndex: 'visitAddress',
      //   render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      // },
      // {
      //   title: '门禁权限',
      //   width: SINGLE_COLUMN_WIDTH,
      //   key: 'authTime',
      //   dataIndex: 'authTime',
      //   render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      // },
      {
        title: '出入关卡',
        width: DOUBLE_COLUMN_WIDTH,
        key: 'direction',
        dataIndex: 'direction',
        render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '出入时间',
        // width: DOUBLE_COLUMN_WIDTH,
        key: 'recordTime',
        dataIndex: 'recordTime',
        render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      },
    ];
    const { pageOption, dataSource } = this.state;
    const { loading } = this.props;
    const pagination: PaginationConfig = {
      position: 'bottom',
      total: pageOption.total,
      pageSize: pageOption.pageSize,
      defaultCurrent: pageOption.current,
      current: pageOption.current,
    };
    return (
      <div className={classNames('flexAuto')}>
        <Table
          columns={columns}
          dataSource={dataSource}
          scroll={{ y: '100%' }}
          type={'checkbox'}
          // onSelectRow={this.onSelectChange}
          pagination={pagination}
          loading={loading}
          onChange={this.tableOnChange}
        />
      </div>
    );
  }

  renderButtonGroup() {
    const ButtonGroupProps = {
      actions: [{ customtype: 'master', title: '导出', onClick: this.exportList }],
    };
    return <ButtonGroup {...ButtonGroupProps} />;
  }

  render() {
    return (
      <div className={classNames('height100', 'flexColStart')}>
        <Confirm type={'warning'} ref={this.confirmRef} />
        <div className={'listTitle'}>信息筛选</div>
        {this.renderSearchForm()}
        <div className={'listTitle'}>信息展示</div>
        {this.renderButtonGroup()}
        {this.renderTable()}
      </div>
    );
  }

  getList() {
    this.onChangePage(1, this.state.pageOption.pageSize);
  }

  tableOnChange = (pagination: PaginationConfig) => {
    this.onChangePage(pagination.current || 1, pagination.pageSize || 10);
  };

  onChangePage = async (page: number, pageSize: number = 10) => {
    const { dispatch } = this.props;
    const { pageOption } = this.state;
    const data = await dispatch({
      type: 'visitRecord/getVisitRecordList',
      pageOption: { page: page - 1, size: pageSize, ...this.queryCondition },
    });
    if (!data) {
      return;
    }
    data.content.forEach(item => {
      item.visitAddress = `${item.buildCode}-${item.unitCode}-${item.houseCode}`;
    });
    this.setState({
      dataSource: data ? data.content : [],
      pageOption: {
        ...pageOption,
        current: page,
        pageSize,
      },
    });
  };

  onSearch = () => {};

  async getBuildingList() {
    const data = await this.props.dispatch({ type: 'visitRecord/getBuildingList' });
    this.setState({
      buildingList: data,
    });
  }

  async getUnitList(buildingId) {
    const data = await this.props.dispatch({ type: 'visitRecord/getUnitList', buildingId });
    this.setState({
      unitList: data,
    });
  }

  buildingChange = async value => {
    const data = await this.props.dispatch({ type: 'visitRecord/getUnitList', buildingId: value });
    this.setState({
      searchUnitDisabled: false,
      unitList: data,
    });
  };

  unitChange = async value => {
    const data = await this.props.dispatch({ type: 'visitRecord/getHouseList', unitId: value });
    this.setState({
      houseList: data,
      searchHouseDisabled: false,
    });
  };

  onReset = e => {
    this.searchForm.resetFields();
    this.onSearchSubmit(e);
  };

  onGetFormRef = (form: WrappedFormUtils) => {
    this.searchForm = form;
  };

  exportList = async () => {
    const { dataSource = [] } = this.state;
    if (dataSource.length <= 0) {
      Message.warning(ERROR_EXPORT_NODATA);
      return;
    }
    await this.setQueryCondition();
    const queryData = {
      ...this.queryCondition,
      id: this.selectedList.length ? this.selectedList : [],
    };
    if (!this.queryCondition.startTime && !this.queryCondition.endTime) {
      Message.warning(ERROR_EXPORT_NOTIME);
      return;
    }
    this.props.dispatch({ type: 'visitRecord/exportRecord', queryData });
  };

  onSearchSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    if (e) {
      e.preventDefault();
    }
    await this.setQueryCondition();
    this.getList();
  };

  async setQueryCondition() {
    return new Promise<any>(resolve => {
      this.searchForm.validateFields((err, fieldsValue) => {
        if (err) return;
        console.log('fieldsValue: ', fieldsValue);
        for (const item in fieldsValue) {
          if (fieldsValue.hasOwnProperty(item)) {
            fieldsValue[item] = fieldsValue[item] === -1 ? undefined : fieldsValue[item];
          }
        }
        if (isMoment(fieldsValue.endTime)) {
          fieldsValue.endTime = fieldsValue.endTime.format('YYYY-MM-DD HH:mm:ss');
        }
        if (isMoment(fieldsValue.startTime)) {
          fieldsValue.startTime = fieldsValue.startTime.format('YYYY-MM-DD HH:mm:ss');
        }
        this.queryCondition = fieldsValue;
        resolve(fieldsValue);
      });
    });
  }

  onDatePickerChange = (date: moment.Moment, dateString: string) => {
    console.log('dateString: ', dateString);
    console.log('date: ', date);
  };

  onSelectChange = (value, option) => {
    console.log('value, option: ', value, option);
    this.selectedList = value;
  };
}

export default VisitRecord;
