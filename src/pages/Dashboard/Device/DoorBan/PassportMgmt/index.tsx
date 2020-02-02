import React, { PureComponent, RefObject, createRef, Fragment } from 'react';
import moment from 'moment';
import { connect } from '@/utils/decorators';
import classNames from 'classnames';
// import styles from './index.less';
import {
  Table,
  SearchForm,
  CommonComponent,
  Confirm,
  ButtonGroup,
  Button,
  Badge,
  OperatingResults,
} from '@/components/Library';
import {
  FormComponentProps,
  PaginationConfig,
  WrappedFormUtils,
  ColumnProps,
} from '@/components/Library/type';
import { GlobalState, UmiComponentProps, DictionaryEnum } from '@/common/type';
import { DOUBLE_COLUMN_WIDTH } from '@/utils/constant';
import AuthInfo from './components/AuthInfo';
import { copyArrParam } from '@/utils';

const mapStateToProps = (state: GlobalState) => {
  return {
    state,
    authStatus: state.app.dictionry[DictionaryEnum.AUTH_STATUS],
    loading: state.loading.effects['visitRecord/getVisitRecordList'],
  };
};

type PassportStateProps = ReturnType<typeof mapStateToProps>;
type PassportProps = PassportStateProps & UmiComponentProps & FormComponentProps;

interface PassportState {
  add: boolean;
  modify: boolean;
  dataSource: any[];
  authData: any;
  currentData: any;
  visible: boolean;
  licenceId: string;
  pageOption: PaginationConfig;
}

@connect(
  mapStateToProps,
  null,
)
class Passport extends PureComponent<PassportProps, PassportState> {
  searchForm: WrappedFormUtils;
  modelForm: WrappedFormUtils;

  confirmRef: RefObject<Confirm>;

  operateResultRef: RefObject<OperatingResults>;

  selectedList: any[] = [];

  queryCondition = {};

  constructor(props: Readonly<PassportProps>) {
    super(props);
    this.confirmRef = createRef();
    this.operateResultRef = createRef();
    this.state = {
      dataSource: [],
      authData: {} as any,
      add: false,
      modify: false,
      visible: false,
      currentData: {},
      licenceId: '',
      pageOption: {
        current: 1,
        total: 0,
        pageSize: 10,
      },
    };
  }

  componentDidMount() {
    this.props.dispatch({ type: 'app/getDic', payload: { type: DictionaryEnum.AUTH_STATUS } });
    this.getList();
  }

  renderSearchForm() {
    const { authStatus } = this.props;
    const SearchFormProps = {
      items: [
        { type: 'input', field: 'name', placeholder: '姓名' },
        { type: 'input', field: 'phone', placeholder: '手机号' },
        { type: 'select', children: authStatus, field: 'authState', placeholder: '授权状态' },
      ],
      actions: [
        { customtype: 'select', title: '查询', onClick: this.onSearchSubmit },
        { customtype: 'reset', title: '重置', onClick: this.onReset },
      ],
      columnNumOfRow: 4,
      // onSubmit: this.onSearchSubmit,
      onGetFormRef: this.onGetFormRef,
    };
    return <SearchForm {...SearchFormProps} />;
  }

