import React, { PureComponent, Fragment, RefObject, createRef } from 'react';
import moment from 'moment';
import { connect } from '@/utils/decorators';
import classNames from 'classnames';
import styles from './index.less';
import { isEmpty } from 'lodash';
import {
  Table,
  SearchForm,
  ButtonGroup,
  Button,
  CommonComponent,
  ModalForm,
  Confirm,
  Modal,
  Badge,
  Tabs,
  Img,
  Form,
  DatePicker,
  KVTable,
  OperatingResults,
  Message,
  Upload,
} from '@/components/Library';
import {
  FormComponentProps,
  PaginationConfig,
  WrappedFormUtils,
  // RangePickerValue,
  ColumnProps,
} from '@/components/Library/type';
import { GlobalState, UmiComponentProps, DictionaryEnum } from '@/common/type';

const { TabPane } = Tabs;
const FormItem = Form.Item;

const mapStateToProps = (state: GlobalState) => {
  return {
    doorAuthData: state.doorAuth.doorAuthData,
    doorAuthInfo: state.doorAuth.doorAuthInfo,
    authState: state.app.dictionry[DictionaryEnum.AUTH_STATUS],
    personType: state.app.dictionry[DictionaryEnum.PERSON_TYPE],
    doorAuthTimeCofig: state.app.dictionry[DictionaryEnum.DOOR_AUTH_TIME_CONFIG],
    deviceDoorList: state.doorAuth.deviceDoorList,
  };
};
// type onRangePickerChange = (dates: RangePickerValue, dateStrings: [string, string]) => void;
type DoorAuthStateProps = ReturnType<typeof mapStateToProps>;
type DoorAuthProps = DoorAuthStateProps & UmiComponentProps & FormComponentProps;

interface DoorAuthState {
  add: boolean;
  modify: boolean;
  modalVisible: boolean;
  doAuthorizationModal: boolean;
  addICCardFormModal: boolean;
  showDeleteConfirm: boolean;
  selectedRowKeys: number[];
  searchFields: { [propName: string]: any };
  personAuthInfoId?: number;
  deviceAuthInfo: { [propName: string]: any };
  operatingResultsVisible: boolean;
  batchHandleResultsData: { [propName: string]: any };
}

@connect(
  mapStateToProps,
  null,
)
class DoorAuth extends PureComponent<DoorAuthProps, DoorAuthState> {
  searchForm: WrappedFormUtils;
  modelForm: WrappedFormUtils;
  authorizationModelForm: WrappedFormUtils;
  ICCardModelForm: WrappedFormUtils;
  confirmRef: RefObject<Confirm>;

