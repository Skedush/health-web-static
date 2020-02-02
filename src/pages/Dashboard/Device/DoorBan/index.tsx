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
  Confirm,
  ModalDetail,
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

const mapStateToProps = ({ doorBan, app, loading: { effects }, device }: GlobalState) => {
  return {
    doorBanData: doorBan.doorBanData,
    doorBanDeviceType: app.dictionry[DictionaryEnum.DOOR_BAN_DEVICE_TYPE],
    buildUnit: app.dictionry[DictionaryEnum.BUILD_UNIT],
    operateType: app.dictionry[DictionaryEnum.OPERATE_TYPE],
    deviceStatus: app.dictionry[DictionaryEnum.DEVICE_STATUS],
    deviceSpec: device.deviceSpec,
    deviceInfo: device.deviceInfo,
    getDeviceDoorLoading: effects['doorBan/getDeviceDoor'],
    addDeviceDoorLoading: effects['doorBan/addDeviceDoor'],
    getDeviceInfoLoading: effects['device/getDeviceInfo'],
    updateDeviceLoading: effects['device/updateDevice'],
    deleteDeviceLoading: effects['device/deleteDevice'],
  };
};
type onSelectChange = (
  value: any,
  option: React.ReactElement<any> | React.ReactElement<any>[],
) => void;
type DoorBanStateProps = ReturnType<typeof mapStateToProps>;
type DoorBanProps = DoorBanStateProps & UmiComponentProps & FormComponentProps;

interface DoorBanState {
  add: boolean;
  modify: boolean;
  fileList: UploadFile[];
  showDeleteConfirm: boolean;
  selectedRowKeys: number[];
  searchFields: { [propName: string]: any };
  doorBan: any;
  deviceBrand: string;
  doorBanDetail: boolean;
}

@connect(
  mapStateToProps,
  null,
)
class DoorBan extends PureComponent<DoorBanProps, DoorBanState> {
  searchForm: WrappedFormUtils;
  modelForm: WrappedFormUtils;
  confirmRef: RefObject<Confirm>;

  opeartingResultRef: RefObject<OperatingResults>;

