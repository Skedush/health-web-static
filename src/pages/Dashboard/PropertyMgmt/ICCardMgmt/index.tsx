import React, { PureComponent, RefObject, createRef, Fragment } from 'react';
import moment from 'moment';
import { connect } from '@/utils/decorators';
import classNames from 'classnames';
// import styles from './index.less';
import {
  Table,
  SearchForm,
  CommonComponent,
  Confirm,
  ButtonGroup,
  Button,
  ModalForm,
  Message,
  Modal,
  Form,
  OperatingResults,
} from '@/components/Library';
import {
  FormComponentProps,
  PaginationConfig,
  WrappedFormUtils,
  ColumnProps,
} from '@/components/Library/type';
import { GlobalState, UmiComponentProps } from '@/common/type';
import { DOUBLE_COLUMN_WIDTH, SINGLE_COLUMN_WIDTH } from '@/utils/constant';
import IcCardForm, { EOpenType } from './components/IcCardForm';
import AuthInfo from '../../Device/DoorBan/PassportMgmt/components/AuthInfo';
import { ERROR_SELECT_IC, SUCCESS_IMPOWER } from '@/utils/message';
import { IAuthData } from '@/models/passport';
import RangePicker from '@/components/Library/DatePicker/RangePicker';
import styles from './index.less';
import { endTimeAfterNow } from '@/utils/validater';
import { copyArrParam } from '@/utils';

const mapStateToProps = (state: GlobalState) => {
  return { state, loading: state.loading.effects['visitRecord/getVisitRecordList'] };
};

type IcCardStateProps = ReturnType<typeof mapStateToProps>;
type IcCardProps = IcCardStateProps & UmiComponentProps & FormComponentProps;

interface IcCardState {
  add: boolean;
  modify: boolean;
  dataSource: any[];
  pageOption: PaginationConfig;
  visible: boolean;
  issuedIcCardVisible: boolean;
  openType: EOpenType;
  authVisible: boolean;
  IssuedTimeVisible: boolean;
  issuedTimeData: any;
  modifyData: any;
  openDate: any;
  authData: IAuthData;
  licenceId: string;
}

@connect(
  mapStateToProps,
  null,
)
class IcCard extends PureComponent<IcCardProps, IcCardState> {
  searchForm: WrappedFormUtils;
  modelForm: WrappedFormUtils;

  confirmRef: RefObject<Confirm>;

  operateRef: RefObject<OperatingResults>;

  selectedList: any[] = [];

  queryCondition = {};

  constructor(props: Readonly<IcCardProps>) {
    super(props);
    this.confirmRef = createRef();
    this.operateRef = createRef();
    this.state = {
      dataSource: [],
      add: false,
      modify: false,
      issuedIcCardVisible: false,
      IssuedTimeVisible: false,
      issuedTimeData: null,
      modifyData: null,
      licenceId: '',
      openDate: {},
      pageOption: {
        current: 1,
        total: 0,
        pageSize: 10,
      },
      visible: false,
      openType: EOpenType.add,
      authVisible: false,
      authData: {} as IAuthData,
    };
  }

  componentDidMount() {
    this.getList();
  }

  renderSearchForm() {
    const SearchFormProps = {
      items: [
        { type: 'input', field: 'personName', placeholder: '姓名' },
        { type: 'input', field: 'icCardNo', placeholder: 'IC卡编号' },
        {
          type: 'select',
          field: 'certificationStatus',
          children: [{ key: '1', value: '未认证' }, { key: '2', value: '已认证' }],
          placeholder: '认证状态',
        },
      ],
      actions: [
        { customtype: 'select', title: '查询', onClick: this.onSearchSubmit },
        { customtype: 'reset', title: '重置', onClick: this.onReset },
      ],
      columnNumOfRow: 4,
      onGetFormRef: this.onGetFormRef,
    };
    return <SearchForm {...SearchFormProps} />;
  }

  // eslint-disable-next-line max-lines-per-function
  renderTable() {
    const columns: ColumnProps<any>[] = [
      {
        title: 'IC卡号',
        dataIndex: 'icCardNo',
        key: 'icCardNo',
        width: DOUBLE_COLUMN_WIDTH,
        render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '姓名',
        width: DOUBLE_COLUMN_WIDTH,
        dataIndex: 'personName',
        key: 'personName',
        render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '认证状态',
        width: DOUBLE_COLUMN_WIDTH,
        dataIndex: 'authStatusCN',
        key: 'authStatusCN',
        render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '联系电话',
        width: DOUBLE_COLUMN_WIDTH,
        key: 'personPhone',
        dataIndex: 'personPhone',
        render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      },
      // {
      //   title: '有效时间',
      //   width: DOUBLE_COLUMN_WIDTH,
      //   key: 'time',
      //   dataIndex: 'time',
      //   render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      // },
      {
        title: '操作',
        width: SINGLE_COLUMN_WIDTH,
        key: 'authTime',
        dataIndex: 'authTime',
        render: (text: any, record: any) => (
          <Fragment>
            <Button
              customtype={'icon'}
              onClick={e => this.openAuthModal(record)}
              icon={'pm-resubmit'}
              title={'下发'}
            />
            {record.certificationStatus === '1' && (
              <Button
                customtype={'icon'}
                onClick={e => this.changeIcCardInfo(record)}
                icon={'pm-edit'}
                title={'变更'}
              />
            )}
            <Button
              customtype={'icon'}
              onClick={e => this.reportOfLossIcCard(record)}
              title={'挂失'}
              icon={'pm-write-off'}
            />
          </Fragment>
        ),
      },
    ];
    const { pageOption, dataSource } = this.state;
    const { loading } = this.props;
    const pagination: PaginationConfig = {
      position: 'bottom',
      total: pageOption.total,
      pageSize: pageOption.pageSize,
      defaultCurrent: pageOption.current,
      current: pageOption.current,
    };
    return (
      <div className={classNames('flexAuto')}>
        <Table
          columns={columns}
          dataSource={dataSource}
          scroll={{ y: '100%' }}
          type={'checkbox'}
          onSelectRow={this.onSelectChange}
          pagination={pagination}
          loading={loading}
          onChange={this.tableOnChange}
        />
      </div>
    );
  }

