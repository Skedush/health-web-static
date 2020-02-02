import React, { PureComponent, Fragment, RefObject, createRef } from 'react';
import moment from 'moment';
import { connect } from '@/utils/decorators';
import { ERROR_SELECT_CAR, SUCCESS_IMPORT, SUCCESS_WRITTEN_OFF } from '@/utils/message';
import classNames from 'classnames';
import { onOverFlowHiddenCell } from '@/utils';
import {
  Table,
  SearchForm,
  ButtonGroup,
  Button,
  CommonComponent,
  ModalForm,
  Confirm,
  Message,
  Input,
  // Upload,
  ModalDetail,
  Modal,
  // FormSimple,
  Select,
  Form,
  Col,
  OperatingResults,
  // Spin,
} from '@/components/Library';
import {
  FormComponentProps,
  PaginationConfig,
  WrappedFormUtils,
  ColumnProps,
} from '@/components/Library/type';
import AddCarModal from './components/AddCarModal';
import { GlobalState, UmiComponentProps, DictionaryEnum } from '@/common/type';
import { CarBaseInfo } from './model';
import { isPhone, carNumber } from '@/utils/validater';
import styles from './index.less';
import { SINGLE_COLUMN_WIDTH, DOUBLE_COLUMN_WIDTH } from '@/utils/constant';
import AuthTimeFormInstance, { AuthTimeForm } from '../Person/components/PersonFormAuthTimeForm';

const FormItem = Form.Item;

const mapStateToProps = (state: GlobalState) => {
  return {
    state,
    carTypes: state.app.dictionry[DictionaryEnum.CAR_TYPE] || [],
    carBanAuthSettingData: state.carGlobal.carBanAuthSettingData || {},
    dataSource: state.car.dataList,
    pageOption: state.car.pageOption,
    loading: {
      authCarUpdate: state.loading.effects['carGlobal/updateAuthCar'],
      getListLoading: state.loading.effects['car/getList'],
      editCarLoading: state.loading.effects['car/editCar'],
      deleteCarLoading: state.loading.effects['car/deleteCar'],
    },
    carProvince: state.carGlobal.carProvince,
    carArea: state.carGlobal.carArea,
    defaultAuthTime: state.carGlobal.defaultAuthTime,
  };
};

type onSelectChange = (
  value: any,
  option: React.ReactElement<any> | React.ReactElement<any>[],
) => void;
type CarStateProps = ReturnType<typeof mapStateToProps>;
type CarProps = CarStateProps & UmiComponentProps & FormComponentProps;

interface CarState {
  add: boolean;
  modifyData: CarBaseInfo;
  modify: boolean;
  reAuthCarModalVisible: boolean;
  carId: string;
  dataList: any[];
  pageOption: PaginationConfig;
  writtenOffDetail: boolean;
  carType: string;
  stepCurrent: number;
  carPlate: any;
  selectedRow: any[];
  operatingResultsVisible: boolean;
  owner: any;
  batchHandleResultsData: {};
}

@connect(
  mapStateToProps,
  null,
)
class Car extends PureComponent<CarProps, CarState> {
  searchForm: WrappedFormUtils;
  carInfoForm: WrappedFormUtils;
  modelForm: WrappedFormUtils;
  carTypeForm: WrappedFormUtils;
  carAuthForm: WrappedFormUtils;
  carFromAuthRef: AuthTimeForm;

  confirmRef: RefObject<Confirm>;

  queryCondition = {
    owner: undefined,
    type: undefined,
    licensePlate: undefined,
  };

  selectedData: any[] = [];

  modifyId: string;

  constructor(props: Readonly<CarProps>) {
    super(props);
    this.confirmRef = createRef();
    this.state = {
      dataList: [],
      carId: '',
      selectedRow: [],
      modifyData: {} as CarBaseInfo,
      owner: { name: null, phone: null, id: null },
      add: false,
      carPlate: { province: '', area: '', carNumber: '' },
      carType: '',
      stepCurrent: 1,
      modify: false,
      reAuthCarModalVisible: false,
      writtenOffDetail: false,
      operatingResultsVisible: false,
      batchHandleResultsData: {},
      pageOption: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
    };
  }