  // eslint-disable-next-line max-lines-per-function
  renderTable() {
    const columns: ColumnProps<any>[] = [
      // {
      //   title: '通行证编号',
      //   dataIndex: 'licenceNo',
      //   key: 'licenceNo',
      //   width: DOUBLE_COLUMN_WIDTH,
      //   render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      // },
      {
        title: '姓名',
        width: DOUBLE_COLUMN_WIDTH,
        dataIndex: 'name',
        key: 'name',
        render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '联系电话',
        width: DOUBLE_COLUMN_WIDTH,
        dataIndex: 'phone',
        key: 'phone',
        render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '创建时间',
        width: DOUBLE_COLUMN_WIDTH,
        key: 'createTime',
        dataIndex: 'createTime',
        render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '授权状态',
        width: DOUBLE_COLUMN_WIDTH,
        key: 'authStateStr',
        dataIndex: 'authStateStr',
        render: (text: any, record: any) => {
          return (
            <div>
              <Badge status={this.getStateBadge(record.authState)} />
              {text}
            </div>
          );
        },
      },
      {
        title: '操作',
        width: DOUBLE_COLUMN_WIDTH,
        key: 'action',
        dataIndex: 'action',
        render: (_text: any, record: any) => (
          <Fragment>
            <Button
              customtype={'icon'}
              onClick={e => this.openModal(record)}
              icon={'pm-details'}
              title={'详情'}
            />
          </Fragment>
        ),
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
      actions: [{ customtype: 'master', title: '更新授权', onClick: this.updateAllAuthInfo }],
    };
    return <ButtonGroup {...ButtonGroupProps} />;
  }

  render() {
    const { visible, authData, licenceId } = this.state;
    return (
      <div className={classNames('height100', 'flexColStart')}>
        <Confirm type={'warning'} ref={this.confirmRef} />
        <OperatingResults ref={this.operateResultRef} />
        <AuthInfo
          type={'person'}
          updateAuthInfo={this.updateAuthInfo}
          updateAllAuth={this.getCurrentPage}
          authInfo={authData}
          licenceId={licenceId}
          visible={visible}
          onCancel={this.close}
        />
        <div className={'listTitle'}>信息筛选</div>
        {this.renderSearchForm()}
        <div className={'listTitle'}>信息展示</div>
        {this.renderButtonGroup()}
        {this.renderTable()}
      </div>
    );
  }

  getStateBadge = state => {
    switch (state) {
      case '0':
        return 'default';
      case '1':
        return 'success';
      case '3':
        return 'error';
      case '2':
        return 'error';
      default:
        return 'default';
    }
  };

  getList = () => {
    this.onChangePage(1, this.state.pageOption.pageSize);
  };

  getCurrentPage = () => {
    const { pageOption } = this.state;
    this.onChangePage(pageOption.current || 1, pageOption.pageSize);
  };

  tableOnChange = (pagination: PaginationConfig) => {
    this.onChangePage(pagination.current || 1, pagination.pageSize || 10);
  };

  onChangePage = async (page: number, pageSize: number = 10) => {
    const { dispatch } = this.props;
    const { pageOption } = this.state;
    const data = await dispatch({
      type: 'passport/getLicencePage',
      data: { page: page - 1, size: pageSize, ...this.queryCondition },
    });
    console.log(data);
    data.content.forEach(item => {
      // item.time = `${item.authorizeStartDate} ~ ${item.authorizeEndDate}`;
      // item.authStatusCN = item.certificationStatus === '1' ? '未认证' : '已认证'
    });
    this.setState({
      dataSource: data ? data.content : [],
      pageOption: {
        ...pageOption,
        current: page,
        pageSize,
        total: data.totalElements,
      },
    });
  };

  updateAuthInfo = async () => {
    this.getCurrentPage();
    const data = await this.props.dispatch({
      type: 'permit/getPersonAuthBaseInfo',
      data: { id: this.state.currentData.id },
    });
    copyArrParam(data.personTypeList, { type: 'key', value: 'typeStr' });
    this.setState({
      licenceId: this.state.currentData.id,
      currentData: this.state.currentData,
      authData: data,
    });
  };

  updateAllAuthInfo = async () => {
    const data = await this.props.dispatch({ type: 'permit/updateAllPersonPermit' });
    if (data && !data.error) {
      this.getList();
    } else if (this.operateResultRef.current) {
      this.operateResultRef.current.open(data);
    }
  };

  openModal = async (record: any) => {
    const data = await this.props.dispatch({
      type: 'permit/getPersonAuthBaseInfo',
      data: { id: record.id },
    });
    copyArrParam(data.personTypeList, { type: 'key', value: 'typeStr' });
    this.setState({
      licenceId: record.id,
      visible: true,
      currentData: record,
      authData: data,
    });
  };

  close = () => {
    this.setState({
      visible: false,
    });
  };

  onSearch = () => {};

  onReset = e => {
    this.searchForm.resetFields();
    this.onSearchSubmit();
  };

  onCancelModel = () => {
    this.setState({
      add: false,
      modify: false,
    });
  };

  onGetFormRef = (form: WrappedFormUtils) => {
    this.searchForm = form;
  };

  onSearchSubmit = async () => {
    await this.setQueryCondition();
    this.getList();
  };

  async setQueryCondition() {
    return new Promise<any>(resolve => {
      this.searchForm.validateFields((err, fieldsValue) => {
        if (err) return;
        this.queryCondition = fieldsValue;
        for (const item in fieldsValue) {
          if (fieldsValue.hasOwnProperty(item)) {
            fieldsValue[item] = fieldsValue[item] === -1 ? undefined : fieldsValue[item];
          }
        }
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

  onModelSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { dispatch } = this.props;
    this.modelForm.validateFields((err, fieldValues) => {
      const { add, modify } = this.state;
      if (!err) {
        if (add) {
          dispatch({ type: 'visit/addVisitDevice', data: fieldValues });
        } else if (modify) {
          dispatch({ type: 'visit/editVisitDevice', data: fieldValues });
        }
        this.setState({ add: false, modify: false });
      }
    });
  };
}

export default Passport;