  constructor(props: Readonly<DoorBanProps>) {
    super(props);
    this.confirmRef = createRef();
    this.opeartingResultRef = createRef();
    this.state = {
      showDeleteConfirm: true,
      fileList: [],
      add: false,
      modify: false,
      selectedRowKeys: [],
      searchFields: {},
      doorBan: {},
      deviceBrand: '',
      doorBanDetail: false,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    this.getDoorBanData({ page: 0 });
    dispatch({ type: 'device/getDeviceSpec', payload: { type: 1 } });
    dispatch({
      type: 'app/getDic',
      payload: {
        type: [
          DictionaryEnum.DOOR_BAN_DEVICE_TYPE,
          DictionaryEnum.BUILD_UNIT,
          DictionaryEnum.OPERATE_TYPE,
          DictionaryEnum.DEVICE_STATUS,
        ].toString(),
      },
    });
  }
  renderSearchForm() {
    const { doorBanDeviceType, buildUnit, deviceStatus, operateType } = this.props;
    const SearchFormProps = {
      items: [
        { type: 'input', field: 'name', placeholder: '设备名称' },
        { type: 'select', field: 'type', placeholder: '设备类型', children: doorBanDeviceType },
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
    const { deleteDeviceLoading, addDeviceDoorLoading } = this.props;
    const ButtonGroupProps = {
      actions: [
        {
          customtype: 'master',
          title: '新增',
          onClick: this.addDoorBan,
          loading: addDeviceDoorLoading,
        },
        {
          customtype: 'warning',
          disabled: !this.state.selectedRowKeys.length,
          title: '删除',
          onClick: this.batchDeleteDoorBan,
          loading: deleteDeviceLoading,
        },
      ],
    };
    return <ButtonGroup {...ButtonGroupProps} />;
  }

  // eslint-disable-next-line max-lines-per-function
  renderTable() {
    const { doorBanData, getDeviceDoorLoading } = this.props;
    const { selectedRowKeys } = this.state;

    if (isEmpty(doorBanData) || !doorBanData) {
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
        width: DOUBLE_COLUMN_WIDTH,
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
        width: SINGLE_COLUMN_WIDTH,
        key: 'action',
        render: (_text: any, record: any) =>
          doorBanData ? (
            <Fragment>
              <Button
                customtype={'icon'}
                onClick={e => this.openModelDetail(record.id, e)}
                icon={'pm-details'}
                title={'详情'}
              />
              <Button
                customtype={'icon'}
                onClick={e => this.updateDoorBan(record.id, e)}
                icon={'pm-edit'}
                title={'修改'}
              />
              <Button
                customtype={'icon'}
                onClick={e => this.deleteDoorBan(record.id, e)}
                title={'删除'}
                icon={'pm-trash-can'}
              />
            </Fragment>
          ) : null,
      },
    ];

    const pagination: PaginationConfig = {
      position: 'bottom',
      total: doorBanData.totalElements,
      current: doorBanData.pageable.pageNumber + 1,
      pageSize: doorBanData.pageable.pageSize,
      defaultCurrent: 1,
      // onChange: this.onChangePage,
    };

    return (
      <div className={classNames('flexAuto')}>
        <Table
          columns={columns}
          dataSource={doorBanData.content}
          scroll={{ y: '100%' }}
          pagination={pagination}
          onSelectRow={this.onTableSelectRow}
          onChange={this.onTableChange}
          loading={getDeviceDoorLoading}
          // onRowClick={this.onRowCilck}
          selectedRow={selectedRowKeys}
        />
      </div>
    );
  }
  // eslint-disable-next-line max-lines-per-function
  renderModalForm() {
    const { modify, add, deviceBrand } = this.state;
    const {
      doorBanDeviceType,
      buildUnit,
      operateType,
      deviceSpec = [],
      addDeviceDoorLoading,
      updateDeviceLoading,
    } = this.props;
    let { deviceInfo = {} } = this.props;
    if (add) deviceInfo = {};
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
          initialValue: deviceInfo.id,
          hidden: true,
        },
        {
          type: 'hiddenInput',
          field: 'bigType',
          initialValue: deviceInfo.bigType,
          hidden: true,
        },
        {
          type: 'hiddenInput',
          field: 'code',
          initialValue: deviceInfo.code,
          hidden: true,
        },
        {
          type: 'input',
          field: 'longitude',
          initialValue: deviceInfo.longitude,
          maxLength: 20,
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
          initialValue: deviceInfo.latitude,
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
          initialValue: deviceInfo.address,
          field: 'address',
          span: 8,
          maxLength: 50,
          placeholder: '设备地址',
          rules: [{ required: true, message: '请输入设备地址!' }],
        },
        {
          type: 'select',
          initialValue: deviceInfo.type,
          span: 8,
          children: doorBanDeviceType,
          disabled: modify,
          field: 'type',
          onChange: this.onDeviceChange,
          placeholder: '设备类型',
          rules: [{ required: true, message: '请选择设备类型!' }],
        },
        {
          type: 'select',
          initialValue: deviceInfo.brand,
          span: 8,
          field: 'brand',
          disabled: modify,
          children: deviceBrandMap,
          placeholder: '设备品牌',
          rules: [{ required: true, message: '请选择品牌!' }],
          onChange: this.onBrandOnChange,
        },
        {
          type: 'select',
          initialValue: deviceInfo.spec,
          span: 8,
          disabled: modify,
          field: 'spec',
          children: deviceSpecMap,
          placeholder: '设备型号',
          rules: [{ required: true, message: '请选择设备型号!' }],
        },
        {
          type: 'input',
          initialValue: deviceInfo.ip,
          maxLength: 20,
          span: 8,
          disabled: modify,
          field: 'ip',
          placeholder: '设备ip',
          rules: [
            { required: true, message: '请输入ip!' },
            {
              validator: isIP,
            },
          ],
        },
        {
          type: 'input',
          initialValue: deviceInfo.port,
          span: 8,
          maxLength: 60,
          disabled: modify,
          field: 'port',
          placeholder: '设备端口',
          rules: [
            { required: true, message: '请输入设备端口!' },
            {
              validator: isPort,
            },
          ],
        },
        {
          type: 'input',
          initialValue: deviceInfo.deviceUsername,
          span: 8,
          disabled: modify,
          maxLength: 20,
          field: 'deviceUsername',
          placeholder: '用户名',
          rules: [{ required: true, message: '请输入用户名!' }],
        },
        {
          type: 'input',
          initialValue: deviceInfo.devicePassword,
          span: 8,
          disabled: modify,
          maxLength: 20,
          field: 'devicePassword',
          placeholder: '密码',
          rules: [{ required: true, message: '请输入密码!' }],
        },
        {
          type: 'select',
          initialValue: deviceInfo.buildUnit,
          span: 8,
          children: buildUnit,
          field: 'buildUnit',
          placeholder: '建设单位',
          rules: [{ required: true, message: '请选择建设单位!' }],
        },
        {
          type: 'input',
          initialValue: deviceInfo.buildUnitPhone,
          span: 8,
          maxLength: 20,
          field: 'buildUnitPhone',
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
          initialValue: deviceInfo.buildDate ? moment(deviceInfo.buildDate) : undefined,
          span: 8,
          field: 'buildDate',
          placeholder: '建设时间',
          rules: [{ required: true, message: '请选择建设时间!' }],
        },
        {
          type: 'select',
          initialValue: deviceInfo.operator,
          span: 8,
          children: operateType,
          field: 'operator',
          placeholder: '运营单位',
          rules: [{ required: true, message: '请选择运营单位!' }],
        },
        {
          type: 'input',
          initialValue: deviceInfo.operatorPhone,
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
          loading: updateDeviceLoading || addDeviceDoorLoading,
        },
        { customtype: 'second', title: '取消', onClick: this.onCancelModel },
      ],
      onSubmit: this.onModelSubmit,
      title: modify ? '修改门禁设备信息' : '新增门禁设备信息',
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
    const { doorBanDetail } = this.state;
    const { deviceInfo = {} } = this.props;
    const props = {
      items: [
        {
          name: '设备经度',
          value: deviceInfo.longitude,
        },
        {
          name: '设备纬度',
          value: deviceInfo.latitude,
        },
        {
          name: '设备名称',
          value: deviceInfo.name,
        },
        {
          name: '设备类型',
          value: deviceInfo.typeStr,
        },
        {
          name: '设备品牌',
          value: deviceInfo.brand,
        },
        {
          name: '设备型号',
          value: deviceInfo.spec,
        },
        {
          name: '设备ip',
          value: deviceInfo.ip,
        },
        {
          name: '设备端口',
          value: deviceInfo.port,
        },
        {
          name: '用户名',
          value: deviceInfo.deviceUsername,
        },
        {
          name: '密码',
          value: deviceInfo.devicePassword,
        },
        {
          name: '建设单位',
          value: deviceInfo.buildUnitStr,
        },
        {
          name: '联系电话',
          value: deviceInfo.buildUnitPhone,
        },
        {
          name: '运营单位',
          value: deviceInfo.operatorStr,
        },
        {
          name: '联系电话',
          value: deviceInfo.operatorPhone,
        },
        {
          name: '设备地址',
          value: deviceInfo.address,
          fill: true,
        },
      ],
      info: deviceInfo || {},
      visible: doorBanDetail,
      onCancel: this.onCancelModel,
      title: '门禁设备详情',
    };

    return <ModalDetail {...props} />;
  }

