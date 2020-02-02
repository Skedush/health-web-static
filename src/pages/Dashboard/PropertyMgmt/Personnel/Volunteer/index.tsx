import React, { PureComponent, Fragment, RefObject, createRef } from 'react';
import moment from 'moment';
import styles from './index.less';
import { connect } from '@/utils/decorators';
import { onOverFlowHiddenCell } from '@/utils';
import classNames from 'classnames';
import { isPhone, isIdCard } from '@/utils/validater';
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

const mapStateToProps = ({ volunteer, loading: { effects } }: GlobalState) => {
  return {
    volunteerData: volunteer.volunteerData,
    getVolunteerLoading: effects['volunteer/getVolunteer'],
    addVolunteerLoading: effects['volunteer/addVolunteer'],
    updateVolunteerLoading: effects['volunteer/updateVolunteer'],
    deleteVolunteerLoading: effects['volunteer/deleteVolunteer'],
  };
};

type VolunteerStateProps = ReturnType<typeof mapStateToProps>;
type VolunteerProps = VolunteerStateProps & UmiComponentProps & FormComponentProps;

interface VolunteerState {
  add: boolean;
  modify: boolean;
  fileList: UploadFile[];
  showDeleteConfirm: boolean;
  selectedRowKeys: number[];
  searchFields: { [propName: string]: any };
  volunteer: any;
  volunteerDetail: boolean;
}

@connect(
  mapStateToProps,
  null,
)
class Volunteer extends PureComponent<VolunteerProps, VolunteerState> {
  searchForm: WrappedFormUtils;
  modelForm: WrappedFormUtils;
  confirmRef: RefObject<Confirm>;

  constructor(props: Readonly<VolunteerProps>) {
    super(props);
    this.confirmRef = createRef();
    this.state = {
      showDeleteConfirm: true,
      fileList: [],
      add: false,
      modify: false,
      selectedRowKeys: [],
      searchFields: {},
      volunteer: {},
      volunteerDetail: false,
    };
  }