  async componentDidMount() {
    await this.props.dispatch({ type: 'app/getDic', payload: { type: DictionaryEnum.CAR_TYPE } });
    await this.props.dispatch({ type: 'carGlobal/getCarProvince', payload: {} });
    this.getList();
  }

  renderSearchForm() {
    const { carTypes } = this.props;
    const SearchFormProps = {
      items: [
        { type: 'input', field: 'ownerName', placeholder: '关联人员' },
        { type: 'input', field: 'licensePlate', placeholder: '车牌号' },
        { type: 'select', children: carTypes, field: 'type', placeholder: '车辆类型' },
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
        { customtype: 'master', title: '新增', onClick: this.addCar },
        // { customtype: 'warning', title: '删除', onClick: () => this.deleteCar() },
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

  // eslint-disable-next-line max-lines-per-function
  renderTable() {
    const { dataList, selectedRow } = this.state;
    const { loading } = this.props;
    const columns: ColumnProps<any>[] = [
      {
        title: '车牌号',
        dataIndex: 'licensePlate',
        key: 'licensePlate',
        width: SINGLE_COLUMN_WIDTH,
        render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '车辆类型',
        width: SINGLE_COLUMN_WIDTH,
        key: 'typeCN',
        dataIndex: 'typeCN',
        render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '车型',
        width: SINGLE_COLUMN_WIDTH,
        key: 'spec',
        dataIndex: 'spec',
        render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '品牌',
        width: SINGLE_COLUMN_WIDTH,
        dataIndex: 'brand',
        key: 'brand',
        render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '颜色',
        width: SINGLE_COLUMN_WIDTH,
        dataIndex: 'color',
        key: 'color',
        render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '车主姓名',
        width: SINGLE_COLUMN_WIDTH,
        key: 'ownerName',
        dataIndex: 'ownerName',
        render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '联系方式',
        width: SINGLE_COLUMN_WIDTH,
        key: 'ownerPhone',
        dataIndex: 'ownerPhone',
        render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '备注内容',
        width: SINGLE_COLUMN_WIDTH,
        key: 'remark',
        onCell: onOverFlowHiddenCell,
        dataIndex: 'remark',
        render: (text: any, record: object) =>
          CommonComponent.renderTableOverFlowHidden(text, record),
      },
      {
        title: '登记时间',
        width: DOUBLE_COLUMN_WIDTH,
        key: 'checkDate',
        dataIndex: 'checkDate',
        render: (text: any, record: object) => moment(new Date(text)).format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        title: '操作',
        width: SINGLE_COLUMN_WIDTH,
        key: 'action',
        render: (_text: any, record: CarBaseInfo) =>
          this.props.state ? (
            <Fragment>
              {/* <Button
                customtype={'icon'}
                onClick={() => this.checkCar(record)}
                icon={'pm-details'}
                title={'详情'}
              /> */}
              <Button
                customtype={'icon'}
                onClick={() => this.modifyCar(record)}
                icon={'pm-edit'}
                title={'修改'}
              />
              <Button
                customtype={'icon'}
                onClick={() => this.showWrittenOffDetailModal(record)}
                title={'注销'}
                icon={'pm-write-off'}
              />
            </Fragment>
          ) : null,
      },
    ];
    const { pageOption } = this.state;
    const pagination: PaginationConfig = {
      position: 'bottom',
      total: pageOption.total,
      pageSize: pageOption.pageSize ? +pageOption.pageSize : 10,
      defaultCurrent: pageOption.current,
      current: pageOption.current,
      // onChange: this.onChangePage,
    };
    return (
      <div className={classNames('flexAuto')}>
        <Table
          rowKey={'carId'}
          onSelectRow={this.selectedChange}
          columns={columns}
          dataSource={dataList}
          scroll={{ y: '100%' }}
          pagination={pagination}
          loading={loading.getListLoading}
          onChange={this.tableOnChange}
          selectedRow={selectedRow}
        />
      </div>
    );
  }

  // eslint-disable-next-line max-lines-per-function
  renderModifyModalForm(initialValues?: CarBaseInfo) {
    const { carTypes, loading, carProvince = [], carArea = [] } = this.props;
    const { owner, carPlate } = this.state;
    const carProvinceOption = carProvince.map((item, index) => {
      return (
        <Select.Option key={item} value={item}>
          {item}
        </Select.Option>
      );
    });

    const carAreaOption = carArea.map((item, index) => {
      return (
        <Select.Option key={item} value={item}>
          {item}
        </Select.Option>
      );
    });

    const carPlateItem = {
      type: 'custom',
      field: 'ownerName',
      render: getFieldDecorator => {
        return (
          <Fragment>
            <Col span={6}>
              <FormItem label={'省'}>
                {getFieldDecorator('province', {
                  initialValue: carPlate.province === '' ? undefined : carPlate.province,
                  rules: [{ required: true, message: '省不能为空！' }],
                })(
                  <Select
                    placeholder={'省'}
                    onChange={this.onProvinceChange as onSelectChange}
                    disabled
                  >
                    {carProvinceOption}
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label={'区'}>
                {getFieldDecorator('area', {
                  initialValue: carPlate.area === '' ? undefined : carPlate.area,
                  rules: [{ required: true, message: '市/区代码不能为空！' }],
                })(
                  <Select placeholder={'市'} disabled>
                    {carAreaOption}
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label={'车牌号'}>
                {getFieldDecorator('carNumber', {
                  initialValue: carPlate.carNumber,
                  rules: [{ required: true, message: '车牌不能为空！' }, { validater: carNumber }],
                })(<Input placeholder={'车牌'} disabled />)}
              </FormItem>
            </Col>
          </Fragment>
        );
      },
    };
    const props = {
      items: [
        {
          type: 'select',
          field: 'type',
          children: carTypes,
          initialValue: initialValues ? initialValues.type : 1,
          placeholder: '车辆类型',
          span: 8,
          disabled: true,
          rules: [{ required: true, message: '车辆类型不能为空！' }],
          onChange: this.onCarTypeChange,
        },
        {
          type: 'input',
          initialValue: owner.name,
          field: 'ownerName',
          span: 8,
          disabled: true,
          placeholder: '关联人员',
          rules: [{ required: true, message: '关联人员不能为空！' }],
        },
        {
          type: 'input',
          field: 'ownerPhone',
          span: 8,
          disabled: true,
          initialValue: owner.phone || '',
          placeholder: '联系电话',
          rules: [{ required: true, message: '联系电话不能为空！' }, { validator: isPhone }],
        },
        // {
        //   type: 'input',
        //   field: 'idCard',
        //   disabled: carType !== '4',
        //   initialValue: owner.idCard || '',
        //   placeholder: '身份证号',
        //   validateTrigger: 'onBlur',
        //   maxLength: 50,
        //   rules: [{ required: true, message: '身份证号不能为空！' }, { validator: isIdCard }],
        // },
        carPlateItem,
        {
          type: 'input',
          field: 'brand',
          initialValue: initialValues ? initialValues.brand : '',
          maxLength: 10,
          placeholder: '品牌',
        },
        {
          type: 'input',
          field: 'spec',
          maxLength: 10,
          initialValue: initialValues ? initialValues.spec : '',
          placeholder: '车型',
        },
        {
          type: 'input',
          field: 'color',
          maxLength: 10,
          initialValue: initialValues ? initialValues.color : '',
          placeholder: '颜色',
        },
        {
          type: 'textArea',
          field: 'remark',
          initialValue: initialValues ? initialValues.remark : '',
          fill: true,
          maxLength: 50,
          placeholder: '备注内容',
        },
      ],
      actions: [
        {
          customtype: 'select',
          title: '确定',
          loading: loading.editCarLoading,
          htmlType: 'submit' as 'submit',
        },
        { customtype: 'second', title: '返回', onClick: this.onCancelModel },
      ],
      onSubmit: this.onModifyModalSubmit,
      title: '编辑车辆',
      onCancel: this.onCancelModel,
      destroyOnClose: true,
      width: '60%',
      bodyStyle: {},
      add: false,
      modify: this.state.modify,
      onGetFormRef: (modelForm: WrappedFormUtils) => {
        this.modelForm = modelForm;
      },
    };
    return <ModalForm {...props} />;
  }

  renderDetailModal(baseInfo) {
    const { writtenOffDetail } = this.state;
    const { loading } = this.props;
    const props = {
      items: [
        {
          name: '关联人员',
          value: baseInfo.ownerName,
        },
        {
          name: '联系电话',
          value: baseInfo.ownerPhone,
        },
        // {
        //   name: '身份证号',
        //   value: baseInfo.idCard,
        // },
        {
          name: '车牌号',
          value: baseInfo.licensePlate,
        },
        {
          name: '品牌',
          value: baseInfo.brand,
        },
        {
          name: '车型',
          value: baseInfo.spec,
        },
        {
          name: '颜色',
          value: baseInfo.color,
        },
        {
          name: '车辆类型',
          value: baseInfo.typeCN,
        },
        {
          name: '备注',
          value: baseInfo.remark,
        },
      ],
      actions: [
        {
          customtype: 'select',
          loading: loading.deleteCarLoading,
          title: '车辆注销',
          onClick: () => this.deleteCar(this.state.modifyData),
        },
        {
          customtype: 'second',
          title: '关闭',
          loading: loading.deleteCarLoading,
          onClick: this.onCancelModel,
        },
      ],
      info: baseInfo || {},
      visible: writtenOffDetail,
      onCancel: this.onCancelModel,
      title: '车辆详情',
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

  renderReAuthCarModal() {
    const { reAuthCarModalVisible } = this.state;
    const props = {
      onCancel: this.onCancelModel,
      visible: this.state.reAuthCarModalVisible,
      title: '通行证下发',
      destroyOnClose: false,
      centered: true,
      // forceRender: true,
      footer: null,
      maskClosable: false,
      bodyStyle: {},
      width: '50%',
      wrapClassName: styles.model,
    };
    return (
      <Modal {...props}>
        {/* <Spin spinning={!!loading.authCarUpdate}>
          <FormSimple {...this.getCarAuthFormProps()} />
        </Spin> */}
        {reAuthCarModalVisible && (
          <AuthTimeFormInstance
            inTheCarForm
            permitType={'car'}
            wrappedComponentRef={ins => (this.carFromAuthRef = ins)}
            carData={{ carId: this.state.carId, type: this.state.carType } as any}
            dispatch={this.props.dispatch}
            onCancelModel={this.onCancelModel}
          />
        )}
      </Modal>
    );
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
        {this.renderModifyModalForm(modifyData)}
        {this.renderDetailModal(modifyData)}
        {this.renderOperatingResults()}
        {this.renderReAuthCarModal()}
        <AddCarModal
          getList={this.getList}
          haveReGetList={true}
          modalVisible={this.state.add}
          cancelModel={this.onCancelModel}
        />
      </div>
    );
  }

  getCarAuthFormProps = () => {
    const { defaultAuthTime } = this.props;
    return {
      items: [
        {
          type: 'select',
          field: 'type',
          initialValue: this.state.carType,
          disabled: true,
          span: 8,
          children: this.props.carTypes,
          placeholder: '车辆通行证',
          rules: [{ required: true, message: '车辆类型不能为空！' }],
        },
        {
          type: 'rangePicker',
          initialValue: defaultAuthTime
            ? [moment(defaultAuthTime.startTime), moment(defaultAuthTime.endTime)]
            : null,
          timeBegin: defaultAuthTime ? moment(defaultAuthTime.startTime) : undefined,
          fill: true,
          field: 'time',
          label: '授权时间',
          placeholder: ['开始时间', '结束时间'] as [string, string],
          rules: [{ required: true, message: '请输入授权时间!' }],
        },
      ],
      actions: [
        { customtype: 'second', title: '关闭', onClick: this.onCancelModel },
        {
          customtype: 'select',
          title: '完成',
          // loading: formButtonLoading,
          htmlType: 'submit' as 'submit',
        },
      ],
      onSubmit: this.onCarAuthFormSubmit,
      onGetFormRef: (modelForm: WrappedFormUtils) => {
        this.carAuthForm = modelForm;
      },
    };
  };

  onProvinceChange = (value, _item) => {
    const { dispatch } = this.props;
    const { carPlate } = this.state;
    this.setState({
      carPlate: { province: value, area: '', carNumber: carPlate.carNumber },
    });
    dispatch({ type: 'carGlobal/getCarArea', payload: { province: value } });
  };

  onCarTypeChange: onSelectChange = (value, option) => {
    this.setState({ carType: value, owner: { name: null, phone: null, id: null } });
  };

  getList = () => {
    this.onChangePage(1);
  };

  onChangePage = async (page: number, pageSize: number = 10) => {
    const { pageOption } = this.state;
    const { dispatch } = this.props;
    const data = await dispatch({
      type: 'car/getList',
      pageOption: { page: page - 1, size: pageSize, ...this.queryCondition },
    });
    if (!data) {
      return;
    }
    data.content.forEach(item => {
      const findType = this.props.carTypes.find(v => +v.key === +item.type);
      item.typeCN = findType ? findType.value : '';
    });
    this.setState({
      selectedRow: [],
      dataList: data ? data.content : [],
      pageOption: {
        ...pageOption,
        current: page,
        total: data.totalElements,
        pageSize,
      },
    });
  };

  selectedChange = (keys, data) => {
    this.selectedData = data;
    this.setState({
      selectedRow: keys,
    });
  };

  tableOnChange = (pagination: PaginationConfig) => {
    if (this.state.pageOption.pageSize !== pagination.pageSize) {
      pagination.current = 1;
    }
    this.onChangePage(pagination.current || 1, pagination.pageSize || 10);
  };

  addCar = () => {
    this.setState({
      modifyData: {} as CarBaseInfo,
      carType: '',
      selectedRow: [],
      carPlate: { province: '', area: '', carNumber: '' },
      owner: { id: null, name: null, phone: null },
      add: true,
    });
  };

  onReset = e => {
    this.searchForm.resetFields();
    this.onSearachSubmit(e);
  };

  modifyCar = (record: CarBaseInfo) => {
    this.modifyId = record.carId;
    const carPlate = record.licensePlate;
    const province = carPlate.charAt(0);
    const area = carPlate.charAt(1);
    const carNumber = carPlate.slice(2);
    this.props.dispatch({ type: 'carGlobal/getCarArea', payload: { province } });
    this.setState({
      carPlate: { province, area, carNumber },
      owner: { name: record.ownerName, phone: record.ownerPhone },
      modifyData: record,
      carType: record.type,
      modify: true,
    });
  };

  reAuthCar = async (record: CarBaseInfo) => {
    this.setState({
      carId: record.carId,
      reAuthCarModalVisible: true,
      carType: record.type,
    });
  };

  onCancelModel = () => {
    this.setState({
      add: false,
      writtenOffDetail: false,
      reAuthCarModalVisible: false,
      modify: false,
    });
  };

  showWrittenOffDetailModal = (record: any) => {
    this.setState({ writtenOffDetail: true, modifyData: record });
  };

  deleteCar = async (record?: any) => {
    let ids: any[] = [];
    // let carIds: any[] = [];
    if (!record && !this.selectedData.length) {
      Message.warning(ERROR_SELECT_CAR);
      return;
    } else if (record) {
      ids = [record.carVillageId];
      // carIds = [record.carId];
    } else {
      ids = this.selectedData.map(item => item.carVillageId);
      // carIds = this.selectedData.map(item => item.carId);
    }
    if (this.confirmRef.current) {
      this.confirmRef.current.open(
        async () => {
          const data = await this.props.dispatch({
            type: 'car/deleteCar',
            payload: {
              carVillageRefIds: ids,
              carId: record.carId,
            },
          });
          if (data && data.error && ids.length > 1) {
            this.setState({
              operatingResultsVisible: true,
              batchHandleResultsData: data,
            });
          } else if (data && data.error) {
            Message.error(data.message);
          } else if (data && data.success) {
            Message.success(SUCCESS_WRITTEN_OFF);
            this.onCancelModel();
          }
          this.selectedData = [];
          this.setState({
            selectedRow: [],
          });
          this.getList();
        },
        '注销车辆',
        '注销将删除车辆全部信息，是否确认删除？',
      );
    }
  };

  importData = (file: File) => {
    this.props.dispatch({ type: 'car/importData', payload: { file } }).then(({ data, success }) => {
      if (data && data.error && this.confirmRef.current) {
        this.confirmRef.current.open(() => {}, '导入错误', data.error, 'error');
      } else if (success) {
        Message.success(SUCCESS_IMPORT);
        this.getList();
      }
    });
    return false;
  };

  templateDownload = () => {
    this.props.dispatch({ type: 'car/templateDownload' });
  };

  onGetFormRef = (form: WrappedFormUtils) => {
    this.searchForm = form;
  };

  onSearachSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (e) {
      e.preventDefault();
    }
    this.searchForm.validateFields((err, fieldsValue) => {
      if (err) return;
      this.queryCondition = { ...fieldsValue };
      fieldsValue.page = 0;
      for (const item in fieldsValue) {
        if (fieldsValue.hasOwnProperty(item)) {
          fieldsValue[item] = fieldsValue[item] === -1 ? undefined : fieldsValue[item];
        }
      }
      this.getList();
      // this.setSearchInfo(fieldsValue);
    });
  };

  onModifyModalSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { dispatch } = this.props;
    this.modelForm.validateFields(async (err, fieldValues) => {
      if (!err) {
        fieldValues.licensePlate = fieldValues.province + fieldValues.area + fieldValues.carNumber;
        const data = await dispatch({
          type: 'car/editCar',
          data: { ...fieldValues, carVillageId: this.state.modifyData.carVillageId },
        });
        if (data && data.success) {
          this.onCancelModel();
        }
        this.getList();
      }
    });
  };

  onCarAuthFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { dispatch } = this.props;
    this.carAuthForm.validateFields(async (err, fieldValues) => {
      if (!err) {
        fieldValues.type = this.state.carType;
        fieldValues.carId = this.state.carId;
        if (fieldValues.time) {
          fieldValues.startTime = moment(fieldValues.time[0]).format('YYYY-MM-DD HH:mm:ss');
          fieldValues.endTime = moment(fieldValues.time[1]).format('YYYY-MM-DD HH:mm:ss');
          delete fieldValues.time;
        }
        const { data } = await dispatch({
          type: 'carGlobal/updateAuthCar',
          payload: fieldValues,
        });
        if (data && data.error === 0) {
          this.onCancelModel();
        } else if (data && data.error) {
          Message.error(data.message.join());
        }
        this.getList();
      }
    });
  };
}

export default Car;
