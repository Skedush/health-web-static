import React, { PureComponent, RefObject, createRef } from 'react';
import moment from 'moment';
import { connect } from '@/utils/decorators';
import classNames from 'classnames';
import {
  Table,
  SearchForm,
  ButtonGroup,
  CommonComponent,
  Confirm,
  Message,
  ModalDetail,
  Img,
  OperatingResults,
  FormSimple,
  Modal,
} from '@/components/Library';
import {
  FormComponentProps,
  PaginationConfig,
  WrappedFormUtils,
  ColumnProps,
  UploadFile,
} from '@/components/Library/type';
import {
  SUCCESS_IMPOWER,
  ERROR_SELECT_PERSON,
  SUCCESS_CHECK,
  SUCCESS_WRITTEN_OFF,
  SUCCESS_IMPORT,
} from '@/utils/message';
import { GlobalState, UmiComponentProps, DictionaryEnum } from '@/common/type';
import { CarBaseInfo } from '../Car/model';
import PersonForm, { EPersonType } from './components/PerosonForm';
import { PersonBaseInfo } from '@/models/person';
// import AuthTimeModalFormInstance, { AuthTimeFormModal } from './components/PersonFormAuthFormModal';
import { SINGLE_COLUMN_WIDTH, DOUBLE_COLUMN_WIDTH } from '@/utils/constant';
import { encryptValue } from '@/utils';

const mapStateToProps = (state: GlobalState) => {
  return {
    state,
    loading: state.loading.effects['person/getPersonList'],
    formButtonLoading: state.loading.effects['person/addPerson'],
    carTypes: state.app.dictionry[DictionaryEnum.CAR_TYPE] || [],
    personTypes: state.app.dictionry[DictionaryEnum.PERSON_TYPE] || [],
    professionTypes: state.app.dictionry[DictionaryEnum.PROFESSION_TYPE] || [],
    doorAuthConfig: state.carGlobal.doorBanAuthSettingData,
  };
};

type CarStateProps = ReturnType<typeof mapStateToProps>;
type CarProps = CarStateProps & UmiComponentProps & FormComponentProps;

interface CarState {
  add: boolean;
  modifyData: PersonBaseInfo;
  modify: boolean;
  screenFileList: UploadFile[];
  cardFileList: UploadFile[];
  dataSource: any[];
  buildingList: any[];
  unitList: any[];
  houseList: any[];
  detailVisible: boolean;
  unitListDisabled: boolean;
  houseListDisabled: boolean;
  carFormReadOnly: boolean;
  isLessee: boolean;
  isRemove: boolean;
  isCarModalForm: boolean;
  isOwner: boolean;
  selectedRow: any[];
  carData: CarBaseInfo;
  pageOption: PaginationConfig;
  confirmType: string;
  searchHouseDisabled: boolean;
  searchUnitDisabled: boolean;
  operatingResultsVisible: boolean;
  batchHandleResultsData: {};
  carIdcard: string;
  buildingUnitHouse: any[];
  carPhone: string;
  carPersonName: string;
  modalVisible: boolean;
}

@connect(
  mapStateToProps,
  null,
)
class Person extends PureComponent<CarProps, CarState> {
  searchForm: WrappedFormUtils;

  modelForm: WrappedFormUtils;

  personAuthForm: WrappedFormUtils;

  confirmRef: RefObject<Confirm>;

  formRef: RefObject<PersonForm>;

  // issuedAuthRef: AuthTimeFormModal;

  selectedData: any[] = [];

  queryCondition = {};

  editId: number;

