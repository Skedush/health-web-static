import React, { PureComponent, Fragment, RefObject, createRef } from 'react';
import moment from 'moment';
import { connect } from '@/utils/decorators';
import classNames from 'classnames';
import { isPhone, isLongitude, isLatitude, isPort, isIP } from '@/utils/validater';
import { isEmpty } from 'lodash';
import {
  Table,
  SearchForm,
  ButtonGroup,
  Button,
  CommonComponent,
  ModalForm,
  Badge,
  ModalDetail,
  Confirm,
  OperatingResults,
} from '@/components/Library';
import {
  FormComponentProps,
  PaginationConfig,
  WrappedFormUtils,
  ColumnProps,
  UploadFile,
} from '@/components/Library/type';
import { GlobalState, UmiComponentProps, DictionaryEnum } from '@/common/type';
import { SINGLE_COLUMN_WIDTH, DOUBLE_COLUMN_WIDTH } from '@/utils/constant';

const mapStateToProps = ({ accessScreen, app, device, loading: { effects } }: GlobalState) => {
  return {
    accessScreenData: accessScreen.accessScreenData,
    buildUnit: app.dictionry[DictionaryEnum.BUILD_UNIT],
    deviceStatus: app.dictionry[DictionaryEnum.DEVICE_STATUS],
    gateDirection: app.dictionry[DictionaryEnum.GATE_DIRECTION],
    operateType: app.dictionry[DictionaryEnum.OPERATE_TYPE],
    deviceSpec: device.deviceSpec,
    accessScreenDetail: accessScreen.accessScreenDetail,
    loading: {
      getAccessScreenDeviceLoading: effects['accessScreen/getAccessScreenDevice'],
      addAccessScreenDeviceLoading: effects['accessScreen/addAccessScreenDevice'],
      updateAccessScreenDeviceLoading: effects['accessScreen/updateAccessScreenDevice'],
      deleteAccessScreenDeviceLoading: effects['accessScreen/deleteAccessScreenDevice'],
    },
  };
};
type onSelectChange = (
  value: any,
  option: React.ReactElement<any> | React.ReactElement<any>[],
) => void;
type AccessScreenStateProps = ReturnType<typeof mapStateToProps>;
type AccessScreenProps = AccessScreenStateProps & UmiComponentProps & FormComponentProps;

interface AccessScreenState {
  add: boolean;
  modify: boolean;
  fileList: UploadFile[];
  showDeleteConfirm: boolean;
  selectedRowKeys: number[];
  searchFields: { [propName: string]: any };
  deviceBrand: string;
  bigType: string;
  accessScreen: any;
  accessScreenDetailModalVisible: boolean;
}

@connect(
  mapStateToProps,
  null,
)
class AccessScreen extends PureComponent<AccessScreenProps, AccessScreenState> {
  searchForm: WrappedFormUtils;
  modelForm: WrappedFormUtils;
  confirmRef: RefObject<Confirm>;

  operatingResultRef: RefObject<OperatingResults>;

