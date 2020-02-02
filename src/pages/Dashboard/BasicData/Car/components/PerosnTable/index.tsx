import React, { PureComponent, Fragment } from 'react';
import { PaginationConfig, ColumnProps, WrappedFormUtils } from '@/components/Library/type';
import { Table, SearchForm, CommonComponent, Button, Img, Col, Row } from '@/components/Library';
import { isEmpty } from 'lodash';
import { connect } from '@/utils/decorators';
import styles from './index.less';
import { GlobalState, UmiComponentProps } from '@/common/type';

interface PersonTableState {
  searchFields: any;
  selectedRowKeys: string[];
}
const mapStateToProps = ({ carGlobal, loading: { effects } }: GlobalState) => {
  return {
    personTableData: carGlobal.personTableData,
    loading: {
      getPersonTableLoading: effects['carGlobal/getPersonTable'],
    },
  };
};

type PersonTableStateProps = ReturnType<typeof mapStateToProps>;

type PersonTableProps = UmiComponentProps &
  PersonTableStateProps & {
    carType: string;
    setPersonData: Function;
    onFormNext: Function;
    // visible: boolean;
  };
@connect(
  mapStateToProps,
  null,
)
class PersonTable extends PureComponent<any, PersonTableState> {
  searchForm: WrappedFormUtils;
  selectedData: any[] = [];

  constructor(props: Readonly<PersonTableProps>) {
    super(props);
    this.state = {
      searchFields: {},
      selectedRowKeys: [],
    };
  }
  renderSearchForm() {
    const SearchFormProps = {
      items: [
        { type: 'input', field: 'name', placeholder: '姓名' },
        { type: 'input', field: 'phone', placeholder: '手机号' },
      ],
      actions: [
        { customtype: 'select', title: '查询', htmlType: 'submit' as 'submit' },
        { customtype: 'reset', title: '重置', onClick: this.searchFormReset },
      ],
      columnNumOfRow: 4,
      onSubmit: this.onSearch,
      onGetFormRef: (form: WrappedFormUtils) => {
        this.searchForm = form;
      },
    };
    return <SearchForm {...SearchFormProps} />;
  }

  renderTable() {
    const {
      personTableData,
      loading: { getPersonTableLoading },
    } = this.props;
    const { selectedRowKeys } = this.state;
    if (isEmpty(personTableData) || !personTableData) {
      return null;
    }
    const columns: ColumnProps<any>[] = this.getColumns();

    const pagination: PaginationConfig = {
      position: 'bottom',
      total: personTableData.totalElements,
      current: personTableData.pageable.pageNumber + 1,
      pageSize: personTableData.pageable.pageSize,
      defaultCurrent: 1,
    };

    return (
      <div className={'flexAuto'}>
        <Table
          selectedRow={selectedRowKeys}
          onSelectRow={this.selectedChange}
          type={'radio'}
          columns={columns}
          dataSource={personTableData.content}
          scroll={{ y: '100%' }}
          pagination={pagination}
          loading={getPersonTableLoading}
          onChange={this.onTableChange}
          onRowClick={this.onRowClick}
        />
      </div>
    );
  }

  render() {
    const { selectedRowKeys } = this.state;
    const actions = [
      {
        customtype: 'select',
        title: '下一步',
        disabled: selectedRowKeys.length === 0,
        onClick: this.props.onFormNext,
      },
    ];
    const actionsCol = this.getAction(actions);
    return (
      <Fragment>
        {this.renderSearchForm()}
        {this.renderTable()}
        <Row>{actionsCol}</Row>
      </Fragment>
    );
  }

  getAction = actions => {
    if (!Array.isArray(actions)) {
      console.error('data of from action is not array');
      return null;
    }
    const actionsElements = actions.map((item, index) => {
      const { title } = item;
      return (
        <Button key={`actionBtn${index}`} style={{ marginLeft: 10 }} {...item}>
          {title}
        </Button>
      );
    });
    return (
      <Col span={24} className={styles.buttonCol}>
        {actionsElements}
      </Col>
    );
  };

