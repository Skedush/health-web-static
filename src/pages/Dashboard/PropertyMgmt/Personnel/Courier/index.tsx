import React, { PureComponent, Fragment, RefObject, createRef } from 'react';
import moment from 'moment';
import styles from './index.less';
import { connect } from '@/utils/decorators';
import { isPhone, isIdCard, uploadImage } from '@/utils/validater';
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
import { GlobalState, UmiComponentProps, DictionaryEnum } from '@/common/type';

const mapStateToProps = ({ app, courier, loading: { effects } }: GlobalState) => {
  return {
    courierData: courier.courierData,
    courierCompany: app.dictionry[DictionaryEnum.COURIER_COMPANY],
    getCourierLoading: effects['courier/getCourier'],
    addCourierLoading: effects['courier/addCourier'],
    updateCourierLoading: effects['courier/updateCourier'],
    deleteCourierLoading: effects['courier/deleteCourier'],
  };
};

type CourierStateProps = ReturnType<typeof mapStateToProps>;
type CourierProps = CourierStateProps & UmiComponentProps & FormComponentProps;

interface CourierState {
  add: boolean;
  modify: boolean;
  fileList: UploadFile[];
  idCardFileList: UploadFile[];
  showDeleteConfirm: boolean;
  selectedRowKeys: number[];
  searchFields: { [propName: string]: any };
  courier: any;
  courierDetail: boolean;
}

@connect(
  mapStateToProps,
  null,
)
class Courier extends PureComponent<CourierProps, CourierState> {
  searchForm: WrappedFormUtils;
  modelForm: WrappedFormUtils;
  confirmRef: RefObject<Confirm>;

