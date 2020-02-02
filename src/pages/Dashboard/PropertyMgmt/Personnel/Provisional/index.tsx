import React, { PureComponent, Fragment, RefObject, createRef } from 'react';
import styles from './index.less';
import { connect } from '@/utils/decorators';
import classNames from 'classnames';
import { isEmpty } from 'lodash';
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
  Message,
  Modal,
  FormSimple,
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
import moment from 'moment';

const mapStateToProps = ({ carGlobal, takeout, app, loading: { effects } }: GlobalState) => {
  return {
    takeoutData: takeout.takeoutData,
    getTakeoutLoading: effects['takeout/provisionalPage'],
    addTakeoutLoading: effects['takeout/addTakeout'],
    updateTakeoutLoading: effects['takeout/updateTakeout'],
    deleteTakeoutLoading: effects['takeout/deleteProvisional'],
    personTypes: app.dictionry[DictionaryEnum.PERSON_TYPE] || [],
    doorAuthConfig: carGlobal.doorBanAuthSettingData,
  };
};

type TakeoutStateProps = ReturnType<typeof mapStateToProps>;
type TakeoutProps = TakeoutStateProps & UmiComponentProps & FormComponentProps;

interface TakeoutState {
  add: boolean;
  modify: boolean;
  fileList: UploadFile[];
  idCardFileList: UploadFile[];
  showDeleteConfirm: boolean;
  selectedRowKeys: number[];
  searchFields: { [propName: string]: any };
  takeout: any;
  takeoutDetail: boolean;
  detailDelete: boolean;
  modalVisible: boolean;
}

@connect(
  mapStateToProps,
  null,
)
class Provisional extends PureComponent<TakeoutProps, TakeoutState> {
  searchForm: WrappedFormUtils;
  personAuthForm: WrappedFormUtils;
  modelForm: WrappedFormUtils;
  confirmRef: RefObject<Confirm>;

  personFormRef: RefObject<PersonForm>;

  operatingResultRef: RefObject<OperatingResults>;

  selectedData: any[];

