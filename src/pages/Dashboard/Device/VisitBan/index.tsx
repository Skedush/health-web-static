import React, { PureComponent, Fragment, RefObject, createRef } from 'react';
import { connect } from '@/utils/decorators';
import classNames from 'classnames';
import {
  Table,
  SearchForm,
  ButtonGroup,
  Button,
  CommonComponent,
  ModalForm,
  Confirm,
  Message,
  ModalDetail,
  OperatingResults,
  Badge,
} from '@/components/Library';
import {
  FormComponentProps,
  PaginationConfig,
  WrappedFormUtils,
  ColumnProps,
  UploadFile,
} from '@/components/Library/type';
import { GlobalState, UmiComponentProps, DictionaryEnum } from '@/common/type';
import { VisitDeviceBaseInfo } from './model';
import moment from 'moment';
import { isLongitude, isLatitude, isPhone, isPort, isIP } from '@/utils/validater';
import { ERROR_SELECT_DEVICE } from '@/utils/message';
import { SINGLE_COLUMN_WIDTH, DOUBLE_COLUMN_WIDTH } from '@/utils/constant';

const mapStateToProps = (state: GlobalState) => {
  return {
    state,
    saveLoading:
      state.loading.effects['visit/addVisitDevice'] ||
      state.loading.effects['visit/editVisitDevice'],
    loading: state.loading.effects['visit/getDeviceList'],
    submitLoading:
      state.loading.effects['visit/addVisitDevice'] ||
      state.loading.effects['visit/editVisitDevice'],
    deviceStatus: state.app.dictionry[DictionaryEnum.DEVICE_STATUS] || [],
    constrcutionTypes: state.app.dictionry[DictionaryEnum.CONSTRUCTION_TYPE] || [],
    operatorTypes: state.app.dictionry[DictionaryEnum.OPERATE_TYPE] || [],
    visitTypes: state.app.dictionry[DictionaryEnum.VISIT_TYPE] || [],
    deviceSpec: state.device.deviceSpec,
  };
};
type onSelectChange = (
  value: any,
  option: React.ReactElement<any> | React.ReactElement<any>[],
) => void;
type VisitStateProps = ReturnType<typeof mapStateToProps>;
type VisitProps = VisitStateProps & UmiComponentProps & FormComponentProps;

interface VisitState {
  add: boolean;
  modify: boolean;
  modifyData: VisitDeviceBaseInfo;
  fileList: UploadFile[];
  dataSource: any[];
  pageOption: PaginationConfig;
  detailVisible: boolean;
  deviceBrand: string;
  operatingResultsVisible: boolean;
  batchHandleResultsData: {};
  selectedRow: any[];
}

@connect(
  mapStateToProps,
  null,
)
class Visit extends PureComponent<VisitProps, VisitState> {
  searchForm: WrappedFormUtils;

  modelForm: WrappedFormUtils;

  confirmRef: RefObject<Confirm>;

  selectedData: any[] = [];

  queryCondition = {};

  editId: string = '';

  editBigType: string = '';

  constructor(props: Readonly<VisitProps>) {
    super(props);
    this.confirmRef = createRef();
    this.state = {
      selectedRow: [],
      fileList: [],
      dataSource: [],
      add: false,
      detailVisible: false,
      modifyData: {} as VisitDeviceBaseInfo,
      operatingResultsVisible: false,
      batchHandleResultsData: {},
      deviceBrand: '',
      modify: false,
      pageOption: {
        current: 1,
        total: 0,
        pageSize: 10,
      },
    };
  }

  async componentDidMount() {
    await Promise.all([
      this.props.dispatch({ type: 'app/getDic', payload: { type: DictionaryEnum.DEVICE_STATUS } }),
      this.props.dispatch({ type: 'app/getDic', payload: { type: DictionaryEnum.VISIT_TYPE } }),
      this.props.dispatch({
        type: 'app/getDic',
        payload: { type: DictionaryEnum.CONSTRUCTION_TYPE },
      }),
      this.props.dispatch({ type: 'app/getDic', payload: { type: DictionaryEnum.OPERATE_TYPE } }),
      this.props.dispatch({ type: 'device/getDeviceSpec', payload: { type: 4 } }),
    ]);
    this.getList();
  }

  renderSearchForm() {
    const { deviceStatus, constrcutionTypes, operatorTypes, visitTypes } = this.props;
    const SearchFormProps = {
      items: [
        { type: 'select', children: visitTypes, field: 'type', placeholder: '设备类型' },
        { type: 'input', field: 'name', placeholder: '设备名称' },
        {
          type: 'select',
          field: 'buildUnit',
          children: constrcutionTypes,
          placeholder: '建设单位',
        },
        { type: 'select', field: 'operator', children: operatorTypes, placeholder: '运营单位' },
        { type: 'select', children: deviceStatus, field: 'status', placeholder: '设备状态' },
      ],
      actions: [
        { customtype: 'select', title: '查询', htmlType: 'submit' as 'submit' },
        { customtype: 'reset', title: '重置', onClick: this.onReset },
      ],
      columnNumOfRow: 4,
      onSubmit: this.onSearchSubmit,
      onGetFormRef: this.onGetFormRef,
    };
    return <SearchForm {...SearchFormProps} />;
  }

