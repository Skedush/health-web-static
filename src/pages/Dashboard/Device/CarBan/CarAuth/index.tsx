import React, { PureComponent, Fragment, RefObject, createRef } from 'react';
import moment from 'moment';
import { connect } from '@/utils/decorators';
import classNames from 'classnames';
import { onOverFlowHiddenCell } from '@/utils';
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
import { GlobalState, UmiComponentProps, DictionaryEnum } from '@/common/type';

const mapStateToProps = ({ carAuth, app, loading: { effects } }: GlobalState) => {
  return {
    carAuthData: carAuth.carAuthData,
    authStates: app.dictionry[DictionaryEnum.AUTH_STATUS],
    carType: app.dictionry[DictionaryEnum.CAR_TYPE],
    carAuthInfo: carAuth.carAuthInfo,
    getCarAuthLoading: effects['carAuth/getCarAuth'],
    getCarAuthInfoLoading: effects['carAuth/getCarAuthInfo'],
    addCarAuthLoading: effects['carAuth/addCarAuth'],
    deleteCarAuthLoading: effects['carAuth/deleteCarAuth'],
    updateCarAuthLoading: effects['carAuth/updateCarAuth'],
  };
};

type CarAuthStateProps = ReturnType<typeof mapStateToProps>;
type CarAuthProps = CarAuthStateProps & UmiComponentProps & FormComponentProps;

interface CarAuthState {
  add: boolean;
  modify: boolean;
  fileList: UploadFile[];
  showDeleteConfirm: boolean;
  selectedRowKeys: number[];
  searchFields: { [propName: string]: any };
  operatingResultsVisible: boolean;
  batchHandleResultsData: { [propName: string]: any };
}

@connect(
  mapStateToProps,
  null,
)
class CarAuth extends PureComponent<CarAuthProps, CarAuthState> {
  searchForm: WrappedFormUtils;
  modelForm: WrappedFormUtils;
  confirmRef: RefObject<Confirm>;

