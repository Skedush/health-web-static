import React, { PureComponent, Fragment, RefObject, createRef } from 'react';
import moment from 'moment';
import styles from './index.less';
import { connect } from '@/utils/decorators';
import { isPhone, isIdCard } from '@/utils/validater';
import { onOverFlowHiddenCell } from '@/utils';
import classNames from 'classnames';
import { isEmpty } from 'lodash';
import {
  Table,
  SearchForm,
  ButtonGroup,
  Button,
  CommonComponent,
  ModalForm,
  Img,
  Confirm,
  ModalDetail,
} from '@/components/Library';
import {
  FormComponentProps,
  PaginationConfig,
  WrappedFormUtils,
  ColumnProps,
  UploadFile,
} from '@/components/Library/type';
import { GlobalState, UmiComponentProps } from '@/common/type';

const mapStateToProps = ({ communityPerson, loading: { effects } }: GlobalState) => {
  return {
    communityPersonData: communityPerson.communityPersonData,
    getCommunityPersonLoading: effects['communityPerson/getCommunityPerson'],
    addCommunityPersonLoading: effects['communityPerson/addCommunityPerson'],
    updateCommunityPersonLoading: effects['communityPerson/updateCommunityPerson'],
    deleteCommunityPersonLoading: effects['communityPerson/deleteCommunityPerson'],
  };
};

type CommunityPersonStateProps = ReturnType<typeof mapStateToProps>;
type CommunityPersonProps = CommunityPersonStateProps & UmiComponentProps & FormComponentProps;

interface CommunityPersonState {
  add: boolean;
  modify: boolean;
  fileList: UploadFile[];
  showDeleteConfirm: boolean;
  selectedRowKeys: number[];
  searchFields: { [propName: string]: any };
  communityPerson: any;
  communityPersonDetail: boolean;
}

@connect(
  mapStateToProps,
  null,
)
class CommunityPerson extends PureComponent<CommunityPersonProps, CommunityPersonState> {
  searchForm: WrappedFormUtils;
  modelForm: WrappedFormUtils;
  confirmRef: RefObject<Confirm>;

  constructor(props: Readonly<CommunityPersonProps>) {
    super(props);
    this.confirmRef = createRef();
    this.state = {
      showDeleteConfirm: true,
      fileList: [],
      add: false,
      modify: false,
      selectedRowKeys: [],
      searchFields: {},
      communityPerson: {},
      communityPersonDetail: false,
    };
  }

