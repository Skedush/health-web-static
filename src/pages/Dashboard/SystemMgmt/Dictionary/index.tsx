import React, { PureComponent, Fragment, RefObject, createRef } from 'react';
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
} from '@/components/Library';
import {
  FormComponentProps,
  PaginationConfig,
  WrappedFormUtils,
  ColumnProps,
  UploadFile,
} from '@/components/Library/type';
import { GlobalState, UmiComponentProps } from '@/common/type';

const mapStateToProps = (state: GlobalState) => {
  return { dictionaryData: state.dictionary.dictionaryData };
};

type DictionaryStateProps = ReturnType<typeof mapStateToProps>;
type DictionaryProps = DictionaryStateProps & UmiComponentProps & FormComponentProps;

interface DictionaryState {
  add: boolean;
  modify: boolean;
  fileList: UploadFile[];
  showDeleteConfirm: boolean;
  selectedRowKeys: number[];
  searchFields: { [propName: string]: any };
  dictionary: any;
}

@connect(
  mapStateToProps,
  null,
)
class Dictionary extends PureComponent<DictionaryProps, DictionaryState> {
  searchForm: WrappedFormUtils;
  modelForm: WrappedFormUtils;
  confirmRef: RefObject<Confirm>;

  constructor(props: Readonly<DictionaryProps>) {
    super(props);
    this.confirmRef = createRef();
    this.state = {
      showDeleteConfirm: true,
      fileList: [],
      add: false,
      modify: false,
      selectedRowKeys: [],
      searchFields: {},
      dictionary: {},
    };
  }

  componentDidMount() {
    this.getDictionaryData({ page: 0 });
  }
  renderSearchForm() {
    const SearchFormProps = {
      items: [
        { type: 'input', field: 'dicType', placeholder: '类型描述关键字' },
        { type: 'input', field: 'dicKey', placeholder: '键关键字' },
        { type: 'input', field: 'dicValue', placeholder: '值关键字' },
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
        { customtype: 'master', title: '新增', onClick: this.addDictionary },
        { customtype: 'warning', title: '删除', onClick: this.batchdeleteDictionary },
      ],
    };
    return <ButtonGroup {...ButtonGroupProps} />;
  }