  constructor(props: Readonly<CarAuthProps>) {
    super(props);
    this.confirmRef = createRef();
    this.state = {
      showDeleteConfirm: true,
      fileList: [],
      add: false,
      modify: false,
      selectedRowKeys: [],
      searchFields: {},
      operatingResultsVisible: false,
      batchHandleResultsData: {},
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    this.getCarAuthData({ page: 0 });
    dispatch({
      type: 'app/getDic',
      payload: { type: [DictionaryEnum.CAR_TYPE, DictionaryEnum.AUTH_STATUS].toString() },
    });
  }
  renderSearchForm() {
    const { authStates, carType } = this.props;
    const SearchFormProps = {
      items: [
        { type: 'input', field: 'carPlate', placeholder: '车牌号' },
        { type: 'select', field: 'type', placeholder: '车辆类型', children: carType },
        {
          type: 'input',
          field: 'name',
          placeholder: '联系人员',
        },
        { type: 'select', field: 'authState', placeholder: '授权状态', children: authStates },
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
    const { deleteCarAuthLoading, addCarAuthLoading } = this.props;
    const ButtonGroupProps = {
      actions: [
        {
          customtype: 'master',
          title: '下发授权',
          disabled: !this.state.selectedRowKeys.length,
          onClick: this.addCarAuth,
          loading: addCarAuthLoading,
        },
        {
          customtype: 'warning',
          disabled: !this.state.selectedRowKeys.length,
          title: '删除授权',
          onClick: this.batchDeleteCarAuth,
          loading: deleteCarAuthLoading,
        },
      ],
    };
    return <ButtonGroup {...ButtonGroupProps} />;
  }

  // eslint-disable-next-line max-lines-per-function
  renderTable() {
    const { carAuthData } = this.props;
    const { getCarAuthLoading } = this.props;
    const { selectedRowKeys } = this.state;

    if (isEmpty(carAuthData) || !carAuthData) {
      return null;
    }

    const columns: ColumnProps<any>[] = [
      {
        title: '车牌号',
        dataIndex: 'carPlate',
        key: 'carPlate',
        width: '10%',
        align: 'center',
        render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '车辆类型',
        width: '10%',
        align: 'center',
        dataIndex: 'carTypeStr',
        key: 'carTypeStr',
        render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '关联人员',
        width: '8%',
        align: 'center',
        dataIndex: 'name',
        key: 'name',
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
        width: '10%',
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
        title: '备注',
        width: '20%',
        align: 'center',
        onCell: onOverFlowHiddenCell,
        key: 'remark',
        dataIndex: 'remark',
        render: (text: any, record: object) =>
          CommonComponent.renderTableOverFlowHidden(text, record),
      },

      {
        title: '操作',
        align: 'center',
        // width: '25%',
        key: 'action',
        render: (_text: any, record: any) =>
          carAuthData ? (
            <Fragment>
              <Button
                customtype={'icon'}
                onClick={() => this.updateCarAuth(record.id)}
                icon={'pm-edit'}
                title={'修改'}
              />
              <Button
                customtype={'icon'}
                onClick={() => this.deleteCarAuth(record.id)}
                title={'删除'}
                icon={'pm-trash-can'}
              />
            </Fragment>
          ) : null,
      },
    ];

    const pagination: PaginationConfig = {
      position: 'bottom',
      total: carAuthData.totalElements,
      pageSize: carAuthData.pageable.pageSize,
      current: carAuthData.pageable.pageNumber + 1,
      defaultCurrent: 1,
      // onChange: this.onChangePage,
    };

    return (
      <div className={classNames('flexAuto')}>
        <Table
          columns={columns}
          loading={getCarAuthLoading}
          dataSource={carAuthData.content}
          scroll={{ y: '100%' }}
          pagination={pagination}
          onSelectRow={this.onTableSelectRow}
          onChange={this.onTableChange}
          selectedRow={selectedRowKeys}
        />
      </div>
    );
  }

  // eslint-disable-next-line max-lines-per-function
  renderModalForm() {
    const { modify, add } = this.state;
    const { carType, carAuthInfo = {}, updateCarAuthLoading } = this.props;
    const props = {
      items: [
        {
          type: 'hiddenInput',
          field: 'id',
          initialValue: carAuthInfo.id,
          hidden: true,
        },
        {
          type: 'input',
          disabled: true,
          field: 'name',
          initialValue: carAuthInfo.name,
          span: 12,
          placeholder: '联系人员',
          rules: [{ required: true, message: '请输入姓名!' }],
        },
        {
          type: 'input',
          initialValue: carAuthInfo.phone,
          disabled: true,
          span: 12,
          field: 'phone',
          placeholder: '联系电话',
          rules: [{ required: true, message: '请输入电话!' }],
        },
        {
          type: 'input',
          initialValue: carAuthInfo.carPlate,
          disabled: true,
          field: 'carPlate',
          span: 12,
          placeholder: '车牌号',
          rules: [{ required: true, message: '请输入车牌!' }],
        },
        {
          type: 'input',
          initialValue: carAuthInfo.carSpec,
          disabled: true,
          span: 12,
          children: carType,
          field: 'carSpec',
          placeholder: '车型',
          rules: [{ required: true, message: '请输入车型!' }],
        },
        {
          type: 'input',
          initialValue: carAuthInfo.carBrand,
          disabled: true,
          span: 12,
          field: 'carBrand',
          placeholder: '品牌',
          rules: [{ required: true, message: '请输入职位!' }],
        },
        {
          type: 'input',
          initialValue: carAuthInfo.carColor,
          disabled: true,
          span: 12,
          field: 'carColor',
          placeholder: '颜色',
          rules: [{ required: true, message: '请输入职位!' }],
        },

        {
          type: 'rangePicker',
          initialValue: [
            carAuthInfo.authStartDate === null ? undefined : moment(carAuthInfo.authStartDate),
            carAuthInfo.authEndDate === null ? undefined : moment(carAuthInfo.authEndDate),
          ],
          timeBegin: carAuthInfo.authStartDate ? moment(carAuthInfo.authStartDate) : undefined,
          fill: true,
          field: 'time',
          placeholder: ['授权', '时间'] as [string, string],
        },

        {
          type: 'textArea',
          initialValue: carAuthInfo.remark,
          field: 'remark',
          placeholder: '备注',
          fill: true,
          rules: [],
        },
      ],
      actions: [
        {
          customtype: 'select',
          icon: 'search',
          title: '确定',
          htmlType: 'submit' as 'submit',
          loading: updateCarAuthLoading,
        },
        { customtype: 'second', title: '取消', onClick: this.onCancelModel },
      ],
      onSubmit: this.onModelSubmit,
      title: modify ? '修改授权信息' : '新增授权信息',
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
        <div className={'listTitle'}>信息展示</div>
        {this.renderButtonGroup()}
        {this.renderTable()}
        {this.renderModalForm()}
        {this.renderConfirm()}
        {this.renderOperatingResults()}
      </div>
    );
  }

  onCancelOperatingResults = () => {
    this.setState({ operatingResultsVisible: false });
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
      this.getCarAuthData(fieldsValue);
      // for (const item in fieldsValue) {
      //   if (fieldsValue.hasOwnProperty(item)) {
      //     fieldsValue[item] = fieldsValue[item] === -1 ? undefined : fieldsValue[item];
      //   }
      // }
    });
  };

  getCarAuthData = Fileds => {
    const { dispatch } = this.props;
    this.setState({ selectedRowKeys: [] });
    dispatch({ type: 'carAuth/getCarAuth', payload: { ...Fileds } });
  };

  getCarAuthInfo = (id: number) => {
    const { dispatch } = this.props;
    dispatch({ type: 'carAuth/getCarAuthInfo', payload: { id } });
  };

  // onChangePage = (page: number, pageSize: number) => {
  //   console.log('page: ', page);
  //   const searchFields = { ...this.state.searchFields };
  //   searchFields.page = --page;
  //   searchFields.size = pageSize;
  //   this.getCarAuthData(searchFields);
  // };

  onTableChange = (pagination, filters, sorter, extra) => {
    console.log('pagination: ', pagination);
    const searchFields = { ...this.state.searchFields };
    searchFields.page = --pagination.current;
    searchFields.size = pagination.pageSize;
    this.getCarAuthData(searchFields);
  };

  addCarAuth = () => {
    if (this.confirmRef.current) {
      this.confirmRef.current.open(
        () => this.onAddCarAuth(this.state.selectedRowKeys),
        '权限下发',
        '是否确认将权限下发到选中车辆？',
        'success',
      );
    }
  };

  searchFormReset = () => {
    this.searchForm.resetFields();
    this.setState({
      searchFields: {},
    });
    this.getCarAuthData({ page: 0 });
    this.onCancelModel();
  };

  onTableSelectRow = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys });
  };

  updateCarAuth = (id: number) => {
    this.getCarAuthInfo(id);
    this.setState({
      modify: true,
    });
  };

  onCancelModel = () => {
    this.setState({
      add: false,
      modify: false,
    });
  };

  batchDeleteCarAuth = () => {
    if (this.confirmRef.current) {
      this.confirmRef.current.open(
        () => this.onDeleteCarAuth(this.state.selectedRowKeys),
        '删除',
        '是否确认删除选中的条目？',
      );
    }
  };

  deleteCarAuth = (id: number) => {
    if (this.confirmRef.current) {
      this.confirmRef.current.open(() => this.onDeleteCarAuth([id]), '删除', '是否确认删除？');
    }
  };

  onDeleteCarAuth = async payload => {
    const { dispatch } = this.props;
    const data = await dispatch({ type: 'carAuth/deleteCarAuth', payload });
    if (data) {
      if (data.success) {
        this.getCarAuthData({ page: 0 });
      } else if (data.error === 1) {
        Message.error(data.message);
      } else if (data.error > 1) {
        this.setState({ operatingResultsVisible: true, batchHandleResultsData: data });
      }
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

  onDatePickerChange = (date: moment.Moment, dateString: string) => {};

  onSelectChange = (value, option) => {};

  onAddCarAuth = ids => {
    const { dispatch } = this.props;
    dispatch({
      type: 'carAuth/addCarAuth',
      payload: ids,
    }).then(() => {
      this.getCarAuthData({ page: 0 });
      // this.onCancelModel();
    });
  };

  onUpdateCarAuth = fieldsValue => {
    const { dispatch } = this.props;
    dispatch({
      type: 'carAuth/updateCarAuth',
      payload: fieldsValue,
    }).then(() => {
      this.getCarAuthData({ page: 0 });
      this.onCancelModel();
    });
  };

  onModelSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { add, modify } = this.state;
    this.modelForm.validateFields((err, fieldsValue) => {
      if (!err) {
        if (fieldsValue.time) {
          fieldsValue.authStartDate = moment(fieldsValue.time[0]).format('YYYY-MM-DD HH:mm:ss');
          fieldsValue.authEndDate = moment(fieldsValue.time[1]).format('YYYY-MM-DD HH:mm:ss');
          delete fieldsValue.time;
        }
        if (add) {
          // this.onAddCarAuth(fieldsValue);
        } else if (modify) {
          this.onUpdateCarAuth(fieldsValue);
        }
      }
    });
  };
}

export default CarAuth;