  renderIssuedTime() {
    const { IssuedTimeVisible } = this.state;
    const TimeForm = Form.create<any>()((props: any) => {
      const { getFieldDecorator, validateFields } = props.form;
      return (
        <>
          <Form.Item label={'授权时间'}>
            {getFieldDecorator('time', {
              rules: [{ required: true, message: '请选择时间' }, { validator: endTimeAfterNow }],
            })(<RangePicker showTime={false} placeholder={['开始时间', '结束时间']} />)}
          </Form.Item>
          <Form.Item className={styles.issuedIcCardButton}>
            <Button customtype={'master'} onClick={() => this.authTimeSubmit(validateFields)}>
              下发
            </Button>
          </Form.Item>
        </>
      );
    });
    return (
      <Modal
        title={'通行证下发'}
        visible={IssuedTimeVisible}
        destroyOnClose
        onCancel={this.closeAuthTime}
        footer={null}
      >
        <TimeForm />
      </Modal>
    );
  }

  // eslint-disable-next-line max-lines-per-function
  renderModalForm() {
    const props = {
      items: [
        {
          type: 'input',
          field: 'phone',
          initialValue: '',
          placeholder: '负责人电话',
          disabled: true,
        },
      ],
      actions: [
        { customtype: 'select', title: '确定', htmlType: 'submit' as 'submit' },
        { customtype: 'second', title: '返回', onClick: this.onCancelModel },
      ],
      onSubmit: this.onModelSubmit,
      title: 'IC卡权限下发',
      onCancel: this.onCancelModel,
      destroyOnClose: true,
      width: '40%',
      bodyStyle: {},
      add: this.state.issuedIcCardVisible,
      // modify: this.state.modify,
      onGetFormRef: (modelForm: WrappedFormUtils) => {
        this.modelForm = modelForm;
      },
    };
    return <ModalForm {...props} />;
  }

  renderButtonGroup() {
    const ButtonGroupProps = {
      actions: [
        { customtype: 'master', title: '新增IC卡', onClick: this.addIcCard },
        { customtype: 'warning', title: '批量挂失', onClick: this.deleteIcCard },
      ],
    };
    return <ButtonGroup {...ButtonGroupProps} />;
  }

  renderAuthInfo() {
    const { authVisible, authData, openDate, licenceId } = this.state;
    return (
      <AuthInfo
        updateAuthInfo={() => {
          this.getCurrentList();
          this.openAuthModal(openDate);
        }}
        type={'person'}
        authInfo={authData}
        visible={authVisible}
        refreshList={this.getList}
        licenceId={licenceId}
        onCancel={this.authClose}
        deleteIcCard={() => this.ondeleteCard([openDate.id])}
      />
    );
  }

  render() {
    const { visible, openType, modifyData } = this.state;
    return (
      <div className={classNames('height100', 'flexColStart')}>
        {this.renderAuthInfo()}
        <IcCardForm
          modifyData={modifyData}
          openType={openType}
          addSuccess={this.getCurrentList}
          visible={visible}
          onCancel={this.close}
        />
        <OperatingResults ref={this.operateRef} />
        {this.renderIssuedTime()}
        <Confirm type={'warning'} ref={this.confirmRef} />
        <div className={'listTitle'}>信息筛选</div>
        {this.renderSearchForm()}
        <div className={'listTitle'}>信息展示</div>
        {this.renderButtonGroup()}
        {this.renderTable()}
      </div>
    );
  }

  getList() {
    this.onChangePage(1, this.state.pageOption.pageSize);
  }

  getCurrentList = () => {
    this.onChangePage(this.state.pageOption.current || 1, this.state.pageOption.pageSize);
  };

  tableOnChange = (pagination: PaginationConfig) => {
    this.onChangePage(pagination.current || 1, pagination.pageSize || 10);
  };