  render() {
    return (
      <div className={classNames('height100', 'flexColStart')}>
        <OperatingResults ref={this.opeartingResultRef} />
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

  onDeviceChange = (value, option) => {
    this.props.dispatch({ type: 'device/getDeviceSpec', payload: { type: value } });
  };

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
      this.getDoorBanData(fieldsValue);
    });
  };

  getDoorBanData = Fileds => {
    const { dispatch } = this.props;
    this.setState({ selectedRowKeys: [] });
    dispatch({ type: 'doorBan/getDeviceDoor', payload: { ...Fileds } });
  };

  getDoorBanInfo = (id: number) => {
    const { dispatch } = this.props;
    dispatch({ type: 'device/getDeviceInfo', payload: { id } }).then(res => {
      if (res) {
        this.setState({ deviceBrand: res.data.brand });
      }
    });
  };

  onTableChange = (pagination, filters, sorter, extra) => {
    const searchFields = { ...this.state.searchFields };
    searchFields.page = --pagination.current;
    searchFields.size = pagination.pageSize;
    this.getDoorBanData(searchFields);
  };

  addDoorBan = () => {
    this.setState({
      add: true,
    });
  };

  searchFormReset = () => {
    this.searchForm.resetFields();
    this.setState({
      searchFields: {},
    });
    this.getDoorBanData({ page: 0 });
  };

  onTableSelectRow = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys });
  };

  updateDoorBan = (id: number, e) => {
    e.stopPropagation();
    this.setState({
      modify: true,
    });
    this.getDoorBanInfo(id);
  };

  onCancelModel = () => {
    this.setState({
      add: false,
      modify: false,
      deviceBrand: '',
      doorBanDetail: false,
    });
  };

  batchDeleteDoorBan = () => {
    if (this.confirmRef.current) {
      this.confirmRef.current.open(
        () => this.onDeleteDoorBan(this.state.selectedRowKeys),
        '删除',
        '是否确认删除选中的条目？',
      );
    }
  };

  deleteDoorBan = (id: number, e) => {
    e.stopPropagation();
    if (this.confirmRef.current) {
      this.confirmRef.current.open(() => this.onDeleteDoorBan([id]), '删除', '是否确认删除？');
    }
  };

  onDeleteDoorBan = payload => {
    const { dispatch } = this.props;
    dispatch({ type: 'device/deleteDevice', payload }).then(data => {
      if (this.opeartingResultRef.current && data.error) {
        this.opeartingResultRef.current.open(data);
      }
      this.onCancelModel();
      this.getDoorBanData({ page: 0 });
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

  onAddDoorBan = fieldsValue => {
    const { dispatch } = this.props;
    dispatch({
      type: 'doorBan/addDeviceDoor',
      payload: fieldsValue,
    }).then(res => {
      if (res && res.success) {
        this.onCancelModel();
        this.getDoorBanData({ page: 0 });
      } else if (res && res.data && this.opeartingResultRef.current && res.data.error > 0) {
        this.opeartingResultRef.current.open(res.data);
      }
    });
  };

  onUpdateDoorBan = fieldsValue => {
    const { dispatch } = this.props;
    dispatch({
      type: 'device/updateDevice',
      payload: fieldsValue,
    }).then(data => {
      if (data && data.error && this.opeartingResultRef.current) {
        this.opeartingResultRef.current.open(data);
      } else {
        this.onCancelModel();
        this.getDoorBanData({ page: 0 });
      }
    });
  };

  onModelSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { add, modify } = this.state;
    this.modelForm.validateFields((err, fieldsValue) => {
      if (!err) {
        const { doorBanDeviceType } = this.props;
        const deviceItem = doorBanDeviceType.find(item => item.key === fieldsValue.type);
        fieldsValue.name = fieldsValue.address + deviceItem.value;
        fieldsValue.buildDate = moment(fieldsValue.buildDate).format('YYYY-MM-DD HH:mm:ss');
        if (add) {
          this.onAddDoorBan(fieldsValue);
        } else if (modify) {
          this.onUpdateDoorBan(fieldsValue);
        }
      }
    });
  };

  onRowCilck = (record: any, index: number, event: Event) => {
    this.openModelDetail(record.id, event);
  };

  openModelDetail = (id, e) => {
    e.stopPropagation();
    this.getDoorBanInfo(id);
    this.setState({ doorBanDetail: true });
  };
}

export default DoorBan;