  constructor(props: Readonly<TakeoutProps>) {
    super(props);
    this.confirmRef = createRef();
    this.operatingResultRef = createRef();
    this.personFormRef = createRef();
    this.state = {
      showDeleteConfirm: true,
      fileList: [],
      idCardFileList: [],
      add: false,
      modify: false,
      selectedRowKeys: [],
      searchFields: {},
      takeout: {},
      takeoutDetail: false,
      detailDelete: false,
      modalVisible: false,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    this.getTakeoutData({ page: 0 });
    dispatch({ type: 'app/getDic', payload: { type: DictionaryEnum.PERSON_TYPE } }).then(data => {
      console.log(data);
    });
  }
  renderSearchForm() {
    const SearchFormProps = {
      items: [{ type: 'input', field: 'name', placeholder: '姓名' }],
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
    const { addTakeoutLoading } = this.props;
    const ButtonGroupProps = {
      actions: [
        {
          customtype: 'master',
          title: '新增',
          onClick: this.addTakeout,
          loading: addTakeoutLoading,
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
        //   onClick: this.batchDeleteTakeout,
        //   loading: deleteTakeoutLoading,
        // },
      ],
    };
    return <ButtonGroup {...ButtonGroupProps} />;
  }

  // eslint-disable-next-line max-lines-per-function
  renderTable() {
    const { takeoutData, getTakeoutLoading } = this.props;
    // const { takeoutData, getTakeoutLoading, doorAuthConfig } = this.props;
    const { selectedRowKeys } = this.state;

    if (isEmpty(takeoutData) || !takeoutData) {
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
        title: '人员类型',
        width: DOUBLE_COLUMN_WIDTH,
        dataIndex: 'typeStr',
        key: 'typeStr',
        render: (text: any, record: any) =>
          CommonComponent.renderTableCol(text + (record.foreign ? '(外籍)' : ''), record),
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
      //   key: 'idCard',
      //   dataIndex: 'idCard',
      //   render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      // },
      {
        title: '登记时间',
        width: DOUBLE_COLUMN_WIDTH,
        key: 'createdTime',
        dataIndex: 'createdTime',
        render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      },

      {
        title: '操作',
        // width: DOUBLE_COLUMN_WIDTH,
        key: 'action',
        render: (_text: any, record: any) =>
          takeoutData ? (
            <Fragment>
              <Button
                customtype={'icon'}
                onClick={e => this.openModelDetail(record, e)}
                icon={'pm-details'}
                title={'详情'}
              />
              <Button
                customtype={'icon'}
                onClick={e => this.updateTakeout(record, e)}
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
      total: takeoutData.totalElements,
      current: takeoutData.pageable.pageNumber + 1,
      pageSize: takeoutData.pageable.pageSize,
      defaultCurrent: 1,
      // onChange: this.onChangePage,
    };

    return (
      <div className={classNames('flexAuto')}>
        <Table
          columns={columns}
          dataSource={takeoutData.content}
          scroll={{ y: '100%' }}
          pagination={pagination}
          rowKey={'id'}
          loading={getTakeoutLoading}
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
    const { takeout = {}, takeoutDetail, detailDelete } = this.state;
    const props = {
      items: [
        {
          name: '姓名',
          value: takeout.name,
        },
        {
          name: '证件号码',
          value: encryptValue(takeout.idCard),
        },
        {
          name: '证件地址',
          value: takeout.domicile,
        },
        {
          name: takeout.foreign ? '国籍' : '民族',
          value: takeout.foreign ? takeout.nationality : takeout.nation,
        },
        {
          name: '出生年月',
          value: takeout.birthday,
        },
        {
          name: '性别',
          value: takeout.sex === '1' ? '男' : '女',
        },
        {
          name: '人员类型',
          value: takeout.typeStr,
        },
        {
          name: '联系电话',
          value: takeout.phone,
        },
        {
          name: '登记时间',
          value: takeout.createdTime,
        },
        {
          name: '备注',
          fill: true,
          value: takeout.remark,
        },
      ],
      images: [
        {
          name: '证件照',
          url: takeout.image,
        },
      ],
      info: takeout || {},
      actions: [
        {
          customtype: 'second',
          title: '关闭',
          onClick: this.onCancelModel,
        },
      ],
      visible: takeoutDetail,
      onCancel: this.onCancelModel,
      title: '临时人员详情',
    };

    if (detailDelete) {
      props.actions.unshift({
        customtype: 'select',
        title: '临时人员注销',
        onClick: () => this.deleteTakeout(takeout.id),
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
        <PersonForm personSuccess={this.getList} ref={this.personFormRef} />
        <OperatingResults ref={this.operatingResultRef} />
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
        const { takeoutData = [] } = this.props;
        const dataItem = takeoutData.content.find(listItem => listItem.personId === item.personId);
        const data = {
          personId: item.personId,
          type: dataItem.type,
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
      this.getTakeoutData(fieldsValue);
      // for (const item in fieldsValue) {
      //   if (fieldsValue.hasOwnTakeout(item)) {
      //     fieldsValue[item] = fieldsValue[item] === -1 ? undefined : fieldsValue[item];
      //   }
      // }
    });
  };

  getTakeoutData = Fileds => {
    const { dispatch } = this.props;
    this.setState({ selectedRowKeys: [] });
    dispatch({ type: 'takeout/provisionalPage', payload: { ...Fileds } });
  };

  onTableChange = (pagination, filters, sorter, extra) => {
    const searchFields = { ...this.state.searchFields };
    searchFields.page = --pagination.current;
    searchFields.size = pagination.pageSize;
    this.getTakeoutData(searchFields);
  };

  addTakeout = () => {
    if (this.personFormRef.current) {
      this.personFormRef.current.open('add', EPersonType.temp);
    }
    // this.setState({
    //   add: true,
    // });
  };

  searchFormReset = () => {
    this.searchForm.resetFields();
    this.setState({
      searchFields: {},
    });
    this.getTakeoutData({ page: 0 });
  };

  onTableSelectRow = (selectedRowKeys, selectedRows) => {
    this.selectedData = selectedRows;
    this.setState({ selectedRowKeys });
  };

  updateTakeout = (record: any, e) => {
    e.stopPropagation();
    if (this.personFormRef.current) {
      this.personFormRef.current.open('edit', EPersonType.temp, record);
    }
  };

  onCancelModel = () => {
    this.setState({
      add: false,
      modify: false,
      takeoutDetail: false,
      // takeout: [],
      fileList: [],
      idCardFileList: [],
    });
  };

  batchDeleteTakeout = () => {
    if (this.confirmRef.current) {
      this.confirmRef.current.open(
        () => this.onDeleteTakeout(this.state.selectedRowKeys),
        '注销',
        '是否确认注销选中的条目？',
      );
    }
  };

  deleteTakeout = (id: number) => {
    if (this.confirmRef.current) {
      this.confirmRef.current.open(() => this.onDeleteTakeout([id]), '注销', '是否确认注销？');
    }
  };

  onDeleteTakeout = payload => {
    const { dispatch } = this.props;
    dispatch({ type: 'takeout/deleteProvisional', payload }).then(data => {
      console.log(data);
      if (data && data.error && this.operatingResultRef.current) {
        this.operatingResultRef.current.open(data);
      } else if (data) {
        Message.success(SUCCESS_WRITTEN_OFF);
        this.onCancelModel();
        this.getTakeoutData({ page: 0 });
      }
    });
  };

  getList = () => {
    this.getTakeoutData({ page: 0, size: 10 });
  };

  getCurrentPage = () => {
    const { takeoutData } = this.props;
    if (takeoutData) {
      this.getTakeoutData({
        page: takeoutData.pageable.pageNumber,
        size: takeoutData.pageable.pageSize,
      });
    }
  };

  onGetFormRef = (form: WrappedFormUtils) => {
    this.searchForm = form;
  };

  onChangeFile = info => {
    this.setState({
      fileList: info.fileList,
    });
  };

  onIdCardChangeFile = info => {
    this.setState({
      idCardFileList: info.fileList,
    });
  };

  onDatePickerChange = (date: moment.Moment, dateString: string) => {};

  onSelectChange = (value, option) => {};

  onAddTakeout = fieldsValue => {
    const { dispatch } = this.props;
    dispatch({
      type: 'takeout/addTakeout',
      payload: fieldsValue,
    }).then(() => {
      this.onCancelModel();
      this.getTakeoutData({ page: 0 });
    });
  };

  onUpdateTakeout = fieldsValue => {
    const { dispatch } = this.props;
    dispatch({
      type: 'takeout/updateTakeout',
      payload: fieldsValue,
    }).then(() => {
      this.onCancelModel();
      this.getTakeoutData({ page: 0 });
    });
  };

  onRowCilck = (record: any, index: number, event: Event) => {
    this.openModelDetail(record, event);
  };

  openDeleteDetail = record => {
    this.setState({ takeout: record, takeoutDetail: true, detailDelete: true });
  };

  openModelDetail = (record, e) => {
    e.stopPropagation();
    this.setState({ takeout: record, takeoutDetail: true, detailDelete: false });
  };
}

export default Provisional;
