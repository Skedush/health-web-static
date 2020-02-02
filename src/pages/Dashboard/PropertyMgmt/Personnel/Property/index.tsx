import React, { PureComponent, Fragment, RefObject, createRef } from 'react';
import styles from './index.less';
import { connect } from '@/utils/decorators';
import classNames from 'classnames';
import { isEmpty } from 'lodash';
import moment from 'moment';
import {
  Table,
  SearchForm,
  ButtonGroup,
  Button,
  CommonComponent,
  Img,
  Confirm,
  ModalDetail,
  OperatingResults,
  Modal,
  FormSimple,
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
import PersonForm, { EPersonType } from '@/pages/Dashboard/BasicData/Person/components/PerosonForm';
import { ERROR_SELECT_PERSON, SUCCESS_IMPOWER, SUCCESS_WRITTEN_OFF } from '@/utils/message';
import { SINGLE_COLUMN_WIDTH, DOUBLE_COLUMN_WIDTH } from '@/utils/constant';
import { encryptValue } from '@/utils';

const mapStateToProps = ({ property, app, carGlobal, loading: { effects } }: GlobalState) => {
  return {
    propertyData: property.propertyData,
    getPropertyLoading: effects['property/getProperty'],
    addPropertyLoading: effects['property/addProperty'],
    updatePropertyLoading: effects['property/updateProperty'],
    deletePropertyLoading: effects['property/deleteProperty'],
    propertyTypes: app.dictionry[DictionaryEnum.PROPERTY_TYPE] || [],
    doorAuthConfig: carGlobal.doorBanAuthSettingData,
  };
};

type PropertyStateProps = ReturnType<typeof mapStateToProps>;
type PropertyProps = PropertyStateProps & UmiComponentProps & FormComponentProps;

interface PropertyState {
  add: boolean;
  modify: boolean;
  fileList: UploadFile[];
  idCardFileList: UploadFile[];
  showDeleteConfirm: boolean;
  selectedRowKeys: number[];
  searchFields: { [propName: string]: any };
  property: any;
  propertyDetail: boolean;
  modalVisible: boolean;
  detailDelete: boolean;
}

@connect(
  mapStateToProps,
  null,
)
class Property extends PureComponent<PropertyProps, PropertyState> {
  searchForm: WrappedFormUtils;
  modelForm: WrappedFormUtils;
  personAuthForm: WrappedFormUtils;
  confirmRef: RefObject<Confirm>;

  operatingResultRef: RefObject<OperatingResults>;

  personFormRef: RefObject<PersonForm>;

  selectedData: any[];

  constructor(props: Readonly<PropertyProps>) {
    super(props);
    this.confirmRef = createRef();
    this.personFormRef = createRef();
    this.operatingResultRef = createRef();
    this.state = {
      showDeleteConfirm: true,
      fileList: [],
      idCardFileList: [],
      add: false,
      modify: false,
      selectedRowKeys: [],
      searchFields: {},
      property: {},
      propertyDetail: false,
      detailDelete: false,
      modalVisible: false,
    };
  }

  componentDidMount() {
    this.props.dispatch({ type: 'app/getDic', payload: { type: DictionaryEnum.PROPERTY_TYPE } });
    this.getPropertyData({ page: 0 });
  }

  renderSearchForm() {
    const { propertyTypes } = this.props;
    const SearchFormProps = {
      items: [
        { type: 'input', field: 'name', placeholder: '姓名' },
        { type: 'select', children: propertyTypes, field: 'personType', placeholder: '职位' },
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
    const { addPropertyLoading } = this.props;
    const ButtonGroupProps = {
      actions: [
        {
          customtype: 'master',
          title: '新增',
          onClick: this.addProperty,
          loading: addPropertyLoading,
        },
        // {
        //   customtype: 'second',
        //   title: '批量重新下发',
        //   onClick: () => this.openReAuthMoadl(),
        // },
        // {
        //   customtype: 'warning',
        //   disabled: !this.state.selectedRowKeys.length,
        //   title: '删除',
        //   onClick: this.batchDeleteProperty,
        //   loading: deletePropertyLoading,
        // },
      ],
    };
    return <ButtonGroup {...ButtonGroupProps} />;
  }

  // eslint-disable-next-line max-lines-per-function
  renderTable() {
    const { propertyData, getPropertyLoading } = this.props;
    // const { propertyData, getPropertyLoading, doorAuthConfig } = this.props;
    const { selectedRowKeys } = this.state;

    if (isEmpty(propertyData) || !propertyData) {
      return null;
    }

    const columns: ColumnProps<any>[] = [
      {
        title: '登记照',
        dataIndex: 'image',
        key: 'image',
        width: SINGLE_COLUMN_WIDTH,
        render: (text: any, record: object) => (
          <Img image={text} className={styles.image} previewImg={true} />
        ),
      },
      {
        title: '姓名',
        width: DOUBLE_COLUMN_WIDTH,
        dataIndex: 'name',
        key: 'name',
        render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '职位',
        width: DOUBLE_COLUMN_WIDTH,
        dataIndex: 'personTypeStr',
        key: 'personTypeStr',
        render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '联系电话',
        width: DOUBLE_COLUMN_WIDTH,
        dataIndex: 'phone',
        key: 'phone',
        render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      },
      // {
      //   title: '证件号码',
      //   width: DOUBLE_COLUMN_WIDTH,
      //   key: 'encryptCardId',
      //   dataIndex: 'encryptCardId',
      //   render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      // },
      // {
      //   title: '证件地址',
      //   width: DOUBLE_COLUMN_WIDTH,
      //   key: 'idCardAddress',
      //   dataIndex: 'idCardAddress',
      //   render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      // },
      {
        title: '登记时间',
        // width: DOUBLE_COLUMN_WIDTH,
        key: 'registerTime',
        dataIndex: 'registerTime',
        render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      },

      {
        title: '操作',
        width: DOUBLE_COLUMN_WIDTH,
        key: 'action',
        render: (_text: any, record: any) =>
          propertyData ? (
            <Fragment>
              <Button
                customtype={'icon'}
                onClick={e => this.openModelDetail(record, e)}
                icon={'pm-details'}
                title={'详情'}
              />
              <Button
                customtype={'icon'}
                onClick={e => this.updateProperty(record, e)}
                icon={'pm-edit'}
                title={'修改'}
              />
              <Button
                customtype={'icon'}
                onClick={e => this.openDeleteDetail(record)}
                title={'注销'}
                icon={'pm-write-off'}
              />
            </Fragment>
          ) : null,
      },
    ];

    const pagination: PaginationConfig = {
      position: 'bottom',
      total: propertyData.totalElements,
      current: propertyData.pageable.pageNumber + 1,
      pageSize: propertyData.pageable.pageSize,
      defaultCurrent: 1,
      // onChange: this.onChangePage,
    };

    return (
      <div className={classNames('flexAuto')}>
        <Table
          columns={columns}
          dataSource={propertyData.content}
          scroll={{ y: '100%' }}
          pagination={pagination}
          loading={getPropertyLoading}
          rowKey={'id'}
          onSelectRow={this.onTableSelectRow}
          // onRowClick={this.onRowCilck}
          onChange={this.onTableChange}
          selectedRow={selectedRowKeys}
        />
      </div>
    );
  }

  renderConfirm() {
    return <Confirm type={'warning'} ref={this.confirmRef} />;
  }

  renderModalDetail() {
    const { property = {}, propertyDetail, detailDelete } = this.state;
    const props = {
      items: [
        {
          name: '姓名',
          value: property.name,
        },
        {
          name: '职位',
          value: property.personTypeStr,
        },
        {
          name: '证件号码',
          value: encryptValue(property.idCard),
        },
        {
          name: '证件地址',
          value: property.idCardAddress,
        },
        {
          name: property.foreign ? '国籍' : '民族',
          value: property.foreign ? property.nationality : property.nation,
        },
        {
          name: '出生年月',
          value: property.birthday,
        },
        {
          name: '性别',
          value: property.sex === '1' ? '男' : '女',
        },
        {
          name: '联系电话',
          value: property.phone,
        },
        {
          name: '登记时间',
          value: property.registerTime,
        },
        {
          name: '备注',
          value: property.remark,
          fill: true,
        },
      ],
      actions: [
        {
          customtype: 'second',
          title: '关闭',
          onClick: this.onCancelModel,
        },
      ],
      images: [
        {
          name: '证件照',
          url: property.image,
        },
      ],
      info: property || {},
      visible: propertyDetail,
      onCancel: this.onCancelModel,
      title: '物业人员详情',
    };
    if (detailDelete) {
      props.actions.unshift({
        customtype: 'select',
        title: '物业注销',
        onClick: () => this.deleteProperty(property.id, null),
      });
    }
    return <ModalDetail {...props} />;
  }

  renderReAuthModal = () => {
    const modalProps = {
      onCancel: this.cancelModel,
      visible: this.state.modalVisible,
      title: '通行证批量下发',
      destroyOnClose: true,
      centered: true,
      footer: null,
      maskClosable: false,
      bodyStyle: {},
      width: '50%',
      wrapClassName: 'modal',
    };
    const formProps = {
      items: [
        {
          type: 'rangePicker',
          initialValue: [moment(), moment().add(1, 'years')],
          fill: true,
          field: 'time',
          label: '授权时间',
          placeholder: ['开始时间', '结束时间'] as [string, string],
          rules: [{ required: true, message: '请输入授权时间!' }],
        },
      ],
      actions: [
        // { customtype: 'second', title: '跳过', onClick: this.props.onCancelModel },
        {
          customtype: 'select',
          title: '完成',
          // loading: formButtonLoading,
          htmlType: 'submit' as 'submit',
        },
      ],
      onSubmit: this.onPersonAuthFormSubmit,
      onGetFormRef: (modelForm: WrappedFormUtils) => {
        this.personAuthForm = modelForm;
      },
    };
    return (
      <Modal {...modalProps}>
        <FormSimple {...formProps} />
      </Modal>
    );
  };

  render() {
    return (
      <div className={classNames('height100', 'flexColStart')}>
        <OperatingResults ref={this.operatingResultRef} />
        <PersonForm personSuccess={this.getList} ref={this.personFormRef} />
        <div className={'listTitle'}>信息筛选</div>
        {this.renderSearchForm()}
        <div className={'listTitle'}>信息展示</div>
        {this.renderButtonGroup()}
        {this.renderTable()}
        {this.renderConfirm()}
        {this.renderModalDetail()}
        {this.renderReAuthModal()}
      </div>
    );
  }

  onPersonAuthFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (e) {
      e.preventDefault();
    }
    this.personAuthForm.validateFields((err, fieldsValue) => {
      if (err) return;
      if (fieldsValue.time) {
        fieldsValue.rentTime = moment(fieldsValue.time[0]).format('YYYY-MM-DD HH:mm:ss');
        fieldsValue.authorizeExpireTime = moment(fieldsValue.time[1]).format('YYYY-MM-DD HH:mm:ss');
        delete fieldsValue.time;
      }
      this.selectedData.forEach(async item => {
        const data = {
          personId: item.personId,
          type: '4',
          rentTime: fieldsValue.rentTime,
          authorizeExpireTime: fieldsValue.authorizeExpireTime,
        };
        const resData = await this.props.dispatch({ type: 'person/icCardIssued', data });
        if (resData && resData.error && this.confirmRef.current) {
          this.confirmRef.current.open(
            () => {},
            '提交异常',
            <div>
              {resData.message.map((item, i) => (
                <div key={i}>{item}</div>
              ))}
            </div>,
            'warning',
          );
        } else {
          Message.success(SUCCESS_IMPOWER);
        }
      });

      this.cancelModel();
      // this.onFormNext();
    });
  };

  cancelModel = () => {
    this.setState({
      modalVisible: false,
    });
  };

  openReAuthMoadl = () => {
    if (this.state.selectedRowKeys.length <= 0) {
      Message.error(ERROR_SELECT_PERSON);
    } else {
      this.setState({
        modalVisible: true,
      });
    }
  };

  getList = () => {
    this.getPropertyData({ page: 0, size: 10 });
  };

  getCurrentPage = () => {
    const { propertyData } = this.props;
    console.log(propertyData);
    if (propertyData) {
      this.getPropertyData({
        page: propertyData.pageable.pageNumber,
        size: propertyData.pageable.pageSize,
      });
    }
  };

  onSearch = (e: React.FormEvent<HTMLFormElement>) => {
    if (e) {
      e.preventDefault();
    }
    this.searchForm.validateFields((err, fieldsValue) => {
      if (err) return;
      this.setState({
        searchFields: { ...fieldsValue },
      });
      fieldsValue.page = 0;
      this.getPropertyData(fieldsValue);
    });
  };

  getPropertyData = Fileds => {
    const { dispatch } = this.props;
    this.setState({ selectedRowKeys: [] });
    dispatch({ type: 'property/getProperty', payload: { ...Fileds } });
  };

  onTableChange = (pagination, filters, sorter, extra) => {
    const searchFields = { ...this.state.searchFields };
    searchFields.page = --pagination.current;
    searchFields.size = pagination.pageSize;
    this.getPropertyData(searchFields);
  };

  addProperty = () => {
    if (this.personFormRef.current) {
      this.personFormRef.current.open('add', EPersonType.property);
    }
  };

  searchFormReset = () => {
    this.searchForm.resetFields();
    this.setState({
      searchFields: {},
    });
    this.getPropertyData({ page: 0 });
  };

  onTableSelectRow = (selectedRowKeys, selectedRows) => {
    this.selectedData = selectedRows;
    console.log('selectedRowKeys: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  };

  updateProperty = (record: any, e) => {
    e.stopPropagation();
    if (this.personFormRef.current) {
      this.personFormRef.current.open('edit', EPersonType.property, record);
    }
  };

  onCancelModel = () => {
    this.setState({
      add: false,
      modify: false,
      propertyDetail: false,
      fileList: [],
      idCardFileList: [],
    });
  };

  batchDeleteProperty = () => {
    if (this.confirmRef.current) {
      this.confirmRef.current.open(
        () => this.onDeleteProperty(this.state.selectedRowKeys),
        '删除',
        '是否确认删除选中的条目？',
      );
    }
  };

  deleteProperty = (id: number, e) => {
    if (e) {
      e.stopPropagation();
    }
    if (this.confirmRef.current) {
      this.confirmRef.current.open(() => this.onDeleteProperty([id]), '注销', '是否确认注销？');
    }
  };

  onDeleteProperty = data => {
    const { dispatch } = this.props;
    dispatch({ type: 'property/deleteProperty', payload: data }).then(data => {
      if (data && data.error && this.operatingResultRef.current) {
        this.operatingResultRef.current.open(data);
      } else if (data) {
        Message.success(SUCCESS_WRITTEN_OFF);
        this.onCancelModel();
        this.getPropertyData({ page: 0 });
      }
    });
  };

  onGetFormRef = (form: WrappedFormUtils) => {
    this.searchForm = form;
  };

  onRowCilck = (record: any, index: number, event: Event) => {
    this.openModelDetail(record, event);
  };

  openDeleteDetail = record => {
    this.setState({
      property: record,
      propertyDetail: true,
      detailDelete: true,
    });
  };

  openModelDetail = (record, e) => {
    e.stopPropagation();
    this.setState({ property: record, propertyDetail: true, detailDelete: false });
  };
}

export default Property;