  // eslint-disable-next-line max-lines-per-function
  getColumns = () => {
    const { carType } = this.props;
    let columns: ColumnProps<any>[] = [];
    switch (carType) {
      case '1':
        columns = [
          {
            title: '登记照',
            width: '10%',
            align: 'center',
            dataIndex: 'bpImageUrl',
            key: 'bpImageUrl',
            render: (text: any, record: object) => (
              <Img image={text} className={styles.image} previewImg={true} />
            ),
          },
          {
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
            width: '10%',
            align: 'center',
            render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
          },
          {
            title: '联系电话',
            width: '12%',
            align: 'center',
            key: 'phone',
            dataIndex: 'phone',
            render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
          },
          {
            title: '证件地址',
            // width: '25%',
            align: 'center',
            key: 'domicile',
            dataIndex: 'domicile',
            render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
          },
          {
            title: '登记时间',
            width: '25%',
            align: 'center',
            key: 'tCreateTime',
            dataIndex: 'tCreateTime',
            render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
          },
        ];
        break;
      case '2':
        columns = [
          {
            title: '登记照',
            width: '10%',
            align: 'center',
            dataIndex: 'image',
            key: 'image',
            render: (text: any, record: object) => (
              <Img image={text} className={styles.image} previewImg={true} />
            ),
          },
          {
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
            width: '10%',
            align: 'center',
            render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
          },
          {
            title: '联系电话',
            width: '15%',
            align: 'center',
            key: 'phone',
            dataIndex: 'phone',
            render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
          },
          {
            title: '职位',
            width: '15%',
            align: 'center',
            key: 'position',
            dataIndex: 'position',
            render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
          },
          {
            title: '登记时间',
            // width: '25%',
            align: 'center',
            key: 'registerTime',
            dataIndex: 'registerTime',
            render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
          },
        ];
        break;
      case '3':
        columns = [
          {
            title: '登记照',
            width: '10%',
            align: 'center',
            dataIndex: 'image',
            key: 'image',
            render: (text: any, record: object) => (
              <Img image={text} className={styles.image} previewImg={true} />
            ),
          },
          {
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
            width: '10%',
            align: 'center',
            render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
          },
          {
            title: '联系电话',
            width: '12%',
            align: 'center',
            key: 'phone',
            dataIndex: 'phone',
            render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
          },
          {
            title: '单位名称',
            width: '15%',
            align: 'center',
            key: 'companyName',
            dataIndex: 'companyName',
            render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
          },
          {
            title: '登记时间',
            // width: '15%',
            align: 'center',
            key: 'registerTime',
            dataIndex: 'registerTime',
            render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
          },
        ];
        break;
      case '4':
        columns = [
          {
            title: '登记照',
            width: '10%',
            align: 'center',
            dataIndex: 'image',
            key: 'image',
            render: (text: any, record: object) => (
              <Img image={text} className={styles.image} previewImg={true} />
            ),
          },
          {
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
            width: '10%',
            align: 'center',
            render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
          },
          {
            title: '联系电话',
            width: '15%',
            align: 'center',
            key: 'phone',
            dataIndex: 'phone',
            render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
          },
          {
            title: '证件地址',
            width: '25%',
            align: 'center',
            key: 'domicile',
            dataIndex: 'domicile',
            render: (text: any, record: object) =>
              CommonComponent.renderTableOverFlowHidden(text, record),
          },
          {
            title: '登记时间',
            // width: '15%',
            align: 'center',
            key: 'createdTime',
            dataIndex: 'createdTime',
            render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
          },
        ];
        break;
      default:
        break;
    }
    return columns;
  };

  onTableChange = (pagination, filters, sorter, extra) => {
    const searchFields = { ...this.state.searchFields };
    searchFields.size = pagination.pageSize;
    this.setState({
      searchFields,
    });
    searchFields.page = --pagination.current;
    searchFields.size = pagination.pageSize;
    this.props.getPersonData(searchFields);
  };

  selectedChange = (keys, data) => {
    const record = data[0];
    this.selectedData = data;
    this.setState({
      selectedRowKeys: keys,
    });
    this.props.setPersonData({
      id: record.personId,
      name: record.name,
      idCard: record.idCard,
      phone: record.phone,
    });
  };

  onRowClick = (record, index, e) => {
    this.selectedChange([record.id ? record.id : index], [record]);
  };

  searchFormReset = () => {
    this.setState({
      searchFields: {},
      selectedRowKeys: [],
    });
    this.searchForm.resetFields();
    this.getPersonData({ page: 0 });
  };

  onSearch = (e: React.FormEvent<HTMLFormElement>) => {
    if (e) {
      e.preventDefault();
    }
    this.searchForm.validateFields((err, fieldsValue) => {
      if (err) return;
      this.setState({
        searchFields: { ...fieldsValue },
        selectedRowKeys: [],
      });
      fieldsValue.page = 0;
      this.getPersonData(fieldsValue);
    });
  };

  getPersonData = Fileds => {
    const { dispatch, carType } = this.props;
    const payload = { ...Fileds, carType };
    if (carType === '1') {
      payload.isAdult = true;
    }
    dispatch({ type: 'carGlobal/getPersonTable', payload });
  };
}
export default PersonTable;