  // eslint-disable-next-line max-lines-per-function
  renderTable() {
    const { dictionaryData } = this.props;

    if (isEmpty(dictionaryData) || !dictionaryData) {
      return null;
    }

    const columns: ColumnProps<any>[] = [
      {
        title: '类型',
        dataIndex: 'dicType',
        key: 'dicType',
        width: '15%',
        align: 'center',
        render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '键',
        width: '15%',
        align: 'center',
        dataIndex: 'dicKey',
        key: 'dicKey',
        render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '值',
        width: '20%',
        align: 'center',
        dataIndex: 'dicValue',
        key: 'dicValue',
        render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '类型描述',
        width: '25%',
        align: 'center',
        dataIndex: 'remark',
        key: 'remark',
        render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '操作',
        align: 'center',
        width: '15%',
        key: 'action',
        render: (_text: any, record: any) =>
          dictionaryData ? (
            <Fragment>
              <Button
                customtype={'icon'}
                onClick={() => this.updateDictionary(record)}
                icon={'pm-edit'}
                title={'修改'}
              />
              <Button
                customtype={'icon'}
                onClick={() => this.deleteDictionary(record.id)}
                title={'删除'}
                icon={'pm-trash-can'}
              />
            </Fragment>
          ) : null,
      },
    ];

    const pagination: PaginationConfig = {
      position: 'bottom',
      total: dictionaryData.totalElements,
      current: dictionaryData.pageable.pageNumber + 1,
      pageSize: dictionaryData.pageable.pageSize,
      defaultCurrent: 1,
      // onChange: this.onChangePage,
    };

    return (
      <div className={classNames('flexAuto')}>
        <Table
          columns={columns}
          dataSource={dictionaryData.content}
          scroll={{ y: '100%' }}
          pagination={pagination}
          onSelectRow={this.onTableSelectRow}
          onChange={this.onTableChange}
        />
      </div>
    );
  }
  renderModalForm() {
    const { dictionary, modify, add } = this.state;
    const props = {
      items: [
        {
          type: 'hiddenInput',
          field: 'id',
          initialValue: dictionary.id,
          hidden: true,
        },
        {
          type: 'input',
          field: 'dicType',
          initialValue: dictionary.dicType,
          placeholder: '类型',
          // rules: [{ required: true, message: '请输入用户名!' }],
        },
        {
          type: 'input',
          field: 'dicKey',
          initialValue: dictionary.dicKey,
          placeholder: '字典code',
          // rules: [{ required: true, message: '请输入姓名!' }],
        },
        {
          type: 'input',
          field: 'dicValue',
          initialValue: dictionary.dicValue,
          placeholder: '显示值',
          // rules: [{ required: true, message: '请输入姓名!' }],
        },
        {
          type: 'input',
          field: 'dicSort',
          initialValue: dictionary.sdicSortrt,
          placeholder: '排序',
          // rules: [{ required: true, message: '请输入姓名!' }],
        },
        {
          type: 'input',
          field: 'remark',
          initialValue: dictionary.remark,
          placeholder: '类型说明',
          // rules: [{ required: true, message: '请输入姓名!' }],
        },
      ],
      actions: [
        { customtype: 'select', icon: 'search', title: '确定', htmlType: 'submit' as 'submit' },
        { customtype: 'second', title: '取消', onClick: this.onCancelModel },
      ],
      onSubmit: this.onModelSubmit,
      title: '修改数据字典信息',
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

  render() {
    return (
      <div className={classNames('height100', 'flexColStart')}>
        {this.renderSearchForm()}
        {this.renderButtonGroup()}
        {this.renderTable()}
        {this.renderModalForm()}
        {this.renderConfirm()}
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
      this.getDictionaryData(fieldsValue);
      // for (const item in fieldsValue) {
      //   if (fieldsValue.hasOwnProperty(item)) {
      //     fieldsValue[item] = fieldsValue[item] === -1 ? undefined : fieldsValue[item];
      //   }
      // }
    });
  };

  getDictionaryData = Fileds => {
    const { dispatch } = this.props;
    dispatch({ type: 'dictionary/getDictionary', payload: { ...Fileds } });
  };

  onTableChange = pagination => {
    console.log('pagination: ', pagination);
    const searchFields = { ...this.state.searchFields };
    searchFields.page = --pagination.current;
    searchFields.size = pagination.pageSize;
    this.getDictionaryData(searchFields);
  };

  addDictionary = () => {
    this.setState({
      add: true,
    });
  };

  searchFormReset = () => {
    this.searchForm.resetFields();
    this.getDictionaryData({ page: 0 });
  };

  onTableSelectRow = selectedRowKeys => {
    console.log('selectedRowKeys: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  };

  updateDictionary = (record: any) => {
    this.setState({
      modify: true,
      dictionary: record,
    });
  };

  onCancelModel = () => {
    this.setState({
      add: false,
      modify: false,
      dictionary: {},
    });
  };

  batchdeleteDictionary = () => {
    if (this.confirmRef.current) {
      this.confirmRef.current.open(
        () => this.ondeleteDictionary(this.state.selectedRowKeys),
        '删除',
        '是否确认删除选中的条目？',
      );
    }
  };

  deleteDictionary = (id: number) => {
    if (this.confirmRef.current) {
      this.confirmRef.current.open(() => this.ondeleteDictionary(id), '删除', '是否确认删除？');
    }
  };

  ondeleteDictionary = data => {
    const { dispatch } = this.props;
    dispatch({ type: 'dictionary/deleteDictionary', payload: { id: data } });
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

  onaddDictionary = fieldsValue => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dictionary/addDictionary',
      payload: fieldsValue,
    }).then(() => this.onCancelModel());
  };

  onUpdateDictionary = fieldsValue => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dictionary/updateDictionary',
      payload: fieldsValue,
    }).then(() => this.onCancelModel());
  };

  onModelSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { add, modify } = this.state;
    this.modelForm.validateFields((err, fieldsValue) => {
      if (!err) {
        if (add) {
          this.onaddDictionary(fieldsValue);
        } else if (modify) {
          this.onUpdateDictionary(fieldsValue);
        }
      }
    });
  };
}

export default Dictionary;