  componentDidMount() {
    this.getCommunityPersonData({ page: 0 });
  }
  renderSearchForm() {
    const SearchFormProps = {
      items: [{ type: 'input', field: 'name', placeholder: '姓名' }],
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
    const { addCommunityPersonLoading, deleteCommunityPersonLoading } = this.props;
    const ButtonGroupProps = {
      actions: [
        {
          customtype: 'master',
          title: '新增',
          onClick: this.addCommunityPerson,
          loading: addCommunityPersonLoading,
        },
        {
          customtype: 'warning',
          disabled: !this.state.selectedRowKeys.length,
          title: '删除',
          onClick: this.batchDeleteCommunityPerson,
          loading: deleteCommunityPersonLoading,
        },
      ],
    };
    return <ButtonGroup {...ButtonGroupProps} />;
  }

  // eslint-disable-next-line max-lines-per-function
  renderTable() {
    const { communityPersonData, getCommunityPersonLoading } = this.props;
    const { selectedRowKeys } = this.state;

    if (isEmpty(communityPersonData) || !communityPersonData) {
      return null;
    }

    const columns: ColumnProps<any>[] = [
      {
        title: '照片',
        dataIndex: 'image',
        key: 'image',
        width: '15%',
        align: 'center',
        render: (text: any, record: object) => (
          <Img image={text} className={styles.image} previewImg={true} />
        ),
      },
      {
        title: '姓名',
        width: '10%',
        align: 'center',
        dataIndex: 'name',
        key: 'name',
        render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '职位',
        width: '10%',
        align: 'center',
        dataIndex: 'position',
        key: 'position',
        render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '联系电话',
        width: '10%',
        align: 'center',
        key: 'phone',
        dataIndex: 'phone',
        render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '登记时间',
        width: '15%',
        align: 'center',
        key: 'registerTime',
        dataIndex: 'registerTime',
        render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '备注',
        width: '20%',
        align: 'center',
        key: 'remark',
        onCell: onOverFlowHiddenCell,
        dataIndex: 'remark',
        render: (text: any, record: object) =>
          CommonComponent.renderTableOverFlowHidden(text, record),
      },
      {
        title: '操作',
        align: 'center',
        width: '25%',
        key: 'action',
        render: (_text: any, record: any) =>
          communityPersonData ? (
            <Fragment>
              <Button
                customtype={'icon'}
                onClick={e => this.openModelDetail(record, e)}
                icon={'pm-details'}
                title={'详情'}
              />
              <Button
                customtype={'icon'}
                onClick={e => this.updateCommunityPerson(record, e)}
                icon={'pm-edit'}
                title={'修改'}
              />
              <Button
                customtype={'icon'}
                onClick={e => this.deleteCommunityPerson(record.id, e)}
                title={'删除'}
                icon={'pm-trash-can'}
              />
            </Fragment>
          ) : null,
      },
    ];
    const pagination: PaginationConfig = {
      position: 'bottom',
      total: communityPersonData.totalElements,
      pageSize: communityPersonData.pageable.pageSize,
      defaultCurrent: 1,
      current: communityPersonData.pageable.pageNumber + 1,
    };

    return (
      <div className={classNames('flexAuto')}>
        <Table
          columns={columns}
          dataSource={communityPersonData.content}
          scroll={{ y: '100%' }}
          pagination={pagination}
          onSelectRow={this.onTableSelectRow}
          // onRowClick={this.onRowCilck}
          onChange={this.onTableChange}
          loading={getCommunityPersonLoading}
          selectedRow={selectedRowKeys}
        />
      </div>
    );
  }
  // eslint-disable-next-line max-lines-per-function
  renderModalForm() {
    const { modify, add, fileList } = this.state;
    let { communityPerson } = this.state;
    const { addCommunityPersonLoading, updateCommunityPersonLoading } = this.props;
    if (add) {
      communityPerson = {};
    }
    const props = {
      items: [
        {
          type: 'hiddenInput',
          field: 'id',
          initialValue: communityPerson.id,
          hidden: true,
        },
        {
          type: 'upload',
          uploadType: 'picture',
          field: 'image',
          initialValue: communityPerson.image,
          title: '照片',
          placeholder: '照片',
          fileList: fileList,
          fill: true,
          maxFiles: 1,
          onChange: this.onChangeFile,
          rules: [
            { required: true, message: '请上传照片!' },
            // {
            //   validator: uploadImage,
            // },
          ],
        },

        {
          type: 'input',
          maxLength: 10,
          field: 'name',
          initialValue: communityPerson.name,
          placeholder: '姓名',
          rules: [{ required: true, message: '请输入姓名!' }],
        },
        {
          type: 'input',
          initialValue: communityPerson.phone,
          maxLength: 15,
          field: 'phone',
          placeholder: '电话',
          rules: [
            { required: true, message: '请输入电话!' },
            {
              validator: isPhone,
            },
          ],
        },
        {
          type: 'input',
          initialValue: communityPerson.position,
          maxLength: 20,
          field: 'position',
          placeholder: '职位',
          rules: [{ required: true, message: '请输入职位!' }],
        },
        {
          type: 'input',
          initialValue: communityPerson.idCard,
          maxLength: 20,
          field: 'idCard',
          placeholder: '证件号码',
          rules: [
            { required: true, message: '请输入证件号码!' },
            {
              validator: isIdCard,
            },
          ],
        },
        {
          type: 'textArea',
          maxLength: 255,
          field: 'remark',
          placeholder: '备注',
          fill: true,
          initialValue: communityPerson.remark,
        },
      ],
      actions: [
        {
          customtype: 'select',
          icon: 'search',
          title: '确定',
          htmlType: 'submit' as 'submit',
          loading: addCommunityPersonLoading || updateCommunityPersonLoading,
        },
        { customtype: 'second', title: '取消', onClick: this.onCancelModel },
      ],
      onSubmit: this.onModelSubmit,
      title: modify ? '修改居委干部信息' : '新增居委干部信息',
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

  renderModalDetail() {
    const { communityPerson = {}, communityPersonDetail } = this.state;
    const props = {
      items: [
        {
          name: '姓名',
          value: communityPerson.name,
        },
        {
          name: '联系电话',
          value: communityPerson.phone,
        },
        {
          name: '职位',
          value: communityPerson.position,
        },
        {
          name: '证件号码',
          value: communityPerson.idCard,
        },
        {
          name: '登记时间',
          value: communityPerson.registerTime,
        },
        {
          name: '备注',
          value: communityPerson.remark,
        },
      ],
      images: [
        {
          name: '登记照',
          url: communityPerson.image,
        },
      ],
      info: communityPerson || {},
      visible: communityPersonDetail,
      onCancel: this.onCancelModel,
      title: '居委干部详情',
    };

    return <ModalDetail {...props} />;
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
        {this.renderModalDetail()}
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
      this.getCommunityPersonData(fieldsValue);
      // for (const item in fieldsValue) {
      //   if (fieldsValue.hasOwnProperty(item)) {
      //     fieldsValue[item] = fieldsValue[item] === -1 ? undefined : fieldsValue[item];
      //   }
      // }
    });
  };

  getCommunityPersonData = Fileds => {
    const { dispatch } = this.props;
    this.setState({ selectedRowKeys: [] });
    dispatch({ type: 'communityPerson/getCommunityPerson', payload: { ...Fileds } });
  };

  // onChangePage = (page: number, pageSize: number) => {
  //   console.log('page: ', page);
  //   const searchFields = { ...this.state.searchFields };
  //   searchFields.page = --page;
  //   searchFields.size = pageSize;
  //   this.getCommunityPersonData(searchFields);
  // };

  onTableChange = (pagination, filters, sorter, extra) => {
    console.log('pagination: ', pagination);
    const searchFields = { ...this.state.searchFields };
    searchFields.page = --pagination.current;
    searchFields.size = pagination.pageSize;
    this.getCommunityPersonData(searchFields);
  };

  addCommunityPerson = () => {
    this.setState({
      add: true,
    });
  };

  searchFormReset = () => {
    this.searchForm.resetFields();
    this.setState({
      searchFields: {},
    });
    this.getCommunityPersonData({ page: 0 });
  };

  onTableSelectRow = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys });
  };

  updateCommunityPerson = (record: any, e) => {
    e.stopPropagation();
    const fileList = [
      {
        uid: '1',
        name: 'image.jpg',
        size: 1435417,
        type: 'image/png',
        url: record.image,
      },
    ];
    this.setState({
      modify: true,
      communityPerson: record,
      fileList,
    });
  };

  onCancelModel = () => {
    this.setState({
      add: false,
      modify: false,
      fileList: [],
      communityPersonDetail: false,
    });
  };

  batchDeleteCommunityPerson = () => {
    if (this.confirmRef.current) {
      this.confirmRef.current.open(
        () => this.onDeleteCommunityPerson(this.state.selectedRowKeys),
        '删除',
        '是否确认删除选中的条目？',
      );
    }
  };

  deleteCommunityPerson = (id: number, e) => {
    e.stopPropagation();
    if (this.confirmRef.current) {
      this.confirmRef.current.open(
        () => this.onDeleteCommunityPerson([id]),
        '删除',
        '是否确认删除？',
      );
    }
  };

  onDeleteCommunityPerson = data => {
    const { dispatch } = this.props;
    dispatch({ type: 'communityPerson/deleteCommunityPerson', payload: data }).then(() =>
      this.getCommunityPersonData({ page: 0 }),
    );
  };

  onGetFormRef = (form: WrappedFormUtils) => {
    this.searchForm = form;
  };

  onChangeFile = info => {
    this.setState({
      fileList: info.fileList,
    });
  };

  onDatePickerChange = (date: moment.Moment, dateString: string) => {};

  onSelectChange = (value, option) => {};

  onAddCommunityPerson = fieldsValue => {
    const { dispatch } = this.props;
    dispatch({
      type: 'communityPerson/addCommunityPerson',
      payload: fieldsValue,
    }).then(() => {
      this.onCancelModel();
      this.getCommunityPersonData({ page: 0 });
    });
  };

  onUpdateCommunityPerson = fieldsValue => {
    const { dispatch } = this.props;
    dispatch({
      type: 'communityPerson/updateCommunityPerson',
      payload: fieldsValue,
    }).then(() => {
      this.onCancelModel();
      this.getCommunityPersonData({ page: 0 });
    });
  };

  onModelSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { add, modify } = this.state;
    this.modelForm.validateFields((err, fieldsValue) => {
      if (!err) {
        const formData = new FormData();
        for (const key in fieldsValue) {
          if (fieldsValue[key] === undefined) {
            continue;
          }
          if (key !== 'image' && key !== 'idCardImage' && fieldsValue.hasOwnProperty(key)) {
            formData.set(key, fieldsValue[key]);
          } else if ((key === 'image' || key === 'idCardImage') && fieldsValue[key].file) {
            formData.set(key, fieldsValue[key].file);
          }
        }
        if (add) {
          this.onAddCommunityPerson(formData);
        } else if (modify) {
          this.onUpdateCommunityPerson(formData);
        }
      }
    });
  };

  onRowCilck = (record: any, index: number, event: Event) => {
    event.stopPropagation();
    this.openModelDetail(record, event);
  };

  openModelDetail = (record, e) => {
    e.stopPropagation();
    this.setState({ communityPerson: record, communityPersonDetail: true });
  };
}

export default CommunityPerson;