  constructor(props: Readonly<CarProps>) {
    super(props);
    this.confirmRef = createRef();
    this.formRef = createRef();
    this.state = {
      detailVisible: false,
      screenFileList: [],
      modalVisible: false,
      cardFileList: [],
      modifyData: new PersonBaseInfo(),
      add: false,
      dataSource: [],
      buildingList: [],
      houseList: [],
      selectedRow: [],
      unitList: [],
      unitListDisabled: true,
      houseListDisabled: true,
      searchHouseDisabled: true,
      searchUnitDisabled: true,
      carFormReadOnly: false,
      isRemove: false,
      isOwner: false,
      isLessee: false,
      modify: false,
      carIdcard: '',
      carPhone: '',
      carPersonName: '',
      isCarModalForm: false,
      operatingResultsVisible: false,
      batchHandleResultsData: {},
      carData: {} as CarBaseInfo,
      confirmType: 'warning',
      buildingUnitHouse: [],
      pageOption: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    Promise.all([
      dispatch({ type: 'app/getDic', payload: { type: DictionaryEnum.PERSON_TYPE } }),
      dispatch({ type: 'app/getDic', payload: { type: DictionaryEnum.CAR_TYPE } }),
      dispatch({ type: 'app/getDic', payload: { type: DictionaryEnum.PROFESSION_TYPE } }),
    ]);
    this.getList();
    this.getBuildingList();
  }

  renderSearchForm() {
    const {
      buildingList,
      unitList,
      houseList,
      searchHouseDisabled,
      searchUnitDisabled,
    } = this.state;
    const SearchFormProps = {
      items: [
        { type: 'input', field: 'name', placeholder: '住户姓名' },
        {
          type: 'select',
          children: buildingList,
          onSelect: this.buildingChange,
          field: 'buildingId',
          placeholder: '楼栋编号',
        },
        {
          type: 'select',
          children: unitList,
          onSelect: this.unitChange,
          disabled: searchUnitDisabled,
          field: 'unitId',
          placeholder: '单元编号',
        },
        {
          type: 'select',
          children: houseList,
          disabled: searchHouseDisabled,
          field: 'houseId',
          placeholder: '房屋编号',
        },
      ],
      actions: [
        { customtype: 'select', title: '查询', htmlType: 'submit' as 'submit' },
        { customtype: 'reset', title: '重置', onClick: this.onReset },
      ],
      columnNumOfRow: 4,
      onSubmit: this.onSearachSubmit,
      onGetFormRef: this.onGetFormRef,
    };
    return <SearchForm {...SearchFormProps} />;
  }

  renderButtonGroup() {
    const ButtonGroupProps = {
      actions: [
        { customtype: 'master', title: '住户新增', onClick: () => this.openForm('add', 'owner') },
        // {
        //   customtype: 'second',
        //   title: '批量重新下发',
        //   onClick: () => this.openReAuthMoadl(),
        // },
        // { customtype: 'warning', title: '删除', onClick: () => this.deletePerson() },
        // { customtype: 'master', title: '新增（1.0.2）', onClick: () => this.openForm('add', 'owner') },
        // {
        //   customtype: 'custom',
        //   render: () => {
        //     return (
        //       <Upload
        //         key={'custom1'}
        //         title={'导入'}
        //         hiddenList
        //         maxFiles={1}
        //         beforeUpload={this.importData}
        //         uploadType={'file'}
        //       />
        //     );
        //   },
        // },
        // { customtype: 'second', title: '模板下载', onClick: this.templateDownload },
      ],
    };
    return <ButtonGroup {...ButtonGroupProps} />;
  }

  openForm = (type: 'edit' | 'add', personType: string | any, data?) => {
    if (this.formRef.current) {
      return this.formRef.current.open(type, personType, data);
    }
  };

  // eslint-disable-next-line max-lines-per-function
  renderTable() {
    // const { doorAuthConfig } = this.props;
    const columns: ColumnProps<any>[] = [
      {
        title: '登记照',
        width: SINGLE_COLUMN_WIDTH,
        dataIndex: 'bpImageUrl',
        key: 'bpImageUrl',
        render: (text: any, record: object) => <Img image={text} previewImg={true} />,
      },
      {
        title: '姓名',
        width: SINGLE_COLUMN_WIDTH,
        dataIndex: 'name',
        key: 'name',
        render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '人员类型',
        width: SINGLE_COLUMN_WIDTH,
        key: 'typeStr',
        dataIndex: 'typeStr',
        render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '地址',
        width: SINGLE_COLUMN_WIDTH,
        key: 'unitCode',
        dataIndex: 'unitCode',
        render: (text: any, record: any) =>
          CommonComponent.renderTableCol(
            `${record.buildingCode}栋${record.unitCode}单元${record.houseCode}`,
            record,
          ),
      },
      {
        title: '租住时间',
        width: DOUBLE_COLUMN_WIDTH,
        key: 'rentTimeCN',
        dataIndex: 'rentTimeCN',
        render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '联系电话',
        width: SINGLE_COLUMN_WIDTH,
        key: 'phone',
        dataIndex: 'phone',
        render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '登记时间',
        width: DOUBLE_COLUMN_WIDTH,
        key: 'tCreateTime',
        dataIndex: 'tCreateTime',
        render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '操作',
        width: DOUBLE_COLUMN_WIDTH,
        key: 'action',
        render: (text: any, record: any) => {
          const operate: any[] = [
            {
              customtype: 'icon',
              onClick: () => this.checkPerson(record, false),
              icon: 'pm-details',
              title: '详情',
            },
            {
              customtype: 'icon',
              onClick: e => this.editPerson(record),
              icon: 'pm-edit',
              title: '修改',
            },
            {
              customtype: 'icon',
              onClick: () => this.checkPerson(record, true),
              icon: 'pm-write-off',
              title: '注销',
            },
            // {
            //   customtype: 'icon',
            //   onClick: () => this.auditPerson(record),
            //   icon: 'audit',
            //   title: '核对',
            // },
          ];
          if (!record.guardianId) {
            operate.splice(2, 0, {
              customtype: 'icon',
              onClick: () => this.openForm('add', 'child', record),
              icon: 'pm-kid',
              title: '孩童登记',
            });
          }
          // if (doorAuthConfig && doorAuthConfig.authState) {
          //   operate.splice(1, 0, {
          //     customtype: 'icon',
          //     onClick: e => this.reissuedAuthRequest(record),
          //     icon: 'pm-resubmit',
          //     title: '通行证重新下发',
          //   });
          // }
          return CommonComponent.renderMoreOperate(operate, 4);
        },
      },
    ];

    const { pageOption, dataSource, selectedRow } = this.state;
    const { loading } = this.props;
    const pagination: PaginationConfig = {
      position: 'bottom',
      total: pageOption.total,
      pageSize: pageOption.pageSize,
      current: pageOption.current,
      defaultCurrent: pageOption.current,
      // onChange: this.onChangePage,
    };
    return (
      <div className={classNames('flexAuto')}>
        <Table
          rowKey={'subId'}
          columns={columns}
          onSelectRow={this.selectedChange}
          dataSource={dataSource}
          scroll={{ y: '100%' }}
          pagination={pagination}
          onChange={this.tableOnChange}
          selectedRow={selectedRow}
          loading={loading}
        />
      </div>
    );
  }

  renderDetailModal(baseInfo) {
    const { detailVisible, isRemove } = this.state;
    const props = {
      items: [
        {
          name: '姓名',
          value: baseInfo.name,
        },
        {
          name: '证件号码',
          value: encryptValue(baseInfo.idCard),
        },
        {
          name: baseInfo.foreign ? '国籍' : '民族',
          value: baseInfo.foreign ? baseInfo.nationality : baseInfo.nation,
        },
        {
          name: '证件地址',
          value: baseInfo.domicile,
        },
        {
          name: '出生年月',
          value: baseInfo.birthday,
        },
        {
          name: '性别',
          value: baseInfo.sex === '1' ? '男' : '女',
        },
        {
          name: '楼栋编号',
          value: baseInfo.buildingCode,
        },
        {
          name: '单元编号',
          value: baseInfo.unitCode,
        },
        {
          name: '门牌号',
          value: baseInfo.houseCode,
        },
        {
          name: '人员类型',
          value: baseInfo.typeStr,
        },
        {
          name: '租住时间',
          value: baseInfo.rentTimeCN,
        },
        {
          name: '联系电话',
          value: baseInfo.phone,
        },
        {
          name: '备注',
          value: baseInfo.remark,
          fill: true,
        },
      ],
      images: [
        {
          name: '证件照',
          url: baseInfo.bpImageUrl,
        },
      ],
      actions: [
        {
          customtype: 'second',
          title: '关闭',
          onClick: this.onCancelDetailModel,
        },
      ],
      info: baseInfo || {},
      visible: detailVisible,
      width: '50%',
      onCancel: this.onCancelDetailModel,
      title: isRemove ? '住户注销' : baseInfo.guardianId ? '孩童详情' : '住户详情',
    };

    if (isRemove) {
      props.actions.unshift({
        customtype: 'select',
        title: '住户注销',
        onClick: () => this.removePerson(baseInfo),
      });
    }
    if (baseInfo.guardianId) {
      props.items.unshift({
        name: '监护人姓名',
        value: baseInfo.guardianName,
      });
      props.images.pop();
    } else {
      props.items.unshift({
        name: '监护对象',
        value: baseInfo.wards,
      });
    }
    return <ModalDetail {...props} />;
  }

  onCancelOperatingResults = () => {
    this.setState({ operatingResultsVisible: false });
  };

  renderOperatingResults() {
    const { operatingResultsVisible, batchHandleResultsData } = this.state;
    const props = {
      visible: operatingResultsVisible,
      onCancel: this.onCancelOperatingResults,
      data: batchHandleResultsData,
    };
    return <OperatingResults {...props} />;
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
    const { modifyData, confirmType, buildingUnitHouse } = this.state;
    return (
      <div className={classNames('height100', 'flexColStart')}>
        <Confirm type={confirmType} ref={this.confirmRef} />
        <PersonForm
          ref={this.formRef}
          buidingUnitHouse={buildingUnitHouse}
          personSuccess={this.personAddSuccess}
        />
        {/* <AuthTimeModalFormInstance
          success={this.refreshCurrenPage}
          wrappedComponentRef={ins => (this.issuedAuthRef = ins)}
        /> */}
        <div className={'listTitle'}>信息筛选</div>
        {this.renderSearchForm()}
        <div className={'listTitle'}>信息展示</div>
        {this.renderButtonGroup()}
        {this.renderTable()}
        {this.renderDetailModal(modifyData)}
        {this.renderOperatingResults()}
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
          type: '1',
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

  openReAuthMoadl = async () => {
    if (this.state.selectedRow.length <= 0) {
      Message.warn(ERROR_SELECT_PERSON);
    } else {
      const list = this.selectedData.map(item => ({ name: item.name, id: item.personId }));
      const data = await this.props.dispatch({
        type: 'permit/batchUpdatePersonPermit',
        data: list,
      });
      if (data && !data.error) {
        this.getList();
      } else {
        this.setState({
          operatingResultsVisible: true,
          batchHandleResultsData: data,
        });
      }
    }
  };

  editPerson = async (record: PersonBaseInfo) => {
    if (record.guardianId) {
      return this.openForm('edit', EPersonType.child, record);
    } else {
      return this.openForm('edit', EPersonType.owner, record);
    }
  };

  personAddSuccess = () => {
    this.refreshCurrenPage();
  };

  async getBuildingList() {
    const data = await this.props.dispatch({ type: 'person/getBuildingList' });
    data.forEach(item => {
      item.key = item.id;
      item.value = item.name;
    });
    this.setState({
      buildingList: data,
    });
  }

  async getUnitList(buildingId) {
    const data = await this.props.dispatch({ type: 'person/getUnitList', buildingId });
    data.unitList.forEach(item => {
      item.key = item.id;
      item.value = item.name;
    });
    this.setState({
      unitList: data.unitList,
    });
  }

  reissuedAuth = () => {};

  getList() {
    this.onChangePage(1, this.state.pageOption.pageSize);
  }

  refreshCurrenPage = () => {
    this.onChangePage(this.state.pageOption.current || 1, this.state.pageOption.pageSize);
  };

  onCancelDetailModel = () => {
    this.setState({ detailVisible: false });
  };

  onPersonTypeChange = value => {
    this.modelForm.setFieldsValue({
      rentTime: value === '1' ? '永久' : [],
    });
    this.setState({
      isLessee: value === '2',
      isOwner: value === '1',
    });
  };

  selectedChange = (keys, data) => {
    console.log(data);
    this.selectedData = data;
    this.setState({
      selectedRow: keys,
    });
  };

  // reissuedAuthRequest = async (record: PersonBaseInfo) => {
  //   if (this.issuedAuthRef) {
  //     await this.issuedAuthRef.setDefaultTime(record);
  //   }
  //   this.issuedAuthRef.open(record);
  // };

  removePerson(record: PersonBaseInfo) {
    this.deletePerson(record);
  }

  tableOnChange = (pagination: PaginationConfig) => {
    this.onChangePage(pagination.current || 1, pagination.pageSize || 10);
  };

  onChangePage = async (page: number, pageSize: number = 10) => {
    const { pageOption } = this.state;
    const { dispatch } = this.props;
    const data = await dispatch({
      type: 'person/getPersonList',
      pageOption: { page: page - 1, size: pageSize, ...this.queryCondition },
    });
    if (!data) {
      return;
    }
    const countBeforePage: number = data.number * pageSize;
    data.content.forEach((item, index) => {
      item.id = item.personId;
      if (item.foreign) {
        if (item.guardianId) {
          item.typeStr = `${item.typeStr}(外籍孩童)`;
        } else {
          item.typeStr = `${item.typeStr}(外籍)`;
        }
      } else if (item.guardianId) {
        item.typeStr = `${item.typeStr}(孩童)`;
      }
      item.rentTimeCN =
        item.type !== '1' ? `${item.rentTime} ~ ${item.authorizeExpireTime}` : `永久`;
      item.sourceDataRentTime = item.rentTime;
      item.sortId = countBeforePage + index + 1;
      const findType = this.props.personTypes.find(v => v.key === item.type);
      if (findType) {
        item.typeCN = findType.value;
      }
    });
    this.setState({
      selectedRow: [],
      dataSource: data ? data.content : [],
      pageOption: {
        ...pageOption,
        current: page,
        pageSize,
        total: data.totalElements,
      },
    });
  };

  getBuildingUnitHouse = (values: any[]) => {
    console.log(values);
    this.setState({
      buildingUnitHouse: values,
    });
  };

  onSearch = () => {};

  auditPerson = async record => {
    const data = await this.props.dispatch({ type: 'person/checkPerson', subId: record.subId });
    if (data.success) {
      Message.success(SUCCESS_CHECK);
      this.onChangePage(this.state.pageOption.current || 1, this.state.pageOption.pageSize);
    }
  };

  onReset = () => {
    this.searchForm.resetFields();
    this.setState({
      unitList: [],
      houseList: [],
    });
    this.onSearachSubmit();
  };

  buildingOnSelect = value => {
    this.modelForm.setFieldsValue({
      unitId: '',
      houseId: '',
    });
    this.buildingChange(value);
  };

  unitOnSelect = value => {
    this.modelForm.setFieldsValue({
      houseId: '',
    });
    this.unitChange(value);
  };

  buildingChange = async value => {
    const data = await this.props.dispatch({ type: 'person/getUnitList', buildingId: value });
    data.unitList.forEach(item => {
      item.key = item.id;
      item.value = item.name;
    });
    this.searchForm.setFieldsValue({
      unitId: undefined,
      houseId: undefined,
    });
    this.setState({
      unitListDisabled: false,
      searchUnitDisabled: false,
      unitList: data.unitList,
    });
  };

  unitChange = async value => {
    const data = await this.props.dispatch({ type: 'person/getHouseList', unitId: value });
    this.searchForm.setFieldsValue({
      houseId: undefined,
    });
    data.houseList.forEach(item => {
      item.key = item.id;
      item.value = item.name;
    });
    this.setState({
      houseList: data.houseList,
      houseListDisabled: false,
      searchHouseDisabled: false,
    });
  };

  checkPerson = async (record: any, isRemove) => {
    if (!record.guardianId) {
      const list: any[] = await this.props.dispatch({
        type: 'person/getWard',
        data: { personId: record.personId },
      });
      record.wards = list.map(item => item.name).join('，');
    }
    this.setState({
      modifyData: record,
      detailVisible: true,
      isRemove,
    });
  };

  modifyPerson = async (record: PersonBaseInfo) => {
    this.editId = +record.subId;
    if (record.type === '1') {
      record.rentTime = '永久';
    } else {
      record.rentTime = [
        record.rentTime ? moment(record.rentTime) : null,
        record.rentTime ? moment(record.authorizeExpireTime) : null,
      ];
    }
    record.buildingId = this.state.buildingList.find(
      item => item.value === record.buildingCode,
    ).key;
    await this.buildingChange(record.buildingId);
    record.unitId = this.state.unitList.find(item => item.value === record.unitCode).key;
    await this.unitChange(record.unitId);
    record.houseId = this.state.houseList.find(item => item.value === record.houseCode).key;

    this.setState({
      cardFileList: [
        {
          uid: '1',
          type: 'unchanged',
          size: 3,
          name: '23',
          url: record.bpIdCardImageUrl,
        },
      ],
      screenFileList: [
        {
          uid: '2',
          type: 'unchanged',
          size: 3,
          name: '23',
          url: record.bpImageUrl,
        },
      ],
      isLessee: record.type === '2',
      modifyData: record,
      isOwner: record.type === '1',
      modify: true,
      isCarModalForm: false,
    });
  };

  deletePerson = async (record?: any) => {
    let ids: any[] = [];
    let personIds: any[] = [];
    let personVillageIds: any[] = [];
    if (!record && !this.selectedData.length) {
      Message.warning(ERROR_SELECT_PERSON);
      return;
    } else if (record) {
      ids = [record.subId];
      personIds = [record.personId];
      personVillageIds = [record.personVillageId];
    } else {
      ids = this.selectedData.map(item => item.subId);
      personIds = this.selectedData.map(item => item.personId);
      personVillageIds = this.selectedData.map(item => item.personVillageId);
    }
    this.setState({ confirmType: 'warning' });
    if (this.confirmRef.current) {
      this.confirmRef.current.open(
        async () => {
          const data = await this.props.dispatch({
            type: 'person/deletePerson',
            deleteList: ids,
            personIds,
            personVillageIds,
          });
          if (data && data.error && ids.length > 1) {
            this.setState({
              operatingResultsVisible: true,
              batchHandleResultsData: data,
            });
          } else if (data && data.error) {
            Message.error(data.message);
          } else if (data) {
            Message.success(SUCCESS_WRITTEN_OFF);
          }
          this.selectedData = [];
          this.setState({
            detailVisible: false,
            selectedRow: [],
          });
          this.getList();
        },
        '注销住户',
        '确定要注销住户吗？',
      );
    }
  };

  importData = (file: File) => {
    this.props.dispatch({ type: 'person/importData', file }).then(data => {
      if (data && data.error && this.confirmRef.current) {
        this.confirmRef.current.open(
          () => {},
          '导入错误',
          <div>
            {data.error.split(',').map((item, index) => {
              return (
                <div key={index}>
                  {item}
                  <br />
                </div>
              );
            })}
          </div>,
          'warning',
        );
      } else {
        Message.success(SUCCESS_IMPORT);
      }
    });
    return false;
  };

  templateDownload = () => {
    this.props.dispatch({ type: 'person/templateDownload' });
  };

  onGetFormRef = (form: WrappedFormUtils) => {
    this.searchForm = form;
  };

  onSearachSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) {
      e.preventDefault();
    }
    this.searchForm.validateFields((err, fieldsValue) => {
      if (err) return;
      for (const item in fieldsValue) {
        if (fieldsValue.hasOwnProperty(item)) {
          fieldsValue[item] = fieldsValue[item] === -1 ? undefined : fieldsValue[item];
        }
      }
      this.queryCondition = fieldsValue;
      this.getList();
    });
  };
}

export default Person;