  componentDidMount() {
    this.getVolunteerData({ page: 0 });
  }
  renderSearchForm() {
    const SearchFormProps = {
      items: [
        { type: 'input', field: 'name', placeholder: '姓名' },
        { type: 'input', field: 'position', placeholder: '职业' },
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
    const { addVolunteerLoading, deleteVolunteerLoading } = this.props;
    const ButtonGroupProps = {
      actions: [
        {
          customtype: 'master',
          title: '新增',
          onClick: this.addVolunteer,
          loading: addVolunteerLoading,
        },
        {
          customtype: 'warning',
          disabled: !this.state.selectedRowKeys.length,
          title: '删除',
          onClick: this.batchDeleteVolunteer,
          loading: deleteVolunteerLoading,
        },
      ],
    };
    return <ButtonGroup {...ButtonGroupProps} />;
  }

  // eslint-disable-next-line max-lines-per-function
  renderTable() {
    const { volunteerData, getVolunteerLoading } = this.props;
    const { selectedRowKeys } = this.state;
    if (isEmpty(volunteerData) || !volunteerData) {
      return null;
    }

    const columns: ColumnProps<any>[] = [
      {
        title: '登记照',
        dataIndex: 'image',
        key: 'image',
        width: '10%',
        render: (text: any, record: object) => (
          <Img image={text} className={styles.image} previewImg={true} />
        ),
      },
      {
        title: '姓名',
        width: '8%',
        dataIndex: 'name',
        key: 'name',
        render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '职业',
        width: '8%',
        dataIndex: 'position',
        key: 'position',
        render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '联系电话',
        width: '10%',
        dataIndex: 'phone',
        key: 'phone',
        render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '登记时间',
        width: '10%',
        key: 'registerTime',
        dataIndex: 'registerTime',
        render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '备注',
        width: '20%',
        key: 'remark',
        dataIndex: 'remark',
        onCell: onOverFlowHiddenCell,
        render: (text: any, record: object) =>
          CommonComponent.renderTableOverFlowHidden(text, record),
      },

      {
        title: '操作',
        // width: '25%',
        align: 'center',
        key: 'action',
        render: (_text: any, record: any) =>
          volunteerData ? (
            <Fragment>
              <Button
                customtype={'icon'}
                onClick={e => this.openModelDetail(record, e)}
                icon={'pm-details'}
                title={'详情'}
              />
              <Button
                customtype={'icon'}
                onClick={e => this.updateVolunteer(record, e)}
                icon={'pm-edit'}
                title={'修改'}
              />
              <Button
                customtype={'icon'}
                onClick={e => this.deleteVolunteer(record.id, e)}
                title={'删除'}
                icon={'pm-trash-can'}
              />
            </Fragment>
          ) : null,
      },
    ];

    const pagination: PaginationConfig = {
      position: 'bottom',
      total: volunteerData.totalElements,
      current: volunteerData.pageable.pageNumber + 1,
      pageSize: volunteerData.pageable.pageSize,
      defaultCurrent: 1,
    };

    return (
      <div className={classNames('flexAuto')}>
        <Table
          columns={columns}
          dataSource={volunteerData.content}
          scroll={{ y: '100%' }}
          pagination={pagination}
          loading={getVolunteerLoading}
          onSelectRow={this.onTableSelectRow}
          onChange={this.onTableChange}
          // onRowClick={this.onRowCilck}
          selectedRow={selectedRowKeys}
        />
      </div>
    );
  }
  // eslint-disable-next-line max-lines-per-function
  renderModalForm() {
    const { modify, add, fileList } = this.state;
    const { addVolunteerLoading, updateVolunteerLoading } = this.props;
    let { volunteer } = this.state;
    if (add) {
      volunteer = {};
    }
    const props = {
      items: [
        {
          type: 'hiddenInput',
          field: 'id',
          initialValue: volunteer.id,
          hidden: true,
        },
        {
          type: 'upload',
          uploadType: 'picture',
          field: 'image',
          initialValue: volunteer.image,
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
          initialValue: volunteer.name,
          placeholder: '姓名',
          rules: [{ required: true, message: '请输入姓名!' }],
        },
        {
          type: 'input',
          initialValue: volunteer.phone,
          maxLength: 15,
          field: 'phone',
          placeholder: '联系电话',
          rules: [
            { required: true, message: '请输入电话!' },
            {
              validator: isPhone,
            },
          ],
        },
        {
          type: 'input',
          maxLength: 20,
          field: 'position',
          initialValue: volunteer.position,
          placeholder: '职业',
          rules: [{ required: true, message: '请输入职业!' }],
        },

        {
          type: 'input',
          initialValue: volunteer.idCard,
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
          initialValue: volunteer.remark,
          fill: true,
          field: 'remark',
          // height: '120px',
          placeholder: '备注',
        },
      ],
      actions: [
        {
          customtype: 'select',
          icon: 'search',
          title: '确定',
          htmlType: 'submit' as 'submit',
          loading: addVolunteerLoading || updateVolunteerLoading,
        },
        { customtype: 'second', title: '取消', onClick: this.onCancelModel },
      ],
      onSubmit: this.onModelSubmit,
      title: modify ? '修改志愿者信息' : '新增志愿者信息',
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
    const { volunteer = {}, volunteerDetail } = this.state;
    const props = {
      items: [
        {
          name: '姓名',
          value: volunteer.name,
        },
        {
          name: '联系电话',
          value: volunteer.phone,
        },
        {
          name: '职业',
          value: volunteer.position,
        },
        {
          name: '证件号码',
          value: volunteer.idCard,
        },
        {
          name: '登记时间',
          value: volunteer.registerTime,
        },
        {
          name: '备注',
          value: volunteer.remark,
        },
      ],
      images: [
        {
          name: '登记照',
          url: volunteer.image,
        },
      ],
      info: volunteer || {},
      visible: volunteerDetail,
      onCancel: this.onCancelModel,
      title: '志愿者详情',
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
        {this.renderModalDetail()}
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
      this.getVolunteerData(fieldsValue);
      // for (const item in fieldsValue) {
      //   if (fieldsValue.hasOwnVolunteer(item)) {
      //     fieldsValue[item] = fieldsValue[item] === -1 ? undefined : fieldsValue[item];
      //   }
      // }
    });
  };

  getVolunteerData = Fileds => {
    const { dispatch } = this.props;
    this.setState({ selectedRowKeys: [] });
    dispatch({ type: 'volunteer/getVolunteer', payload: { ...Fileds } });
  };

  // onChangePage = (page: number, pageSize: number) => {
  //   console.log('page: ', page);
  //   const searchFields = { ...this.state.searchFields };
  //   searchFields.page = --page;
  //   searchFields.size = pageSize;
  //   this.getVolunteerData(searchFields);
  // };

  onTableChange = (pagination, filters, sorter, extra) => {
    const searchFields = { ...this.state.searchFields };
    searchFields.page = --pagination.current;
    searchFields.size = pagination.pageSize;
    this.getVolunteerData(searchFields);
  };

  addVolunteer = () => {
    this.setState({
      add: true,
    });
  };

  searchFormReset = () => {
    this.searchForm.resetFields();
    this.setState({
      searchFields: {},
    });
    this.getVolunteerData({ page: 0 });
  };

  onTableSelectRow = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys });
  };

  updateVolunteer = (record: any, e) => {
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
      volunteer: record,
      fileList,
    });
  };

  onCancelModel = () => {
    this.setState({
      add: false,
      modify: false,
      volunteerDetail: false,
      fileList: [],
    });
  };

  batchDeleteVolunteer = () => {
    if (this.confirmRef.current) {
      this.confirmRef.current.open(
        () => this.onDeleteVolunteer(this.state.selectedRowKeys),
        '删除',
        '是否确认删除选中的条目？',
      );
    }
  };

  deleteVolunteer = (id: number, e) => {
    e.stopPropagation();
    if (this.confirmRef.current) {
      this.confirmRef.current.open(() => this.onDeleteVolunteer([id]), '删除', '是否确认删除？');
    }
  };

  onDeleteVolunteer = data => {
    const { dispatch } = this.props;
    dispatch({ type: 'volunteer/deleteVolunteer', payload: data }).then(() =>
      this.getVolunteerData({ page: 0 }),
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

  onAddVolunteer = fieldsValue => {
    const { dispatch } = this.props;
    dispatch({
      type: 'volunteer/addVolunteer',
      payload: fieldsValue,
    }).then(() => {
      this.onCancelModel();
      this.getVolunteerData({ page: 0 });
    });
  };

  onUpdateVolunteer = fieldsValue => {
    const { dispatch } = this.props;
    dispatch({
      type: 'volunteer/updateVolunteer',
      payload: fieldsValue,
    }).then(() => {
      this.onCancelModel();
      this.getVolunteerData({ page: 0 });
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
          this.onAddVolunteer(formData);
        } else if (modify) {
          this.onUpdateVolunteer(formData);
        }
      }
    });
  };

  onRowCilck = (record: any, index: number, event: Event) => {
    this.openModelDetail(record, event);
  };

  openModelDetail = (record, e) => {
    e.stopPropagation();
    this.setState({ volunteer: record, volunteerDetail: true });
  };
}

export default Volunteer;