  onChangePage = async (page: number, pageSize: number = 10) => {
    const { dispatch } = this.props;
    const { pageOption } = this.state;
    const data = await dispatch({
      type: 'icCard/getIcCardList',
      data: { page: page - 1, size: pageSize, ...this.queryCondition },
    });
    data.content.forEach(item => {
      item.time = item.authorizeStartTime
        ? `${moment(item.authorizeStartTime).format('YYYY-MM-DD')} ~ ${moment(
            item.authroizeEndTime,
          ).format('YYYY-MM-DD')}`
        : '';
      item.authStatusCN = item.certificationStatus === '1' ? '未认证' : '已认证';
    });
    this.setState({
      dataSource: data ? data.content : [],
      pageOption: {
        ...pageOption,
        current: page,
        pageSize,
        total: data.totalElements,
      },
    });
  };

  deleteIcCard = () => {
    if (!this.selectedList.length) {
      Message.warning(ERROR_SELECT_IC);
      return;
    }
    if (this.confirmRef.current) {
      this.confirmRef.current.open(
        () => this.ondeleteCard(this.selectedList),
        '删除',
        '是否确认删除？',
      );
    }
  };

  closeAuthTime = () => {
    this.setState({
      IssuedTimeVisible: false,
    });
  };

  authTimeSubmit = (validateFields: Function) => {
    const { issuedTimeData } = this.state;
    validateFields(async (error, values) => {
      if (error) {
        return;
      }
      console.log(values);
      const { time } = values;
      const data = {
        icCardNo: [issuedTimeData.icCardNo],
        authorizeStartTime: time[0].format('YYYY-MM-DD HH:mm:ss'),
        authorizeEndTime: time[1].format('YYYY-MM-DD HH:mm:ss'),
      };
      const resData = await this.props.dispatch({ type: 'icCard/iussedIcCardAuth', data });
      if (resData && !resData.error) {
        Message.success(SUCCESS_IMPOWER);
        this.getCurrentList();
        this.closeAuthTime();
      }
    });
  };

  openAuthModal = async (record: any) => {
    const data = await this.props.dispatch({
      type: 'permit/getPersonAuthBaseInfo',
      data: { id: record.licenseId },
    });
    copyArrParam(data.personTypeList, { type: 'key', value: 'typeStr' });
    this.setState({
      authVisible: true,
      authData: data,
      licenceId: record.licenseId,
      openDate: record,
    });
  };

  authClose = () => {
    this.setState({
      authVisible: false,
    });
  };

  changeIcCardInfo = async record => {
    const data = await this.props.dispatch({
      type: 'icCard/getIcCardDetail',
      data: { id: record.id },
    });
    data.id = record.id;
    this.setState({
      modifyData: data,
      openType: EOpenType.change,
      visible: true,
    });
  };

  addIcCard = () => {
    this.setState({
      openType: EOpenType.add,
      visible: true,
    });
  };

  close = () => {
    this.setState({
      visible: false,
    });
  };

  onSearch = () => {};

  onReset = e => {
    this.searchForm.resetFields();
    this.onSearchSubmit();
  };

  onCancelModel = () => {
    this.setState({
      add: false,
      modify: false,
    });
  };

  changeIcCard = record => {};

  reportOfLossIcCard = record => {
    if (this.confirmRef.current) {
      this.confirmRef.current.open(() => this.ondeleteCard([record.id]), '挂失', '是否确认挂失？');
    }
  };

  ondeleteCard = data => {
    const { dispatch } = this.props;
    dispatch({ type: 'icCard/deleteIcCard', data }).then(res => {
      if (res && res.error) {
        const { error } = res;
        if (error === 1) {
          Message.error(res.message[0]);
        } else if (this.operateRef.current) {
          this.operateRef.current.open(res);
        }
      }
      this.getList();
    });
  };

  onGetFormRef = (form: WrappedFormUtils) => {
    this.searchForm = form;
  };

  onSearchSubmit = async () => {
    await this.setQueryCondition();
    this.getList();
  };

  async setQueryCondition() {
    return new Promise<any>(resolve => {
      this.searchForm.validateFields((err, fieldsValue) => {
        if (err) return;
        console.log('fieldsValue: ', fieldsValue);
        this.queryCondition = fieldsValue;
        resolve(fieldsValue);
      });
    });
  }

  onDatePickerChange = (date: moment.Moment, dateString: string) => {
    console.log('dateString: ', dateString);
    console.log('date: ', date);
  };

  onSelectChange = (value, option) => {
    console.log('value, option: ', value, option);
    this.selectedList = value;
  };

  closeIssuedIcCard = () => {
    this.setState({
      issuedIcCardVisible: false,
    });
  };

  openIssuedICCard = () => {
    this.setState({
      issuedIcCardVisible: true,
    });
  };

  onModelSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { dispatch } = this.props;
    this.modelForm.validateFields((err, fieldValues) => {
      const { add, modify } = this.state;
      if (!err) {
        if (add) {
          dispatch({ type: 'visit/addVisitDevice', data: fieldValues });
        } else if (modify) {
          dispatch({ type: 'visit/editVisitDevice', data: fieldValues });
        }
        this.setState({ add: false, modify: false });
      }
    });
  };
}

export default IcCard;