  constructor(props: Readonly<DoorAuthProps>) {
    super(props);
    this.confirmRef = createRef();
    this.state = {
      showDeleteConfirm: true,
      modalVisible: false,
      add: false,
      modify: false,
      doAuthorizationModal: false,
      addICCardFormModal: false,
      selectedRowKeys: [],
      searchFields: {},
      personAuthInfoId: 0,
      deviceAuthInfo: {},
      operatingResultsVisible: false,
      batchHandleResultsData: {},
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    this.getDoorAuthData({ page: 0, type: 1 });
    dispatch({
      type: 'app/getDic',
      payload: {
        type: [
          DictionaryEnum.AUTH_STATUS,
          DictionaryEnum.PERSON_TYPE,
          DictionaryEnum.DOOR_AUTH_TIME_CONFIG,
        ].toString(),
      },
    });
  }

  renderSearchForm() {
    const { authState } = this.props;
    const SearchFormProps = {
      items: [
        { type: 'input', field: 'name', placeholder: '姓名' },
        {
          type: 'select',
          fill: true,
          children: authState,
          field: 'authState',
          placeholder: '授权状态',
          rules: [{ required: true, message: '请选择授权状态!' }],
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
    const ButtonGroupProps = {
      actions: [
        {
          customtype: 'master',
          title: '下发授权',
          disabled: !this.state.selectedRowKeys.length,
          onClick: this.batchAddDoorAuth,
        },
        {
          customtype: 'warning',
          title: '删除授权',
          disabled: !this.state.selectedRowKeys.length,
          onClick: this.batchDeleteDoorAuth,
        },
      ],
    };
    return <ButtonGroup {...ButtonGroupProps} />;
  }

  // eslint-disable-next-line max-lines-per-function
  renderTable() {
    const { doorAuthData } = this.props;
    const { selectedRowKeys } = this.state;
    if (isEmpty(doorAuthData) || !doorAuthData) {
      return null;
    }
    const columns: ColumnProps<any>[] = [
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
        width: '10%',
        align: 'center',
        render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '登记照',
        width: '10%',
        align: 'center',
        dataIndex: 'url',
        key: 'url',
        render: (text: any, record: object) => (
          <Img image={text} className={styles.image} previewImg={true} />
        ),
      },
      {
        title: '人员类型',
        width: '10%',
        align: 'center',
        dataIndex: 'typeStr',
        key: 'typeStr',
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
        title: '授权状态',
        width: '8%',
        align: 'center',
        key: 'authStateStr',
        dataIndex: 'authStateStr',
        render: (text: any, record: any) => {
          const { authState } = record;
          let badge = 'success';
          if (authState !== '1') {
            badge = 'error';
          }
          return (
            <div style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}>
              <Badge status={badge as 'success' | 'error'} />
              {text}
            </div>
          );
        },
      },
      {
        title: '操作',
        align: 'center',
        // width: '25%',
        key: 'action',
        render: (_text: any, record: any) =>
          doorAuthData ? (
            <Fragment>
              <Button
                customtype={'icon'}
                onClick={() => this.getDoorAuthInfo(record.id)}
                icon={'pm-edit'}
                title={'修改'}
              />
              <Button
                customtype={'icon'}
                onClick={() => this.deleteDoorAuth(record.id)}
                title={'删除'}
                icon={'pm-trash-can'}
              />
            </Fragment>
          ) : null,
      },
    ];

    const pagination: PaginationConfig = {
      position: 'bottom',
      total: doorAuthData.totalElements,
      current: doorAuthData.pageable.pageNumber + 1,
      pageSize: doorAuthData.pageable.pageSize,
      defaultCurrent: 1,
    };

    return (
      <div className={classNames('flexAuto')}>
        <Table
          columns={columns}
          dataSource={doorAuthData.content}
          scroll={{ y: '100%' }}
          pagination={pagination}
          onSelectRow={this.onTableSelectRow}
          onChange={this.onTableChange}
          selectedRow={selectedRowKeys}
        />
      </div>
    );
  }

  renderModalForm() {
    const { modify, add, deviceAuthInfo = {} } = this.state;
    const { deviceDoorList = [] } = this.props;
    const props = {
      items: [
        {
          type: 'hiddenInput',
          field: 'authDeviceId',
          initialValue: deviceAuthInfo.id,
          hidden: true,
        },
        {
          type: 'select',
          initialValue: deviceAuthInfo.name,
          fill: true,
          disabled: modify,
          children: deviceDoorList,
          field: 'deviceId',
          placeholder: '授权设备',
          rules: [{ required: true, message: '请选择授权设备!' }],
        },
        {
          type: 'rangePicker',
          initialValue: deviceAuthInfo.authStartDate
            ? [moment(deviceAuthInfo.authStartDate), moment(deviceAuthInfo.authEndDate)]
            : null,
          timeBegin: deviceAuthInfo.authStartDate
            ? moment(deviceAuthInfo.authStartDate)
            : undefined,
          fill: true,
          field: 'time',
          label: '下发授权',
          placeholder: ['开始时间', '结束时间'] as [string, string],
          rules: [{ required: true, message: '请输入授权时间!' }],
        },
      ],
      actions: [
        { customtype: 'select', title: '确定', htmlType: 'submit' as 'submit' },
        { customtype: 'second', title: '取消', onClick: this.onFormModelCancel },
      ],
      onSubmit: this.onModelSubmit,
      title: modify ? '修改授权' : '新增授权',
      onCancel: this.onFormModelCancel,
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

  renderICCardModalForm() {
    const { addICCardFormModal, personAuthInfoId } = this.state;
    const props = {
      items: [
        {
          type: 'hiddenInput',
          field: 'id',
          initialValue: personAuthInfoId,
          hidden: true,
        },
        {
          type: 'input',
          field: 'code',
          label: 'IC卡号',
          autofocus: 'autofocus',
          placeholder: '请将IC卡放置采集器上',
          fill: true,
        },
      ],
      actions: [
        { customtype: 'select', title: '确定', htmlType: 'submit' as 'submit' },
        { customtype: 'second', title: '取消', onClick: this.onAddICCardFormModelCancel },
      ],
      onSubmit: this.onAddICCardModelSubmit,
      title: '新增IC卡',
      onCancel: this.onAddICCardFormModelCancel,
      destroyOnClose: true,
      width: '30%',
      bodyStyle: {},
      add: false,
      modify: addICCardFormModal,
      onGetFormRef: (modelForm: WrappedFormUtils) => {
        this.ICCardModelForm = modelForm;
      },
    };
    return <ModalForm {...props} />;
  }

  renderConfirm() {
    return <Confirm type={'warning'} ref={this.confirmRef} />;
  }

  renderTabs() {
    const { personType } = this.props;
    if (!personType) {
      return null;
    }
    // if (personType[0].key !== '0') personType.unshift({ value: '所有人', key: '0' });
    return (
      <div className={styles.tabs}>
        <div className={styles.subTitle}>信息展示</div>
        <Tabs onChange={this.onChangeTab} type={'line'}>
          {personType.map(item => {
            if (
              item.value === '区委干部' ||
              item.value === '社区民警' ||
              item.value === '单位人员' ||
              item.value === '访客' ||
              item.value === '志愿者'
            ) {
              return null;
            }
            return <TabPane tab={item.value} key={item.key} />;
          })}
        </Tabs>
      </div>
    );
  }

  // eslint-disable-next-line max-lines-per-function
  renderModal() {
    const { modalVisible } = this.state;
    const { doorAuthInfo = [] } = this.props;
    const columns: ColumnProps<any>[] = [
      {
        title: '设备名称',
        dataIndex: 'name',
        key: 'name',
        width: '30%',
        align: 'center',
        render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '授权时间',
        width: '50%',
        align: 'center',
        dataIndex: 'url',
        key: 'url',
        render: (text: any, record: any) =>
          CommonComponent.renderTableCol(record.authStartDate + '-' + record.authEndDate, record),
      },
      {
        title: '操作',
        align: 'center',
        // width: '25%',
        key: 'action',
        render: (_text: any, record: any) =>
          doorAuthInfo ? (
            <Fragment>
              <Button
                customtype={'icon'}
                onClick={() => this.updateDoorAuth(record)}
                icon={'pm-edit'}
                title={'修改'}
              />
              <Button
                customtype={'icon'}
                onClick={() => this.deletePersonDeviceAuth(record.id)}
                title={'删除'}
                icon={'pm-trash-can'}
              />
            </Fragment>
          ) : null,
      },
    ];

    const deviceColumns: ColumnProps<any>[] = [
      {
        title: '编号',
        dataIndex: 'code',
        key: 'code',
        width: '30%',
        align: 'center',
        render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '创建时间',
        width: '50%',
        align: 'center',
        dataIndex: 'creatTime',
        key: 'creatTime',
        render: (text: any, record: any) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '操作',
        align: 'center',
        // width: '25%',
        key: 'action',
        render: (_text: any, record: any) =>
          doorAuthInfo ? (
            <Fragment>
              <Button
                customtype={'icon'}
                // onClick={() => this.deletePersonDeviceAuth(record.id)}
                title={'删除'}
                icon={'pm-trash-can'}
              />
            </Fragment>
          ) : null,
      },
    ];
    const data = [
      { code: '12113311', creatTime: '2019-10-10' },
      { code: '12113311', creatTime: '2019-10-10' },
      { code: '12113311', creatTime: '2019-10-10' },
    ];

    return (
      <Modal
        centered
        width={'70%'}
        destroyOnClose={true}
        onCancel={this.onModalCancel}
        visible={modalVisible}
        footer={null}
        maskClosable={false}
        title={
          <Tabs defaultActiveKey="1" onChange={this.modalTabsChange}>
            <TabPane tab="设备信息" key="1">
              <FormItem label={'人脸照片'}>
                <Upload
                  uploadType={'picture'}
                  title={'上传图片'}
                  // beforeUpload={beforeUpload}
                  // onChange={onChange}
                />
              </FormItem>
              <FormItem label={'IC卡新增'}>
                <Button customtype={'select'} onClick={this.addICCard}>
                  新增IC卡
                </Button>
              </FormItem>
              <div className={classNames('flexAuto', styles.table)}>
                <Table
                  type={'none'}
                  columns={deviceColumns}
                  hiddenPagination={true}
                  dataSource={data}
                  scroll={{ y: '100%' }}
                  onSelectRow={this.onTableSelectRow}
                />
              </div>
            </TabPane>
            <TabPane tab="授权信息" key="2">
              <FormItem label={'租住时间'}>
                <DatePicker.RangePicker
                  placeholder={['开始时间', '结束时间'] as [string, string]}
                  showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                  // onChange={this.onChange as onRangePickerChange}
                  // getCalendarContainer={this.getContainer}
                />
              </FormItem>
              <FormItem label={'授权设备'}>
                <div className={classNames('flexColCenter', 'itemCenter', styles.anthDeviceBtn)}>
                  <Button
                    customtype={'select'}
                    icon={'pm-add'}
                    onClick={() => this.addDoorAuth(doorAuthInfo)}
                  >
                    新增授权设备
                  </Button>
                  <div className={styles.addAuthText}>(开通更多设备权限)</div>
                </div>
              </FormItem>
              {doorAuthInfo.length > 0 ? (
                <div className={classNames('flexAuto', styles.table)}>
                  <Table
                    type={'none'}
                    columns={columns}
                    hiddenPagination={true}
                    dataSource={doorAuthInfo}
                    scroll={{ y: '100%' }}
                    onSelectRow={this.onTableSelectRow}
                  />
                </div>
              ) : null}
            </TabPane>
            <TabPane tab="人员信息" key="3">
              <div className={'flexBetween'}>
                <FormItem label={'人脸照片'} style={{ width: '50%' }}>
                  <div className={styles.image}>
                    <Img
                      className={styles.picture}
                      defaultImg={'http://192.168.50.155:8080/public//201910111100536.png'}
                      image={'http://192.168.50.155:8080/public//201910111100536.png'}
                      previewImg={true}
                    />
                  </div>
                </FormItem>
                <FormItem label={'证件照片'} style={{ width: '50%' }}>
                  <div className={styles.image}>
                    <Img
                      className={styles.picture}
                      defaultImg={'http://192.168.50.155:8080/public//201910111100536.png'}
                      image={'http://192.168.50.155:8080/public//201910111100536.png'}
                      previewImg={true}
                    />
                  </div>
                </FormItem>
              </div>
              <KVTable>
                <KVTable.Item name={'姓名'}>{'张三'}</KVTable.Item>
                <KVTable.Item name={'证件号码'}>{'331010200001010014'}</KVTable.Item>
                <KVTable.Item name={'民族'}>{'汉'}</KVTable.Item>
                <KVTable.Item name={'证件地址'}>{'浙江省温州市龙湾区'}</KVTable.Item>
                <KVTable.Item name={'人员类型'}>{'业主'}</KVTable.Item>
                <KVTable.Item name={'详细地址'}>{'1栋1单元101'}</KVTable.Item>
                <KVTable.Item name={'电话'}>{'15999998888'}</KVTable.Item>
              </KVTable>
            </TabPane>
          </Tabs>
        }
        wrapClassName={styles.model}
      />
    );
  }

  renderAuthorizationModal() {
    const { doAuthorizationModal } = this.state;
    const { doorAuthTimeCofig } = this.props;
    const props = {
      items: [
        {
          type: 'select',
          fill: true,
          children: doorAuthTimeCofig,
          field: 'authTime',
          placeholder: '授权时间',
          rules: [{ required: true, message: '请选择授权时间!' }],
        },
      ],
      actions: [
        { customtype: 'select', icon: 'search', title: '授权', htmlType: 'submit' as 'submit' },
        { customtype: 'second', title: '取消', onClick: this.onFormModelCancel },
      ],
      onSubmit: this.onAuthorizationModelSubmit,
      title: '批量下发授权',
      onCancel: this.onFormModelCancel,
      destroyOnClose: true,
      width: '20%',
      bodyStyle: {},
      add: doAuthorizationModal,
      modify: false,
      onGetFormRef: (modelForm: WrappedFormUtils) => {
        this.authorizationModelForm = modelForm;
      },
    };
    return <ModalForm {...props} />;
  }

  renderOperatingResults() {
    const { operatingResultsVisible, batchHandleResultsData } = this.state;
    const props = {
      visible: operatingResultsVisible,
      onCancel: this.onCancelOperatingResults,
      data: batchHandleResultsData,
    };
    return <OperatingResults {...props} />;
  }

  render() {
    return (
      <div className={classNames('height100', 'flexColStart')}>
        <div className={'listTitle'}>信息筛选</div>
        {this.renderSearchForm()}
        {this.renderTabs()}
        {this.renderButtonGroup()}
        {this.renderTable()}
        {this.renderModalForm()}
        {this.renderModal()}
        {this.renderConfirm()}
        {this.renderAuthorizationModal()}
        {this.renderICCardModalForm()}
        {this.renderOperatingResults()}
      </div>
    );
  }

  onCancelOperatingResults = () => {
    this.setState({ operatingResultsVisible: false });
  };

  modalTabsChange = key => {
    console.log('key: ', key);
  };

  onSearch = (e: React.FormEvent<HTMLFormElement>) => {
    if (e) {
      e.preventDefault();
    }
    this.searchForm.validateFields((err, fieldsValue) => {
      if (err) return;
      const type = this.state.searchFields.type ? this.state.searchFields.type : null;
      if (type) {
        fieldsValue.type = type;
      }
      this.setState({
        searchFields: { ...fieldsValue },
      });
      fieldsValue.page = 0;
      this.getDoorAuthData(fieldsValue);
    });
  };

  getDoorAuthData = Fileds => {
    const { dispatch } = this.props;
    this.setState({ selectedRowKeys: [] });
    dispatch({ type: 'doorAuth/getPersonAuth', payload: { ...Fileds } });
  };

  getDoorAuthInfo = (id: number) => {
    const { dispatch } = this.props;
    dispatch({ type: 'doorAuth/getPersonAuthInfo', payload: { id } }).then(() => {
      this.setState({
        modalVisible: true,
        personAuthInfoId: id,
      });
    });
  };

  onTableChange = (pagination, filters, sorter, extra) => {
    const searchFields = { ...this.state.searchFields };
    searchFields.size = pagination.pageSize;
    this.setState({
      searchFields,
    });
    searchFields.page = --pagination.current;
    searchFields.size = pagination.pageSize;
    this.getDoorAuthData(searchFields);
  };

  addDoorAuth = doorAuthInfo => {
    const idList: string[] = [];
    if (doorAuthInfo.length > 0) {
      doorAuthInfo.forEach(item => {
        idList.push(item.deviceId);
      });
    }
    this.getDeviceDoorList(idList.toString(), () => {
      this.setState({
        add: true,
      });
    });
  };

  searchFormReset = () => {
    const searchFields = { ...this.state.searchFields };
    const reSearchFields: any = searchFields.type ? { type: searchFields.type } : {};
    this.setState({
      searchFields: reSearchFields,
    });
    this.searchForm.resetFields();
    reSearchFields.page = 0;
    this.getDoorAuthData(reSearchFields);
  };

  onTableSelectRow = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys });
  };

  updateDoorAuth = data => {
    this.setState({
      modify: true,
      deviceAuthInfo: data,
    });
  };
  getDeviceDoorList = (payload, callBack) => {
    const { dispatch } = this.props;
    dispatch({ type: 'doorAuth/getDeviceDoorList', payload: { id: payload } }).then(() =>
      callBack(),
    );
  };

  onFormModelCancel = () => {
    this.setState({
      add: false,
      modify: false,
      doAuthorizationModal: false,
      deviceAuthInfo: {},
    });
  };

  addICCard = () => {
    this.setState({
      addICCardFormModal: true,
    });
  };
  onAddICCardFormModelCancel = () => {
    this.setState({
      addICCardFormModal: false,
    });
  };

  onModalCancel = () => {
    this.setState({
      modalVisible: false,
      deviceAuthInfo: {},
    });
  };

  // batchAddDoorAuth = () => {
  //   if (this.confirmRef.current) {
  //     this.confirmRef.current.open(
  //       () => this.onAddPersonAuth(this.state.selectedRowKeys),
  //       '权限下发',
  //       '是否确认下发选中的条目权限？',
  //       'success',
  //     );
  //   }
  // };
  batchAddDoorAuth = () => {
    this.setState({
      doAuthorizationModal: true,
    });
  };

  batchDeleteDoorAuth = () => {
    if (this.confirmRef.current) {
      this.confirmRef.current.open(
        () => this.onDeleteDoorAuth(this.state.selectedRowKeys),
        '删除',
        '是否确认删除选中的条目？',
      );
    }
  };

  deleteDoorAuth = (id: number) => {
    if (this.confirmRef.current) {
      this.confirmRef.current.open(() => this.onDeleteDoorAuth([id]), '删除', '是否确认删除？');
    }
  };

  onDeleteDoorAuth = async payload => {
    const { dispatch } = this.props;
    const data = await dispatch({ type: 'doorAuth/deletePersonAuth', payload });
    if (data) {
      if (data.success) {
        const searchFields = { ...this.state.searchFields };
        searchFields.page = 0;
        this.getDoorAuthData(searchFields);
      } else if (data.error === 1) {
        Message.error(data.message);
      } else if (data.error > 1) {
        this.setState({ operatingResultsVisible: true, batchHandleResultsData: data });
      }
    }
  };

  deletePersonDeviceAuth = (id: number) => {
    if (this.confirmRef.current) {
      this.confirmRef.current.open(
        () => this.onDeletePersonDeviceAuth(id),
        '删除',
        '是否确认删除？',
      );
    }
  };

  onDeletePersonDeviceAuth = data => {
    const { dispatch } = this.props;
    dispatch({ type: 'doorAuth/deletePersonDeviceAuth', payload: { id: data } }).then(() =>
      this.getDoorAuthInfo(this.state.personAuthInfoId || 0),
    );
  };

  onGetFormRef = (form: WrappedFormUtils) => {
    this.searchForm = form;
  };

  onDatePickerChange = (date: moment.Moment, dateString: string) => {};

  onSelectChange = (value, option) => {};

  // onAddPersonAuth = fieldsValue => {
  //   const { dispatch } = this.props;
  //   dispatch({
  //     type: 'doorAuth/addPersonAuth',
  //     payload: fieldsValue,
  //   })
  //     .then(() => {
  //       const searchFields = { ...this.state.searchFields };
  //       searchFields.page = 0;
  //       this.getDoorAuthData(searchFields);
  //     })
  //     .then(() => this.onFormModelCancel());
  // };

  onAddPersonAuth = fieldsValue => {
    const { dispatch } = this.props;
    dispatch({
      type: 'doorAuth/addPersonAuth',
      payload: fieldsValue,
    }).then(() => {
      const searchFields = { ...this.state.searchFields };
      searchFields.page = 0;
      this.getDoorAuthData(searchFields);
      this.onFormModelCancel();
    });
  };

  onAddPersonDeviceAuth = fieldsValue => {
    const { dispatch } = this.props;
    dispatch({
      type: 'doorAuth/addPersonDeviceAuth',
      payload: fieldsValue,
    }).then(() => {
      const searchFields = { ...this.state.searchFields };
      searchFields.page = 0;
      this.getDoorAuthData(searchFields);
      this.getDoorAuthInfo(this.state.personAuthInfoId || 0);
      this.onFormModelCancel();
    });
  };

  onUpdatePersonDeviceAuth = fieldsValue => {
    const { dispatch } = this.props;
    dispatch({
      type: 'doorAuth/updatePersonDeviceAuth',
      payload: fieldsValue,
    }).then(() => {
      const searchFields = { ...this.state.searchFields };
      searchFields.page = 0;
      this.getDoorAuthData(searchFields);
      this.getDoorAuthInfo(this.state.personAuthInfoId || 0);
      this.onFormModelCancel();
    });
  };

  onAddICCardModelSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    this.ICCardModelForm.validateFields((err, fieldsValue) => {
      if (!err) {
        if (fieldsValue.time) {
          fieldsValue.authStartDate = moment(fieldsValue.time[0]).format('YYYY-MM-DD HH:mm:ss');
          fieldsValue.authEndDate = moment(fieldsValue.time[1]).format('YYYY-MM-DD HH:mm:ss');
          delete fieldsValue.time;
        }
        // this.onAddPersonDeviceAuth(fieldsValue);
      }
    });
  };

  onModelSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { add, modify } = this.state;
    this.modelForm.validateFields((err, fieldsValue) => {
      console.log('fieldsValue: ', fieldsValue);
      if (!err) {
        if (fieldsValue.time) {
          fieldsValue.authStartDate = moment(fieldsValue.time[0]).format('YYYY-MM-DD HH:mm:ss');
          fieldsValue.authEndDate = moment(fieldsValue.time[1]).format('YYYY-MM-DD HH:mm:ss');
          delete fieldsValue.time;
        }
        if (add) {
          fieldsValue.id = this.state.personAuthInfoId;
          this.onAddPersonDeviceAuth(fieldsValue);
        } else if (modify) {
          delete fieldsValue.deviceId;
          this.onUpdatePersonDeviceAuth(fieldsValue);
        }
      }
    });
  };

  onAuthorizationModelSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { selectedRowKeys } = this.state;
    this.authorizationModelForm.validateFields((err, fieldsValue) => {
      if (!err) {
        if (fieldsValue.time) {
          fieldsValue.authStartDate = moment(fieldsValue.time[0]).format('YYYY-MM-DD HH:mm:ss');
          fieldsValue.authEndDate = moment(fieldsValue.time[1]).format('YYYY-MM-DD HH:mm:ss');
          delete fieldsValue.time;
        }
        fieldsValue.ids = selectedRowKeys;
        // this.onAddPersonDeviceAuth(fieldsValue);
      }
    });
  };

  onChangeTab = key => {
    const searchFields = { ...this.state.searchFields };
    if (key === '0') {
      delete searchFields.type;
    } else {
      searchFields.type = key;
    }
    this.setState({
      searchFields: { ...searchFields },
    });
    searchFields.page = 0;
    this.getDoorAuthData(searchFields);
  };
}

export default DoorAuth;
