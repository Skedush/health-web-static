import React, { PureComponent, RefObject, createRef } from 'react';
import { connect } from '@/utils/decorators';
import classNames from 'classnames';
import { isEmpty } from 'lodash';
import { Table, SearchForm, CommonComponent, Confirm } from '@/components/Library';
import {
  FormComponentProps,
  PaginationConfig,
  WrappedFormUtils,
  ColumnProps,
} from '@/components/Library/type';
import { GlobalState, UmiComponentProps } from '@/common/type';
import { SINGLE_COLUMN_WIDTH, DOUBLE_COLUMN_WIDTH } from '@/utils/constant';

const mapStateToProps = ({ signIn, loading: { effects } }: GlobalState) => {
  return { signInData: signIn.signInData, getSignInLoading: effects['operating/getSignIn'] };
};

type SignInStateProps = ReturnType<typeof mapStateToProps>;
type SignInProps = SignInStateProps & UmiComponentProps & FormComponentProps;

interface SignInState {
  searchFields: { [propName: string]: any };
  signIn: any;
}

@connect(
  mapStateToProps,
  null,
)
class SignIn extends PureComponent<SignInProps, SignInState> {
  searchForm: WrappedFormUtils;
  modelForm: WrappedFormUtils;
  confirmRef: RefObject<Confirm>;

  constructor(props: Readonly<SignInProps>) {
    super(props);
    this.confirmRef = createRef();
    this.state = {
      searchFields: {},
      signIn: {},
    };
  }

  componentDidMount() {
    this.getSignInData({ page: 0 });
  }
  renderSearchForm() {
    const SearchFormProps = {
      items: [
        { type: 'input', field: 'userName', placeholder: '登录账号' },
        { type: 'input', field: 'name', placeholder: '姓名' },
        { type: 'input', field: 'ip', placeholder: 'IP地址' },
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

  // eslint-disable-next-line max-lines-per-function
  renderTable() {
    const { signInData, getSignInLoading } = this.props;

    if (isEmpty(signInData) || !signInData) {
      return null;
    }

    const columns: ColumnProps<any>[] = [
      {
        title: '登录账号',
        width: SINGLE_COLUMN_WIDTH,
        dataIndex: 'userName',
        key: 'userName',
        render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '姓名',
        width: DOUBLE_COLUMN_WIDTH,
        dataIndex: 'name',
        key: 'name',
        render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '登录时间',
        width: DOUBLE_COLUMN_WIDTH,
        dataIndex: 'optTime',
        key: 'optTime',
        render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: 'IP地址',
        width: DOUBLE_COLUMN_WIDTH,
        dataIndex: 'ip',
        key: 'ip',
        render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '日志摘要',
        dataIndex: 'description',
        key: 'description',
        width: DOUBLE_COLUMN_WIDTH,
        render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '登录类型',
        width: DOUBLE_COLUMN_WIDTH,
        dataIndex: 'optType',
        key: 'optType',
        render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      },
    ];

    const pagination: PaginationConfig = {
      position: 'bottom',
      total: signInData.totalElements,
      current: signInData.pageable.pageNumber + 1,
      showTotal: (total, range) => {
        return `${range[1] - range[0] + 1}条/页， 共 ${total} 条`;
      },
      pageSize: signInData.pageable.pageSize,
      defaultCurrent: 1,

      // onChange: this.onChangePage,
    };

    return (
      <div className={classNames('flexAuto')}>
        <Table
          columns={columns}
          dataSource={signInData.content}
          scroll={{ y: '100%' }}
          pagination={pagination}
          loading={getSignInLoading}
          onChange={this.onTableChange}
          type={'none'}
        />
      </div>
    );
  }

  render() {
    return (
      <div className={classNames('height100', 'flexColStart')}>
        <div className={'listTitle'}>信息筛选</div>
        {this.renderSearchForm()}
        <div className={'listTitle'}>信息展示</div>
        {this.renderTable()}
      </div>
    );
  }

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
      this.getSignInData(fieldsValue);
    });
  };

  getSignInData = Fileds => {
    const { dispatch } = this.props;
    dispatch({ type: 'signIn/getSignIn', payload: { ...Fileds } });
  };

  onTableChange = pagination => {
    console.log('pagination: ', pagination);
    const searchFields = { ...this.state.searchFields };
    searchFields.page = --pagination.current;
    searchFields.size = pagination.pageSize;
    this.getSignInData(searchFields);
  };

  searchFormReset = () => {
    this.searchForm.resetFields();
    this.setState({
      searchFields: {},
    });
    this.getSignInData({ page: 0 });
  };

  onGetFormRef = (form: WrappedFormUtils) => {
    this.searchForm = form;
  };
}

export default SignIn;
