import React from 'react';
// import styles from './index.less';
import { connect } from '@/utils/decorators';
import classNames from 'classnames';
import { Table, SearchForm, ButtonGroup } from '@/components/Library';
import { FormComponentProps, PaginationConfig, WrappedFormUtils } from '@/components/Library/type';
import themeColorClient from '@/utils/themeColorClient';
// import dark from '@/themes/templates/dark';
// import light from '@/themes/templates/light';
import { GlobalState, UmiComponentProps } from '@/common/type';
// import { add, minus } from '@/actions/app';

const mapStateToProps = (state: GlobalState) => {
  return {};
};

type PageStateProps = ReturnType<typeof mapStateToProps>;
type PageProps = PageStateProps & UmiComponentProps & FormComponentProps;

@connect(
  mapStateToProps,
  null,
)
class Page extends React.Component<PageProps> {
  searchForm: WrappedFormUtils;
  renderSearchForm() {
    const SearchFormProps = {
      items: [
        { type: 'input', field: '123', placeholder: '123123' },
        { type: 'input', field: '1111', placeholder: '123123' },
        { type: 'input', field: '222', placeholder: '123123' },
        { type: 'input', field: '333', placeholder: '123123' },
        { type: 'input', field: '555', placeholder: '123123' },
        { type: 'input', field: '444', placeholder: '123123' },
      ],
      actions: [
        { customtype: 'select', title: '查询', htmlType: 'submit' as 'submit' },
        { customtype: 'reset', title: '重置' },
      ],
      columnNumOfRow: 4,
      onSubmit: this.onSubmit,
      onGetFormRef: this.onGetFormRef,
    };
    return <SearchForm {...SearchFormProps} />;
  }
  renderButtonGroup() {
    const ButtonGroupProps = {
      actions: [
        {
          customtype: 'select',
          title: '查询',
          htmlType: 'submit' as 'submit',
          onClick: this.onSearch,
        },
        { customtype: 'reset', title: '重置', onClick: this.onReset },
      ],
    };
    return <ButtonGroup {...ButtonGroupProps} />;
  }

  renderTable() {
    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: text => <a>{text}</a>,
      },
      {
        title: 'Age',
        dataIndex: 'age',
        key: 'age',
      },
      {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
      },
      {
        title: 'Tags',
        key: 'tags',
        dataIndex: 'tags',
      },
      {
        title: 'Action',
        key: 'action',
      },
    ];

    const data = [
      {
        key: '1',
        name: 'John Brown',
        age: 32,
        address: 'New York No. 1 Lake Park',
        tags: ['nice', 'developer'],
      },
      {
        key: '2',
        name: 'Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park',
        tags: ['loser'],
      },
      {
        key: '3',
        name: 'Joe Black',
        age: 32,
        address: 'Sidney No. 1 Lake Park',
        tags: ['cool', 'teacher'],
      },
    ];
    const pagination: PaginationConfig = {
      position: 'bottom',
      total: 3,
      showTotal: (total, range) => `${range[1]}条/页， 共 ${total} 条`,
      pageSize: 2,
      defaultCurrent: 1,
      onChange: this.onChangePage,
    };
    return (
      <div className={classNames('flexAuto')}>
        <Table columns={columns} dataSource={data} scroll={{ y: '100%' }} pagination={pagination} />
      </div>
    );
  }

  render() {
    return (
      <div className={classNames('height100', 'flexColStart')}>
        {this.renderSearchForm()}
        {this.renderButtonGroup()}
        {this.renderTable()}
      </div>
    );
  }
  onChangePage = page => {
    // this.setState({
    //   current: page,
    // });
    // const { dispatch } = this.props;
    // let searchInfo = this.state.searchQueryData;
    // searchInfo.page = page - 1;
    // dispatch({
    //   type: 'realModel/getCompanyList',
    //   payload: searchInfo,
    // });
  };

  onSearch = () => {
    themeColorClient.changeColor('dark');
  };

  onReset = () => {
    themeColorClient.changeColor('light');
    // themeColorClient.changeColor(Object.values(light));
  };

  onGetFormRef = (form: WrappedFormUtils) => {
    this.searchForm = form;
  };
  onSubmit = () => {
    console.log('表单提交');
  };
}

export default Page;