  renderButtonGroup() {
    const ButtonGroupProps = {
      actions: [
        { customtype: 'master', title: '新增', onClick: this.addDevice },
        { customtype: 'warning', title: '删除', onClick: () => this.delete() },
      ],
    };
    return <ButtonGroup {...ButtonGroupProps} />;
  }

  // eslint-disable-next-line max-lines-per-function
  renderTable() {
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
        // render: (text: any, record: object) => this.handleDeviceStatus(text),
        render: (text: any, record: any) => {
          return this.handleDeviceStatus(text, record);
        },
      },
      {
        title: '操作',
        // width: DOUBLE_COLUMN_WIDTH,
        key: 'action',
        render: (_text: any, record: VisitDeviceBaseInfo) =>
          this.props.state ? (
            <Fragment>
              <Button
                customtype={'icon'}
                onClick={() => this.checkDevice(record)}
                icon={'pm-details'}
                title={'详情'}
              />
              <Button
                customtype={'icon'}
                onClick={() => this.modify(record)}
                icon={'pm-edit'}
                title={'修改'}
              />
              <Button
                customtype={'icon'}
                onClick={() => this.delete(record)}
                title={'删除'}
                icon={'pm-trash-can'}
              />
            </Fragment>
          ) : null,
      },
    ];
    const { pageOption, dataSource, selectedRow } = this.state;
    const { loading } = this.props;
    const pagination: PaginationConfig = {
      position: 'bottom',
      total: pageOption.total,
      pageSize: pageOption.pageSize,
      defaultCurrent: pageOption.current,
      current: pageOption.current,
      // onChange: this.onChangePage,
    };
    return (
      <div className={classNames('flexAuto')}>
        <Table
          onSelectRow={this.selectedChange}
          columns={columns}
          dataSource={dataSource}
          scroll={{ y: '100%' }}
          pagination={pagination}
          onChange={this.tableChange}
          selectedRow={selectedRow}
          loading={loading}
        />
      </div>
    );
  }

  // eslint-disable-next-line max-lines-per-function
  renderModalForm(data?: VisitDeviceBaseInfo) {
    const { deviceBrand, modify } = this.state;
    const {
      constrcutionTypes,
      operatorTypes,
      visitTypes,
      deviceSpec = [],
      submitLoading,
    } = this.props;
    const deviceBrandMap: any[] = [];
    const deviceSpecMap: any[] = [];
    for (const key in deviceSpec) {
      if (deviceSpec.hasOwnProperty(key)) {
        deviceBrandMap.push({ key: key, value: key });
      }
    }
    if (deviceBrand !== '') {
      deviceSpec[deviceBrand].forEach(item => {
        deviceSpecMap.push({ key: item, value: item });
      });
    }
    const props = {
      items: [
        {
          type: 'input',
          field: 'longitude',
          initialValue: data ? data.longitude : '',
          placeholder: '设备经度',
          span: 8,
          maxLength: 20,
          rules: [
            { required: true, message: '请输入经度！' },
            {
              validator: isLongitude,
            },
          ],
        },
        {
          type: 'input',
          field: 'latitude',
          initialValue: data ? data.latitude : '',
          maxLenth: 20,
          placeholder: '设备纬度',
          span: 8,
          rules: [
            { required: true, message: '请输入纬度！' },
            {
              validator: isLatitude,
            },
          ],
        },
        {
          type: 'input',
          field: 'address',
          span: 8,
          initialValue: data ? data.address : '',
          placeholder: '设备地址',
          rules: [{ required: true, message: '请输入设备地址' }],
        },
        {
          type: 'select',
          field: 'type',
          initialValue: data ? data.type : '',
          placeholder: '访客机类型',
          disabled: modify,
          onChange: this.onDeviceChange,
          children: visitTypes,
          span: 8,
          rules: [{ required: true, message: '请选择访客机类型' }],
        },
        {
          type: 'select',
          field: 'brand',
          span: 8,
          initialValue: data ? data.brand : '',
          disabled: modify,
          children: deviceBrandMap,
          placeholder: '设备品牌',
          rules: [{ required: true, message: '请选择设备品牌！' }],
          onChange: this.onBrandOnChange,
        },
        {
          type: 'select',
          field: 'spec',
          span: 8,
          disabled: modify,
          initialValue: data ? data.spec : '',
          children: deviceSpecMap,
          placeholder: '设备型号',
          rules: [{ required: true, message: '请选择设备型号！' }],
        },

        {
          type: 'input',
          field: 'ip',
          span: 8,
          disabled: modify,
          initialValue: data ? data.ip : '',
          placeholder: '设备IP',
          rules: [
            { required: true, message: '请输入ip!' },
            {
              validator: isIP,
            },
          ],
        },
        {
          type: 'input',
          field: 'port',
          disabled: modify,
          span: 8,
          initialValue: data ? data.port : '',
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
          field: 'deviceUsername',
          disabled: modify,
          span: 8,
          initialValue: data ? data.deviceUsername : '',
          placeholder: '用户名',
          rules: [{ required: true, message: '请输入用户名!' }],
        },
        {
          type: 'input',
          disabled: modify,
          field: 'devicePassword',
          span: 8,
          initialValue: data ? data.devicePassword : '',
          placeholder: '密码',
          rules: [{ required: true, message: '请输入密码!' }],
        },
        {
          type: 'select',
          field: 'buildUnit',
          span: 8,
          children: constrcutionTypes,
          rules: [{ required: true, message: '请选择建设单位!' }],
          initialValue: data ? data.buildUnit : '',
          placeholder: '建设单位',
          onChange: this.onSelectChange,
        },
        {
          type: 'input',
          field: 'buildUnitPhone',
          span: 8,
          initialValue: data ? data.buildUnitPhone : '',
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
          initialValue: data && data.buildDate ? moment(data.buildDate) : undefined,
          span: 8,
          showTime: true,
          field: 'buildDate',
          placeholder: '建设时间',
          rules: [{ required: true, message: '请选择建设时间!' }],
        },
        {
          type: 'select',
          field: 'operator',
          span: 8,
          children: operatorTypes,
          rules: [{ required: true, message: '请选择运营单位!' }],
          initialValue: data ? data.operator : '',
          placeholder: '运营单位',
          onChange: this.onSelectChange,
        },
        {
          type: 'input',
          field: 'operatorPhone',
          span: 8,
          initialValue: data ? data.operatorPhone : '',
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
          loading: submitLoading,
          htmlType: 'submit' as 'submit',
        },
        { customtype: 'second', title: '返回', onClick: this.onCancelModel },
      ],
      onSubmit: this.onModelSubmit,
      title: this.state.modify ? '编辑访客机' : '新增访客机',
      onCancel: this.onCancelModel,
      destroyOnClose: true,
      width: '50%',
      bodyStyle: {},
      add: this.state.add,
      modify: this.state.modify,
      onGetFormRef: (modelForm: WrappedFormUtils) => {
        this.modelForm = modelForm;
      },
    };
    return <ModalForm {...props} />;
  }

  renderDetailModal(baseInfo) {
    const { detailVisible } = this.state;
    const props = {
      items: [
        {
          name: '设备经度',
          value: baseInfo.longitude,
        },
        {
          name: '设备纬度',
          value: baseInfo.latitude,
        },
        {
          name: '设备类型',
          value: baseInfo.typeStr,
        },
        {
          name: '设备名称',
          value: baseInfo.name,
        },
        {
          name: '设备品牌',
          value: baseInfo.brand,
        },
        {
          name: '设备型号',
          value: baseInfo.spec,
        },
        {
          name: '设备地址',
          value: baseInfo.address,
        },
        {
          name: '设备ip',
          value: baseInfo.ip,
        },
        {
          name: '设备端口',
          value: baseInfo.port,
        },
        {
          name: '设备端口',
          value: baseInfo.port,
        },
        {
          name: '设备用户名',
          value: baseInfo.deviceUsername,
        },
        {
          name: '建设单位',
          value: baseInfo.buildUnitStr,
        },
        {
          name: '建设单位电话',
          value: baseInfo.buildUnitPhone,
        },
        {
          name: '运营单位',
          value: baseInfo.operatorStr,
        },
        {
          name: '运营单位电话',
          value: baseInfo.operatorPhone,
        },
        {
          name: '建设时间',
          value: baseInfo.buildDate,
        },
        {
          name: '设备状态',
          value: baseInfo.statusStr,
        },
      ],
      info: baseInfo || {},
      visible: detailVisible,
      onCancel: this.onCancelDetailModel,
      title: '访客机详情',
    };

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

  render() {
    const { modifyData } = this.state;
    return (
      <div className={classNames('height100', 'flexColStart')}>
        <Confirm type={'warning'} ref={this.confirmRef} />
        <div className={'listTitle'}>信息筛选</div>
        {this.renderSearchForm()}
        <div className={'listTitle'}>信息展示</div>
        {this.renderButtonGroup()}
        {this.renderTable()}
        {this.renderModalForm(modifyData)}
        {this.renderDetailModal(modifyData)}
        {this.renderOperatingResults()}
      </div>
    );
  }

  onBrandOnChange: onSelectChange = (value, option) => {
    this.setState({ deviceBrand: value });
  };

  onDeviceChange: onSelectChange = (value, option) => {
    console.log('value: ', value);
  };

  getList() {
    this.onChangePage(1, this.state.pageOption.pageSize);
  }

  tableChange = (pagination: PaginationConfig) => {
    this.onChangePage(pagination.current || 1, pagination.pageSize || 10);
  };

  onChangePage = async (page: number, pageSize: number = 10) => {
    const { dispatch } = this.props;
    const { pageOption } = this.state;
    const data = await dispatch({
      type: 'visit/getDeviceList',
      pageOption: { page: page - 1, size: pageSize, ...this.queryCondition },
    });
    if (!data) {
      return;
    }
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

  onSearch = () => {};

  addDevice = () => {
    this.setState({
      modifyData: {} as VisitDeviceBaseInfo,
      add: true,
    });
  };

  onCancelDetailModel = () => {
    this.setState({ detailVisible: false });
  };

  onReset = () => {
    this.searchForm.resetFields();
    this.onSearchSubmit();
  };

  checkDevice = async (record: any) => {
    const device = await this.props.dispatch({ type: 'visit/getDevice', id: record.id });
    this.setState({
      modifyData: device,
      detailVisible: true,
    });
  };

  modify = async (record: any) => {
    this.editId = record.id;
    const device = await this.props.dispatch({ type: 'visit/getDevice', id: record.id });
    this.editBigType = device.bigType;
    this.setState({
      modifyData: device,
      modify: true,
    });
  };

  onCancelModel = () => {
    this.setState({
      add: false,
      modify: false,
    });
  };

  selectedChange = (keys, data) => {
    this.selectedData = data;
    this.setState({ selectedRow: keys });
  };

  delete = (record?) => {
    let ids: any[] = [];
    if (!record && !this.selectedData.length) {
      Message.warning(ERROR_SELECT_DEVICE);
      return;
    } else if (record) {
      ids = [record.id];
    } else {
      ids = this.selectedData.map(item => item.id);
    }
    if (this.confirmRef.current) {
      this.confirmRef.current.open(
        async () => {
          const data = await this.props.dispatch({
            type: 'visit/deleteVisitDevice',
            deleteList: ids,
          });
          if (data && data.error && ids.length > 1) {
            this.setState({
              operatingResultsVisible: true,
              batchHandleResultsData: data,
            });
          } else if (data && data.error) {
            Message.error(data.message);
          }
          this.selectedData = [];
          this.setState({
            selectedRow: [],
          });
          this.getList();
        },
        '删除访客机',
        '确定要删除访客机吗？',
      );
    }
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

  onSearchSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) {
      e.preventDefault();
    }
    this.searchForm.validateFields((err, fieldsValue) => {
      if (err) return;
      console.log('fieldsValue: ', fieldsValue);
      fieldsValue.page = 0;
      for (const item in fieldsValue) {
        if (fieldsValue.hasOwnProperty(item)) {
          fieldsValue[item] = fieldsValue[item] === -1 ? undefined : fieldsValue[item];
        }
      }
      this.queryCondition = fieldsValue;
      this.getList();
      // this.setSearchInfo(fieldsValue);
    });
  };

  handleDeviceStatus = (text: any, record: any) => {
    const { status } = record;
    let badge = 'success';
    if (status === '2') {
      badge = 'default';
    } else if (status === '3') {
      badge = 'error';
    }
    return (
      <div style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}>
        <Badge status={badge as 'success' | 'error' | 'default'} />
        {text}
      </div>
    );
  };

  onSelectChange = (value, option) => {
    console.log('value, option: ', value, option);
  };

  onModelSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { dispatch, visitTypes } = this.props;
    this.modelForm.validateFields(async (err, fieldValues) => {
      const { add, modify } = this.state;
      if (!err) {
        const deviceItem = visitTypes.find(item => item.key === fieldValues.type);
        fieldValues.name = fieldValues.address + deviceItem.value;
        fieldValues.buildDate = fieldValues.buildDate.format('YYYY-MM-DD HH:mm:ss');
        if (add) {
          await dispatch({ type: 'visit/addVisitDevice', data: fieldValues });
        } else if (modify) {
          fieldValues.id = this.editId;
          fieldValues.bigType = this.editBigType;
          const { success } = await dispatch({ type: 'visit/editVisitDevice', data: fieldValues });
          if (!success) {
            return;
          }
        }
        this.getList();
        this.setState({ add: false, modify: false });
      }
    });
  };
}

export default Visit;
