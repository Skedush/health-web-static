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
  Modal,
  FormSimple,
  OperatingResults,
  Message,
} from '@/components/Library';
import {
  FormComponentProps,
  PaginationConfig,
  WrappedFormUtils,
  ColumnProps,
  UploadFile,
} from '@/components/Library/type';
import { SUCCESS_BINDING, SUCCESS_UNBINDING } from '@/utils/message';
import { GlobalState, UmiComponentProps, DictionaryEnum } from '@/common/type';
import { SINGLE_COLUMN_WIDTH, DOUBLE_COLUMN_WIDTH } from '@/utils/constant';

const mapStateToProps = ({ carBan, app, device, loading: { effects } }: GlobalState) => {
  return {
    carBanData: carBan.carBanData,
    accessScreenDetail: carBan.accessScreenDetail,
    buildUnit: app.dictionry[DictionaryEnum.BUILD_UNIT],
    deviceStatus: app.dictionry[DictionaryEnum.DEVICE_STATUS],
    gateDirection: app.dictionry[DictionaryEnum.GATE_DIRECTION],
    operateType: app.dictionry[DictionaryEnum.OPERATE_TYPE],
    openCarBanWay: app.dictionry[DictionaryEnum.OPEN_CARBAN_WAY],
    deviceSpec: device.deviceSpec,
    deviceInfo: device.deviceInfo,
    accessScreenDeviceList: carBan.accessScreenDeviceList,
    getDeviceCarLoading: effects['carBan/getDeviceCar'],
    addDeviceCarLoading: effects['carBan/addDeviceCar'],
    getDeviceInfoLoading: effects['device/getDeviceInfo'],
    updateDeviceLoading: effects['device/updateDevice'],
    deleteDeviceLoading: effects['device/deleteDevice'],
  };
};
type onSelectChange = (
  value: any,
  option: React.ReactElement<any> | React.ReactElement<any>[],
) => void;
type CarBanStateProps = ReturnType<typeof mapStateToProps>;
type CarBanProps = CarBanStateProps & UmiComponentProps & FormComponentProps;

interface CarBanState {
  add: boolean;
  modify: boolean;
  fileList: UploadFile[];
  showDeleteConfirm: boolean;
  selectedRowKeys: number[];
  searchFields: { [propName: string]: any };
  deviceBrand: string;
  bigType: string;
  carBan: any;
  carBanDetail: boolean;
  deviceName: string;
  relationModalVisible: boolean;
  carBanId: number;
}

@connect(
  mapStateToProps,
  null,
)
class CarBan extends PureComponent<CarBanProps, CarBanState> {
  searchForm: WrappedFormUtils;
  modelForm: WrappedFormUtils;
  relationForm: WrappedFormUtils;
  confirmRef: RefObject<Confirm>;

  operatingResultRef: RefObject<OperatingResults>;