  constructor(props: Readonly<CourierProps>) {
    super(props);
    this.confirmRef = createRef();
    this.state = {
      showDeleteConfirm: true,
      fileList: [],
      idCardFileList: [],
      add: false,
      modify: false,
      selectedRowKeys: [],
      searchFields: {},
      courierDetail: false,
      courier: {},
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    this.getCourierData({ page: 0 });
    dispatch({
      type: 'app/getDic',
      payload: { type: [DictionaryEnum.COURIER_COMPANY].toString() },
    });
  }

  renderSearchForm() {
    const { courierCompany } = this.props;
    const SearchFormProps = {
      items: [
        { type: 'input', field: 'name', placeholder: '姓名' },
        {
          type: 'select',
          field: 'expressCompanyCode',
          children: courierCompany,
          placeholder: '快递公司',
        },
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
    const { addCourierLoading, deleteCourierLoading } = this.props;
    const ButtonGroupProps = {
      actions: [
        {
          customtype: 'master',
          title: '新增',
          onClick: this.addCourier,
          loading: addCourierLoading,
        },
        {
          customtype: 'warning',
          disabled: !this.state.selectedRowKeys.length,
          title: '删除',
          onClick: this.batchDeleteCourier,
          loading: deleteCourierLoading,
        },
      ],
    };
    return <ButtonGroup {...ButtonGroupProps} />;
  }

  // eslint-disable-next-line max-lines-per-function
  renderTable() {
    const { courierData, getCourierLoading } = this.props;

    const { selectedRowKeys } = this.state;
    if (isEmpty(courierData) || !courierData) {
      return null;
    }

    const columns: ColumnProps<any>[] = [
      {
        title: '登记照',
        dataIndex: 'image',
        key: 'image',
        width: '10%',
        align: 'center',
        render: (text: any, record: object) => (
          <Img image={text} className={styles.image} previewImg={true} />
        ),
      },
      {
        title: '证件照',
        dataIndex: 'idCardImage',
        key: 'idCardImage',
        width: '10%',
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
        title: '联系电话',
        width: '10%',
        align: 'center',
        dataIndex: 'phone',
        key: 'phone',
        render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '证件号码',
        width: '15%',
        align: 'center',
        key: 'idCard',
        dataIndex: 'idCard',
        render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '快递公司',
        width: '10%',
        align: 'center',
        key: 'expressCompanyName',
        dataIndex: 'expressCompanyName',
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
        title: '操作',
        align: 'center',
        // width: '25%',
        key: 'action',
        render: (_text: any, record: any) =>
          courierData ? (
            <Fragment>
              <Button
                customtype={'icon'}
                onClick={e => this.openModelDetail(record, e)}
                icon={'pm-details'}
                title={'详情'}
              />
              <Button
                customtype={'icon'}
                onClick={e => this.updateCourier(record, e)}
                icon={'pm-edit'}
                title={'修改'}
              />
              <Button
                customtype={'icon'}
                onClick={e => this.deleteCourier(record.id, e)}
                title={'删除'}
                icon={'pm-trash-can'}
              />
            </Fragment>
          ) : null,
      },
    ];

    const pagination: PaginationConfig = {
      position: 'bottom',
      current: courierData.pageable.pageNumber + 1,
      total: courierData.totalElements,
      pageSize: courierData.pageable.pageSize,
      defaultCurrent: 1,
      // onChange: this.onChangePage,
    };

    return (
      <div className={classNames('flexAuto')}>
        <Table
          columns={columns}
          dataSource={courierData.content}
          scroll={{ y: '100%' }}
          loading={getCourierLoading}
          pagination={pagination}
          onSelectRow={this.onTableSelectRow}
          // onRowClick={this.onRowCilck}
          onChange={this.onTableChange}
          selectedRow={selectedRowKeys}
        />
      </div>
    );
  }
  // eslint-disable-next-line max-lines-per-function
  renderModalForm() {
    const { modify, add, fileList, idCardFileList } = this.state;
    let { courier } = this.state;
    const { courierCompany, addCourierLoading, updateCourierLoading } = this.props;
    if (add) {
      courier = {};
    }
    const props = {
      items: [
        {
          type: 'hiddenInput',
          field: 'id',
          initialValue: courier.id,
          hidden: true,
        },
        {
          type: 'upload',
          uploadType: 'picture',
          field: 'image',
          initialValue: courier.image,
          title: '登记照',
          placeholder: '登记照',
          fileList: fileList,
          maxFiles: 1,
          onChange: this.onChangeFile,
          rules: [
            { required: true, message: '请上传照片!' },
            {
              validator: uploadImage,
            },
          ],
        },
        {
          type: 'upload',
          uploadType: 'picture',
          field: 'idCardImage',
          initialValue: courier.idCardImage,
          title: '证件照',
          placeholder: '证件照',
          fileList: idCardFileList,
          maxFiles: 1,
          onChange: this.onIdCardChangeFile,
          rules: [
            { required: true, message: '请上传照片!' },
            {
              validator: uploadImage,
            },
          ],
        },
        {
          type: 'input',
          field: 'name',
          maxLength: 10,
          initialValue: courier.name,
          placeholder: '姓名',
          rules: [{ required: true, message: '请输入姓名!' }],
        },
        {
          type: 'input',
          maxLength: 8,
          field: 'nation',
          initialValue: courier.nation,
          placeholder: '民族',
          rules: [{ required: true, message: '请输入民族!' }],
        },

        {
          type: 'input',
          initialValue: courier.idCard,
          maxLength: 20,
          fill: true,
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
          type: 'input',
          initialValue: courier.idCardAddress,
          fill: true,
          maxLength: 50,
          field: 'idCardAddress',
          placeholder: '证件地址',
          rules: [{ required: true, message: '请输入证件地址!' }],
        },
        {
          type: 'select',
          initialValue: courier.expressCompanyCode,
          field: 'expressCompanyCode',
          placeholder: '快递公司',
          children: courierCompany,
          rules: [{ required: true, message: '请选择快递公司!' }],
        },
        {
          type: 'input',
          initialValue: courier.phone,
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
      ],
      actions: [
        {
          customtype: 'select',
          icon: 'search',
          title: '确定',
          htmlType: 'submit' as 'submit',
          loading: addCourierLoading || updateCourierLoading,
        },
        { customtype: 'second', title: '取消', onClick: this.onCancelModel },
      ],
      onSubmit: this.onModelSubmit,
      title: modify ? '修改快递员' : '新增快递员',
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
    const { courier = {}, courierDetail } = this.state;
    const props = {
      items: [
        {
          name: '姓名',
          value: courier.name,
        },
        {
          name: '民族',
          value: courier.nation,
        },

        {
          name: '证件号码',
          value: courier.idCard,
        },
        {
          name: '证件地址',
          value: courier.idCardAddress,
        },
        {
          name: '联系电话',
          value: courier.phone,
        },
        {
          name: '登记时间',
          value: courier.registerTime,
        },
      ],
      images: [
        {
          name: '登记照',
          url: courier.image,
        },
        {
          name: '证件照',
          url: courier.idCardImage,
        },
      ],
      info: courier || {},
      visible: courierDetail,
      onCancel: this.onCancelModel,
      title: '快递员详情',
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
      this.getCourierData(fieldsValue);
      // for (const item in fieldsValue) {
      //   if (fieldsValue.hasOwnProperty(item)) {
      //     fieldsValue[item] = fieldsValue[item] === -1 ? undefined : fieldsValue[item];
      //   }
      // }
    });
  };

  getCourierData = Fileds => {
    const { dispatch } = this.props;
    dispatch({ type: 'courier/getCourier', payload: { ...Fileds } });
    this.setState({ selectedRowKeys: [] });
  };

  // onChangePage = (page: number, pageSize: number) => {
  //   console.log('page: ', page);
  //   const searchFields = { ...this.state.searchFields };
  //   searchFields.page = --page;
  //   searchFields.size = pageSize;
  //   this.getCourierData(searchFields);
  // };

  onTableChange = (pagination, filters, sorter, extra) => {
    const searchFields = { ...this.state.searchFields };
    searchFields.page = --pagination.current;
    searchFields.size = pagination.pageSize;
    this.getCourierData(searchFields);
  };

  addCourier = () => {
    this.setState({
      add: true,
    });
  };

  searchFormReset = () => {
    this.searchForm.resetFields();
    this.setState({
      searchFields: {},
    });
    this.getCourierData({ page: 0 });
  };

  onTableSelectRow = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys });
  };

  updateCourier = (record: any, e) => {
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
    const idCardFileList = [
      {
        uid: '1',
        name: 'image.jpg',
        size: 1435417,
        type: 'image/png',
        url: record.idCardImage,
      },
    ];
    this.setState({
      modify: true,
      courier: record,
      fileList,
      idCardFileList,
    });
  };

  onCancelModel = () => {
    this.setState({
      add: false,
      modify: false,
      courierDetail: false,
      fileList: [],
      idCardFileList: [],
    });
  };

  batchDeleteCourier = () => {
    if (this.confirmRef.current) {
      this.confirmRef.current.open(
        () => this.onDeleteCourier(this.state.selectedRowKeys),
        '删除',
        '是否确认删除选中的条目？',
      );
    }
  };

  deleteCourier = (id: number, e) => {
    e.stopPropagation();
    if (this.confirmRef.current) {
      this.confirmRef.current.open(() => this.onDeleteCourier([id]), '删除', '是否确认删除？');
    }
  };

  onDeleteCourier = data => {
    const { dispatch } = this.props;
    dispatch({ type: 'courier/deleteCourier', payload: data }).then(() =>
      this.getCourierData({ page: 0 }),
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

  onIdCardChangeFile = info => {
    this.setState({
      idCardFileList: info.fileList,
    });
  };

  onDatePickerChange = (date: moment.Moment, dateString: string) => {};

  onSelectChange = (value, option) => {};

  onAddCourier = fieldsValue => {
    const { dispatch } = this.props;
    dispatch({
      type: 'courier/addCourier',
      payload: fieldsValue,
    }).then(() => {
      this.onCancelModel();
      this.getCourierData({ page: 0 });
    });
  };

  onUpdateCourier = fieldsValue => {
    const { dispatch } = this.props;
    dispatch({
      type: 'courier/updateCourier',
      payload: fieldsValue,
    }).then(() => {
      this.onCancelModel();
      this.getCourierData({ page: 0 });
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
          this.onAddCourier(formData);
        } else if (modify) {
          this.onUpdateCourier(formData);
        }
      }
    });
  };

  onRowCilck = (record: any, index: number, event: Event) => {
    this.openModelDetail(record, event);
  };

  openModelDetail = (record, e) => {
    e.stopPropagation();
    this.setState({ courier: record, courierDetail: true });
  };
}

export default Courier;