  constructor(props: Readonly<AccessScreenProps>) {
    super(props);
    this.confirmRef = createRef();
    this.operatingResultRef = createRef();
    this.state = {
      showDeleteConfirm: true,
      fileList: [],
      add: false,
      modify: false,
      selectedRowKeys: [],
      searchFields: {},
      deviceBrand: '',
      bigType: '',
      accessScreen: {},
      accessScreenDetailModalVisible: false,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    this.getAccessScreenData({ page: 0 });
    dispatch({ type: 'device/getDeviceSpec', payload: { type: 5 } });
    dispatch({
      type: 'app/getDic',
      payload: {
        type: [
          DictionaryEnum.BUILD_UNIT,
          DictionaryEnum.OPERATE_TYPE,
          DictionaryEnum.DEVICE_STATUS,
          DictionaryEnum.GATE_DIRECTION,
        ].toString(),
      },
    });
  }
  renderSearchForm() {
    const { buildUnit, deviceStatus, operateType } = this.props;
    const SearchFormProps = {
      items: [
        { type: 'input', field: 'name', placeholder: '设备名称' },
        {
          type: 'select',
          field: 'buildUnit',
          placeholder: '建设单位',
          children: buildUnit,
        },
        { type: 'select', field: 'operator', placeholder: '运营单位', children: operateType },
        { type: 'select', field: 'status', placeholder: '设备状态', children: deviceStatus },
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
    const { loading } = this.props;
    const ButtonGroupProps = {
      actions: [
        {
          customtype: 'master',
          title: '新增',
          onClick: this.addAccessScreen,
          loading: loading.addAccessScreenDeviceLoading,
        },
        {
          customtype: 'warning',
          disabled: !this.state.selectedRowKeys.length,
          loading: loading.deleteAccessScreenDeviceLoading,
          title: '删除',
          onClick: this.batchDeleteAccessScreen,
        },
      ],
    };
    return <ButtonGroup {...ButtonGroupProps} />;
  }

  // eslint-disable-next-line max-lines-per-function
  renderTable() {
    const { accessScreenData, loading } = this.props;
    const { selectedRowKeys } = this.state;

    if (isEmpty(accessScreenData) || !accessScreenData) {
      return null;
    }

    const columns: ColumnProps<any>[] = [
      {
        title: '设备名称',
        width: SINGLE_COLUMN_WIDTH,
        dataIndex: 'name',
        key: 'name',
        render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '设备类型',
        dataIndex: 'typeStr',
        key: 'typeStr',
        width: SINGLE_COLUMN_WIDTH,
        render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      },

      {
        title: '设备地址',
        width: DOUBLE_COLUMN_WIDTH,
        dataIndex: 'address',
        key: 'address',
        render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '建设单位',
        width: SINGLE_COLUMN_WIDTH,
        key: 'buildUnitStr',
        dataIndex: 'buildUnitStr',
        render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '运营单位',
        width: SINGLE_COLUMN_WIDTH,
        key: 'operatorStr',
        dataIndex: 'operatorStr',
        render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '运营电话',
        width: SINGLE_COLUMN_WIDTH,
        key: 'operatorPhone',
        dataIndex: 'operatorPhone',
        render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '建设时间',
        width: SINGLE_COLUMN_WIDTH,
        key: 'buildDate',
        dataIndex: 'buildDate',
        render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '设备状态',
        width: SINGLE_COLUMN_WIDTH,
        key: 'statusStr',
        dataIndex: 'statusStr',
        render: (text: any, record: any) => {
          const { status } = record;
          let badge = 'success';
          if (status !== '1') {
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
        width: DOUBLE_COLUMN_WIDTH,
        key: 'action',
        render: (_text: any, record: any) =>
          accessScreenData ? (
            <Fragment>
              <Button
                customtype={'icon'}
                onClick={e => this.openModelDetail(record.id, e)}
                icon={'pm-details'}
                title={'详情'}
              />
              <Button
                customtype={'icon'}
                onClick={e => this.updateAccessScreen(record.id, e)}
                icon={'pm-edit'}
                title={'修改'}
              />
              <Button
                customtype={'icon'}
                onClick={e => this.deleteAccessScreen(record.id, e)}
                title={'删除'}
                icon={'pm-trash-can'}
              />
            </Fragment>
          ) : null,
      },
    ];

    const pagination: PaginationConfig = {
      position: 'bottom',
      total: accessScreenData.totalElements,
      current: accessScreenData.pageable.pageNumber + 1,
      pageSize: accessScreenData.pageable.pageSize,
      defaultCurrent: 1,
      // onChange: this.onChangePage,
    };

    return (
      <div className={classNames('flexAuto')}>
        <Table
          columns={columns}
          dataSource={accessScreenData.content}
          scroll={{ y: '100%' }}
          pagination={pagination}
          loading={loading.getAccessScreenDeviceLoading}
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
    const { modify, add, deviceBrand } = this.state;
    const { buildUnit, operateType, gateDirection, deviceSpec = [], loading } = this.props;

    let { accessScreenDetail = {} } = this.props;

    if (add) accessScreenDetail = {};
    const deviceBrandMap: any[] = [];
    const deviceSpecMap: any[] = [];
    for (const key in deviceSpec) {
      if (deviceSpec.hasOwnProperty(key)) {
        deviceBrandMap.push({ key: key, value: key });
      }
    }
    if (deviceBrand !== '' && deviceSpec.hasOwnProperty(deviceBrand)) {
      deviceSpec[deviceBrand].forEach(item => {
        deviceSpecMap.push({ key: item, value: item });
      });
    }
    const props = {
      items: [
        {
          type: 'hiddenInput',
          field: 'id',
          initialValue: accessScreenDetail.id,
          hidden: true,
        },
        {
          type: 'hiddenInput',
          field: 'type',
          initialValue: accessScreenDetail.type,
          hidden: true,
        },
        {
          type: 'hiddenInput',
          field: 'bigType',
          initialValue: accessScreenDetail.bigType,
          hidden: true,
        },
        {
          type: 'hiddenInput',
          field: 'code',
          initialValue: accessScreenDetail.code,
          hidden: true,
        },
        {
          type: 'radio',
          field: 'transitGateType',
          initialValue: accessScreenDetail.transitGateType,
          children: gateDirection,
          placeholder: '进出方向',
          rules: [{ required: true, message: '请输入设备进出方向!' }],
          span: 8,
        },
        {
          type: 'input',
          maxLength: 20,
          field: 'longitude',
          initialValue: accessScreenDetail.longitude ? accessScreenDetail.longitude.toString() : '',
          span: 8,
          placeholder: '设备经度',
          rules: [
            { required: true, message: '请输入经度!' },
            {
              validator: isLongitude,
            },
          ],
        },
        {
          type: 'input',
          initialValue: accessScreenDetail.latitude ? accessScreenDetail.latitude.toString() : '',
          maxLength: 20,
          span: 8,
          field: 'latitude',
          placeholder: '设备纬度',
          rules: [
            { required: true, message: '请输入纬度!' },
            {
              validator: isLatitude,
            },
          ],
        },
        {
          type: 'input',
          initialValue: accessScreenDetail.address,
          field: 'address',
          maxLength: 50,
          placeholder: '设备地址',
          span: 8,
          rules: [{ required: true, message: '请输入设备地址!' }],
        },
        {
          type: 'select',
          initialValue: accessScreenDetail.brand,
          span: 8,
          children: deviceBrandMap,
          field: 'brand',
          placeholder: '设备品牌',
          rules: [{ required: true, message: '请选择品牌!' }],
          onChange: this.onBrandOnChange,
        },
        {
          type: 'select',
          initialValue: accessScreenDetail.spec,
          span: 8,
          children: deviceSpecMap,
          field: 'spec',
          placeholder: '设备型号',
          rules: [{ required: true, message: '请选择型号!' }],
        },
        {
          type: 'input',
          initialValue: accessScreenDetail.ip,
          span: 8,
          maxLength: 20,
          field: 'ip',
          placeholder: '设备ip',
          rules: [
            { required: true, message: '请输入设备ip!' },
            {
              validator: isIP,
            },
          ],
        },
        {
          type: 'input',
          initialValue: accessScreenDetail.port,
          span: 8,
          maxLength: 6,
          field: 'port',
          placeholder: '设备端口',
          rules: [
            { required: true, message: '请输入端口!' },
            {
              validator: isPort,
            },
          ],
        },
        {
          type: 'input',
          initialValue: accessScreenDetail.deviceUsername,
          span: 8,
          maxLength: 20,
          field: 'deviceUsername',
          placeholder: '用户名',
          rules: [{ required: true, message: '请输入用户名!' }],
        },
        {
          type: 'input',
          initialValue: accessScreenDetail.devicePassword,
          span: 8,
          maxLength: 20,
          field: 'devicePassword',
          placeholder: '密码',
          rules: [{ required: true, message: '请输入密码!' }],
        },
        {
          type: 'select',
          initialValue: accessScreenDetail.buildUnit,
          span: 8,
          children: buildUnit,
          field: 'buildUnit',
          placeholder: '建设单位',
          rules: [{ required: true, message: '请选择建设单位!' }],
        },

        {
          type: 'input',
          initialValue: accessScreenDetail.buildUnitPhone,
          span: 8,
          field: 'buildUnitPhone',
          maxLength: 20,
          placeholder: '建设单位电话',
          rules: [
            { required: true, message: '请输入联系电话!' },
            {
              validator: isPhone,
            },
          ],
        },
        {
          type: 'datePicker',
          initialValue: accessScreenDetail.buildDate
            ? moment(accessScreenDetail.buildDate)
            : undefined,
          span: 8,
          field: 'buildDate',
          showTime: false,
          placeholder: '建设时间',
          rules: [{ required: true, message: '请选择建设时间!' }],
        },
        {
          type: 'select',
          initialValue: accessScreenDetail.operator,
          span: 8,
          children: operateType,
          field: 'operator',
          placeholder: '运营单位',
          rules: [{ required: true, message: '请选择运营单位!' }],
        },
        {
          type: 'input',
          initialValue: accessScreenDetail.operatorPhone,
          span: 8,
          maxLength: 20,
          field: 'operatorPhone',
          placeholder: '运营单位电话',
          rules: [
            { required: true, message: '请输入联系电话!' },
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
          loading: loading.addAccessScreenDeviceLoading || loading.updateAccessScreenDeviceLoading,
        },
        { customtype: 'second', title: '取消', onClick: this.onCancelModel },
      ],
      onSubmit: this.onModelSubmit,
      title: modify ? '修改出入屏信息' : '新增出入屏信息',
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
    const { accessScreenDetailModalVisible } = this.state;
    const { accessScreenDetail = {} } = this.props;
    const props = {
      items: [
        {
          name: '设备经度',
          value: accessScreenDetail.longitude,
        },
        {
          name: '设备纬度',
          value: accessScreenDetail.latitude,
        },
        {
          name: '设备名称',
          value: accessScreenDetail.name,
        },
        {
          name: '设备类型',
          value: accessScreenDetail.typeStr,
        },
        {
          name: '设备品牌',
          value: accessScreenDetail.brand,
        },
        {
          name: '设备型号',
          value: accessScreenDetail.spec,
        },
        {
          name: '设备ip',
          value: accessScreenDetail.ip,
        },
        {
          name: '设备端口',
          value: accessScreenDetail.port,
        },
        {
          name: '用户名',
          value: accessScreenDetail.deviceUsername,
        },
        {
          name: '密码',
          value: accessScreenDetail.devicePassword,
        },
        {
          name: '建设单位',
          value: accessScreenDetail.buildUnitStr,
        },
        {
          name: '联系电话',
          value: accessScreenDetail.buildUnitPhone,
        },
        {
          name: '运营单位',
          value: accessScreenDetail.operatorStr,
        },
        {
          name: '联系电话',
          value: accessScreenDetail.operatorPhone,
        },
        {
          name: '设备地址',
          value: accessScreenDetail.address,
          fill: true,
        },
      ],
      info: accessScreenDetail || {},
      visible: accessScreenDetailModalVisible,
      onCancel: this.onCancelModel,
      title: '出入屏设备详情',
    };

    return <ModalDetail {...props} />;
  }

  render() {
    return (
      <div className={classNames('height100', 'flexColStart')}>
        <OperatingResults ref={this.operatingResultRef} />
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

  onBrandOnChange: onSelectChange = (value, option) => {
    this.setState({ deviceBrand: value });
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
      this.getAccessScreenData(fieldsValue);
    });
  };

  getAccessScreenData = Fileds => {
    const { dispatch } = this.props;
    this.setState({ selectedRowKeys: [] });
    dispatch({ type: 'accessScreen/getAccessScreenDevice', payload: { ...Fileds } });
  };

  getAccessScreenInfo = (id: number) => {
    const { dispatch } = this.props;
    dispatch({ type: 'accessScreen/getAccessScreenById', payload: { id } }).then(res => {
      if (res) {
        this.setState({ deviceBrand: res.data.brand, bigType: res.data.bigType });
      }
    });
  };

  onTableChange = (pagination, filters, sorter, extra) => {
    console.log('pagination: ', pagination);
    const searchFields = { ...this.state.searchFields };
    searchFields.page = --pagination.current;
    searchFields.size = pagination.pageSize;
    this.getAccessScreenData(searchFields);
  };

  addAccessScreen = () => {
    this.setState({
      add: true,
    });
  };

  searchFormReset = () => {
    this.searchForm.resetFields();
    this.setState({
      searchFields: {},
    });
    this.getAccessScreenData({ page: 0 });
    this.setState({ searchFields: {} });
  };

  onTableSelectRow = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys });
  };

  updateAccessScreen = (id: number, e) => {
    e.stopPropagation();
    this.setState({
      modify: true,
    });
    this.getAccessScreenInfo(id);
  };

  onCancelModel = () => {
    this.setState({
      add: false,
      modify: false,
      accessScreenDetailModalVisible: false,
      accessScreen: {},
    });
  };

  batchDeleteAccessScreen = () => {
    if (this.confirmRef.current) {
      this.confirmRef.current.open(
        () => this.onDeleteAccessScreen(this.state.selectedRowKeys),
        '删除',
        '是否确认删除选中的条目？',
      );
    }
  };

  deleteAccessScreen = (id: number, e) => {
    e.stopPropagation();
    if (this.confirmRef.current) {
      this.confirmRef.current.open(() => this.onDeleteAccessScreen([id]), '删除', '是否确认删除？');
    }
  };

  onDeleteAccessScreen = payload => {
    const { dispatch } = this.props;
    dispatch({ type: 'accessScreen/deleteAccessScreenDevice', payload }).then(data => {
      if (data && data.error > 0) {
        if (this.operatingResultRef.current) {
          this.operatingResultRef.current.open(data);
        }
      } else {
        this.reGetList();
      }
    });
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

  onAddAccessScreen = fieldsValue => {
    const { dispatch } = this.props;
    dispatch({
      type: 'accessScreen/addAccessScreenDevice',
      payload: fieldsValue,
    }).then(res => {
      if (res && res.data && res.data.error && this.operatingResultRef.current) {
        this.operatingResultRef.current.open(res.data);
      } else if (res.success) {
        this.onCancelModel();
        this.getAccessScreenData({ page: 0 });
      }
    });
  };

  onUpdateAccessScreen = fieldsValue => {
    const { dispatch } = this.props;
    dispatch({
      type: 'accessScreen/updateAccessScreenDevice',
      payload: fieldsValue,
    }).then(res => {
      if (res && res.data && res.data.error && this.operatingResultRef.current) {
        this.operatingResultRef.current.open(res.data);
      } else if (res.data) {
        this.onCancelModel();
        this.reGetList();
      }
    });
  };
  reGetList = () => {
    const { accessScreenData = {} } = this.props;
    const searchFields = { ...this.state.searchFields };
    searchFields.page = accessScreenData.number;
    searchFields.size = accessScreenData.size;
    this.getAccessScreenData(searchFields);
  };

  onModelSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { add, modify } = this.state;
    this.modelForm.validateFields((err, fieldsValue) => {
      if (!err) {
        fieldsValue.name = fieldsValue.address + '出入屏';
        fieldsValue.buildDate = moment(fieldsValue.buildDate).format('YYYY-MM-DD HH:mm:ss');
        if (add) {
          this.onAddAccessScreen(fieldsValue);
        } else if (modify) {
          this.onUpdateAccessScreen(fieldsValue);
        }
      }
    });
  };

  onRowCilck = (record: any, index: number, event: Event) => {
    this.openModelDetail(record.id, event);
  };

  openModelDetail = (id, e) => {
    e.stopPropagation();
    this.getAccessScreenInfo(id);
    this.setState({ accessScreenDetailModalVisible: true });
  };
}

export default AccessScreen;