  constructor(props: Readonly<CarBanProps>) {
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
      carBanId: 0,
      bigType: '',
      deviceName: '',
      carBan: {},
      carBanDetail: false,
      relationModalVisible: false,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    this.getCarBanData({ page: 0 });
    dispatch({ type: 'device/getDeviceSpec', payload: { type: 3 } });
    dispatch({
      type: 'app/getDic',
      payload: {
        type: [
          DictionaryEnum.BUILD_UNIT,
          DictionaryEnum.OPERATE_TYPE,
          DictionaryEnum.DEVICE_STATUS,
          DictionaryEnum.GATE_DIRECTION,
          DictionaryEnum.OPEN_CARBAN_WAY,
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
    const { addDeviceCarLoading, deleteDeviceLoading } = this.props;
    const ButtonGroupProps = {
      actions: [
        {
          customtype: 'master',
          title: '新增',
          onClick: this.addCarBan,
          loading: addDeviceCarLoading,
        },
        {
          customtype: 'warning',
          disabled: !this.state.selectedRowKeys.length,
          title: '删除',
          onClick: this.batchDeleteCarBan,
          loading: deleteDeviceLoading,
        },
      ],
    };
    return <ButtonGroup {...ButtonGroupProps} />;
  }

  // eslint-disable-next-line max-lines-per-function
  renderTable() {
    const { carBanData, getDeviceCarLoading } = this.props;
    const { selectedRowKeys } = this.state;

    if (isEmpty(carBanData) || !carBanData) {
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
          carBanData ? (
            <Fragment>
              <Button
                customtype={'icon'}
                onClick={e => this.openModelDetail(record.id, e)}
                icon={'pm-details'}
                title={'详情'}
              />
              <Button
                customtype={'icon'}
                onClick={e => this.updateCarBan(record.id, e)}
                icon={'pm-edit'}
                title={'修改'}
              />
              <Button
                customtype={'icon'}
                onClick={e => this.deleteCarBan(record.id, e)}
                title={'删除'}
                icon={'pm-trash-can'}
              />
              <Button
                customtype={'icon'}
                onClick={e => this.relationDevice(record.id, record.name, record.parentId, e)}
                title={'关联设备'}
                icon={'pm-equipment'}
              />
            </Fragment>
          ) : null,
      },
    ];

    const pagination: PaginationConfig = {
      position: 'bottom',
      total: carBanData.totalElements,
      current: carBanData.pageable.pageNumber + 1,
      pageSize: carBanData.pageable.pageSize,
      defaultCurrent: 1,
      // onChange: this.onChangePage,
    };

    return (
      <div className={classNames('flexAuto')}>
        <Table
          columns={columns}
          dataSource={carBanData.content}
          scroll={{ y: '100%' }}
          pagination={pagination}
          loading={getDeviceCarLoading}
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
    const {
      buildUnit,
      operateType,
      gateDirection,
      openCarBanWay,
      deviceSpec = [],
      addDeviceCarLoading,
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
          field: 'type',
          initialValue: deviceInfo.type,
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
          type: 'radio',
          field: 'openType',
          initialValue: deviceInfo.openType,
          children: openCarBanWay,
          placeholder: '开闸方式',
          rules: [{ required: true, message: '请输入设备开闸方式!' }],
          span: 8,
        },
        {
          type: 'radio',
          field: 'transitGateType',
          initialValue: deviceInfo.transitGateType,
          children: gateDirection,
          placeholder: '进出方向',
          rules: [{ required: true, message: '请输入设备进出方向!' }],
          span: 8,
        },
        {
          type: 'input',
          maxLength: 20,
          field: 'longitude',
          initialValue: deviceInfo.longitude ? deviceInfo.longitude.toString() : '',
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
          initialValue: deviceInfo.latitude ? deviceInfo.latitude.toString() : '',
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
          initialValue: deviceInfo.brand,
          span: 8,
          children: deviceBrandMap,
          disabled: modify,
          field: 'brand',
          placeholder: '设备品牌',
          rules: [{ required: true, message: '请选择品牌!' }],
          onChange: this.onBrandOnChange,
        },
        {
          type: 'select',
          initialValue: deviceInfo.spec,
          span: 8,
          disabled: modify,
          children: deviceSpecMap,
          field: 'spec',
          placeholder: '设备型号',
          rules: [{ required: true, message: '请选择型号!' }],
        },
        {
          type: 'input',
          initialValue: deviceInfo.ip,
          span: 8,
          maxLength: 20,
          disabled: modify,
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
          initialValue: deviceInfo.port,
          span: 8,
          disabled: modify,
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
          initialValue: deviceInfo.deviceUsername,
          span: 8,
          maxLength: 20,
          field: 'deviceUsername',
          disabled: modify,
          placeholder: '用户名',
          rules: [{ required: true, message: '请输入用户名!' }],
        },
        {
          type: 'input',
          initialValue: deviceInfo.devicePassword,
          span: 8,
          maxLength: 20,
          field: 'devicePassword',
          disabled: modify,
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
          field: 'buildUnitPhone',
          maxLength: 20,
          placeholder: '联系电话',
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
          showTime: false,
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
          placeholder: '联系电话',
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
          loading: addDeviceCarLoading || updateDeviceLoading,
        },
        { customtype: 'second', title: '取消', onClick: this.onCancelModel },
      ],
      onSubmit: this.onModelSubmit,
      title: modify ? '修改车辆道闸信息' : '新增车辆道闸信息',
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
    const { carBanDetail } = this.state;
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
      visible: carBanDetail,
      onCancel: this.onCancelModel,
      title: '道闸设备详情',
    };

    return <ModalDetail {...props} />;
  }

  renderRelationModal() {
    return (
      <Modal {...this.getRelationModalProps()}>
        <FormSimple {...this.getRelationFormProps()} />
      </Modal>
    );
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
        {this.renderRelationModal()}
      </div>
    );
  }

  getRelationModalProps = () => {
    return {
      onCancel: this.onCancelModel,
      visible: this.state.relationModalVisible,
      title: '关联设备',
      destroyOnClose: true,
      centered: true,
      footer: null,
      maskClosable: false,
      bodyStyle: {},
      width: '40%',
      wrapClassName: 'modal',
    };
  };

  getRelationFormProps = () => {
    const { accessScreenDeviceList = [], accessScreenDetail = {} } = this.props;
    let items: any = [
      {
        type: 'label',
        span: 24,
        value: this.state.deviceName,
        placeholder: '道闸名称',
      },
    ];
    if (isEmpty(accessScreenDetail)) {
      const accessScreenSelectData = accessScreenDeviceList.map((item: any) => {
        return { key: item.id, value: item.name };
      });
      items = items.concat([
        {
          type: 'select',
          field: 'parentId',
          span: 12,
          children: accessScreenSelectData,
          placeholder: '关联出入屏设备',
          rules: [{ required: true, message: '出入屏设备不能为空！' }],
        },
        {
          type: 'button',
          customtype: 'select',
          span: 4,
          title: '添加',
          onClick: this.bindLEDDevice,
        },
      ]);
    } else {
      items = items.concat([
        {
          type: 'label',
          span: 6,
          value: accessScreenDetail.name,
          placeholder: '已绑设备',
        },
        {
          type: 'button',
          customtype: 'warning',
          span: 4,
          title: '解绑',
          onClick: this.unbindLEDDevice,
        },
      ]);
    }

    return {
      items: items,
      onGetFormRef: (modelForm: WrappedFormUtils) => {
        this.relationForm = modelForm;
      },
    };
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
      this.getCarBanData(fieldsValue);
    });
  };

  getCarBanData = Fileds => {
    const { dispatch } = this.props;
    this.setState({ selectedRowKeys: [] });
    dispatch({ type: 'carBan/getDeviceCar', payload: { ...Fileds } });
  };

  getCarBanInfo = (id: number) => {
    const { dispatch } = this.props;
    dispatch({ type: 'device/getDeviceInfo', payload: { id } }).then(res => {
      if (res) {
        this.setState({ deviceBrand: res.data.brand, bigType: res.data.bigType });
      }
    });
  };

  onTableChange = (pagination, filters, sorter, extra) => {
    const searchFields = { ...this.state.searchFields };
    searchFields.page = --pagination.current;
    searchFields.size = pagination.pageSize;
    this.getCarBanData(searchFields);
  };

  addCarBan = () => {
    this.setState({
      add: true,
    });
  };

  searchFormReset = () => {
    this.searchForm.resetFields();
    this.setState({
      searchFields: {},
    });
    this.getCarBanData({ page: 0 });
    this.setState({ searchFields: {} });
  };

  onTableSelectRow = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys });
  };

  updateCarBan = (id: number, e) => {
    e.stopPropagation();
    this.setState({
      modify: true,
    });
    this.getCarBanInfo(id);
  };

  onCancelModel = () => {
    this.setState({
      add: false,
      modify: false,
      relationModalVisible: false,
      carBanDetail: false,
      carBan: {},
    });
  };

  batchDeleteCarBan = () => {
    if (this.confirmRef.current) {
      this.confirmRef.current.open(
        () => this.onDeleteCarBan(this.state.selectedRowKeys),
        '删除',
        '是否确认删除选中的条目？',
      );
    }
  };

  deleteCarBan = (id: number, e) => {
    e.stopPropagation();
    if (this.confirmRef.current) {
      this.confirmRef.current.open(() => this.onDeleteCarBan([id]), '删除', '是否确认删除？');
    }
  };

  relationDevice = (id: number, name: string, parentId: string, e) => {
    e.stopPropagation();
    this.props.dispatch({ type: 'carBan/getAccessScreenDeviceList', payload: {} });
    if (parentId) {
      this.props.dispatch({ type: 'carBan/getAccessScreenById', payload: { id: parentId } });
    } else {
      this.props.dispatch({
        type: 'carBan/updateState',
        payload: { accessScreenDetail: {} },
      });
    }
    this.setState({
      carBanId: id,
      relationModalVisible: true,
      deviceName: name,
    });
  };

  onDeleteCarBan = payload => {
    const { dispatch } = this.props;
    dispatch({ type: 'device/deleteDevice', payload }).then(data => {
      if (data && data.error > 0) {
        if (this.operatingResultRef.current) {
          this.operatingResultRef.current.open(data);
        }
      } else {
        this.getCarBanData({ page: 0 });
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

  onAddCarBan = fieldsValue => {
    const { dispatch } = this.props;
    dispatch({
      type: 'carBan/addDeviceCar',
      payload: fieldsValue,
    }).then(res => {
      console.log('res: ', res);
      if (res && res.success) {
        this.onCancelModel();
        this.getCarBanData({ page: 0 });
      }
    });
  };

  onUpdateCarBan = fieldsValue => {
    const { dispatch } = this.props;
    dispatch({
      type: 'device/updateDevice',
      payload: fieldsValue,
    }).then(data => {
      if (data && data.error && this.operatingResultRef.current) {
        this.operatingResultRef.current.open(data);
      } else {
        this.onCancelModel();
        this.getCarBanData({ page: 0 });
      }
    });
  };

  onRelationFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    this.relationForm.validateFields((err, fieldsValue) => {
      if (!err) {
      }
    });
  };

  unbindLEDDevice = () => {
    const { accessScreenDetail = {}, dispatch } = this.props;
    if (this.confirmRef.current) {
      this.confirmRef.current.open(
        async () => {
          const res = await dispatch({
            type: 'carBan/unbindingLED',
            payload: { parentId: accessScreenDetail.id, id: this.state.carBanId },
          });
          if (res && res.success) {
            Message.success(SUCCESS_UNBINDING);
            this.reGetCarBanData();
            this.onCancelModel();
            dispatch({
              type: 'carBan/updateState',
              payload: { accessScreenDetail: {} },
            });
          }
        },
        '解绑',
        '是否确认解绑？',
      );
    }
  };

  bindLEDDevice = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    this.relationForm.validateFields(async (err, fieldsValue) => {
      if (!err) {
        fieldsValue.id = this.state.carBanId;
        const res = await this.props.dispatch({
          type: 'carBan/bindingLED',
          payload: fieldsValue,
        });
        if (res && res.success) {
          Message.success(SUCCESS_BINDING);
          this.reGetCarBanData();
          this.onCancelModel();
        }
      }
    });
  };

  reGetCarBanData = () => {
    const { carBanData = {} } = this.props;
    const searchFields = { ...this.state.searchFields };
    searchFields.page = carBanData.number;
    searchFields.size = carBanData.size;
    this.getCarBanData(searchFields);
  };

  onModelSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { add, modify } = this.state;
    this.modelForm.validateFields((err, fieldsValue) => {
      if (!err) {
        fieldsValue.name = fieldsValue.address + '车辆道闸';
        fieldsValue.buildDate = moment(fieldsValue.buildDate).format('YYYY-MM-DD HH:mm:ss');
        if (add) {
          this.onAddCarBan(fieldsValue);
        } else if (modify) {
          this.onUpdateCarBan(fieldsValue);
        }
      }
    });
  };

  onRowCilck = (record: any, index: number, event: Event) => {
    this.openModelDetail(record.id, event);
  };

  openModelDetail = (id, e) => {
    e.stopPropagation();
    this.getCarBanInfo(id);
    this.setState({ carBanDetail: true });
  };
}

export default CarBan;
