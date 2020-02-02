import React, { PureComponent, Fragment, RefObject, createRef } from 'react';
import moment from 'moment';
import { connect } from '@/utils/decorators';
import passCarEmpty from '@/assets/images/passCarEmpty.png';
import classNames from 'classnames';
import { isEmpty } from 'lodash';
import {
  Table,
  SearchForm,
  Button,
  CommonComponent,
  Spin,
  Badge,
  OperatingResults,
  FormSimple,
  SimplyTable,
  Modal,
  Tabs,
  Img,
  Message,
  ButtonGroup,
} from '@/components/Library';
import {
  FormComponentProps,
  PaginationConfig,
  WrappedFormUtils,
  ColumnProps,
  UploadFile,
  ISimplyColumn,
} from '@/components/Library/type';
import { GlobalState, UmiComponentProps, DictionaryEnum } from '@/common/type';
import styles from './index.less';
import { ERROR_IMPOWER } from '@/utils/message';
import AuthInfo from '../../DoorBan/PassportMgmt/components/AuthInfo';
import { DOUBLE_COLUMN_WIDTH } from '@/utils/constant';
const { TabPane } = Tabs;

const mapStateToProps = ({ carPass, app, loading: { effects } }: GlobalState) => {
  return {
    authStates: app.dictionry[DictionaryEnum.AUTH_STATUS],
    carPassList: carPass.carPassList,
    carPassData: carPass.carPassData,
    loading: {
      updateCarPassAuthLoading: effects['carPass/updateCarPassAuth'],
      getCarPassByIdLoading: effects['carPass/getCarPassById'],
      getCarPassLoading: effects['carPass/getCarPass'],
    },
  };
};

type CarPassStateProps = ReturnType<typeof mapStateToProps>;
type CarPassProps = CarPassStateProps & UmiComponentProps & FormComponentProps;

interface CarPassState {
  fileList: UploadFile[];
  detailModalVisible: boolean;
  reAuthCarModalVisible: boolean;
  carPassId: string;
  selectedRowKeys: number[];
  searchFields: { [propName: string]: any };
  operatingResultsVisible: boolean;
  batchHandleResultsData: { [propName: string]: any };
  authInfo: any;
  licenceId: string;
}

@connect(
  mapStateToProps,
  null,
)
class CarPass extends PureComponent<CarPassProps, CarPassState> {
  searchForm: WrappedFormUtils;
  carPassAuthForm: WrappedFormUtils;

  operateResultRef: RefObject<OperatingResults>;

  constructor(props: Readonly<CarPassProps>) {
    super(props);
    this.operateResultRef = createRef();
    this.state = {
      detailModalVisible: false,
      reAuthCarModalVisible: false,
      carPassId: '',
      fileList: [],
      selectedRowKeys: [],
      searchFields: {},
      operatingResultsVisible: false,
      batchHandleResultsData: {},
      authInfo: {},
      licenceId: '',
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    this.getCarPassList({ page: 0 });
    dispatch({
      type: 'app/getDic',
      payload: { type: [DictionaryEnum.CAR_TYPE, DictionaryEnum.AUTH_STATUS].toString() },
    });
  }
  renderSearchForm() {
    const { authStates, loading } = this.props;
    const SearchFormProps = {
      items: [
        // { type: 'input', field: 'name', placeholder: '姓名' },
        { type: 'input', field: 'licensePlate', placeholder: '车牌号' },
        // { type: 'input', field: 'phone', placeholder: '联系方式' },
        { type: 'select', field: 'authState', placeholder: '授权状态', children: authStates },
      ],
      actions: [
        {
          customtype: 'select',
          title: '查询',
          htmlType: 'submit' as 'submit',
          loading: loading.getCarPassLoading,
        },
        {
          customtype: 'reset',
          title: '重置',
          onClick: this.searchFormReset,
          loading: loading.getCarPassLoading,
        },
      ],
      columnNumOfRow: 4,
      onSubmit: this.onSearch,
      onGetFormRef: this.onGetFormRef,
    };
    return <SearchForm {...SearchFormProps} />;
  }

  // eslint-disable-next-line max-lines-per-function
  renderTable() {
    const { carPassList } = this.props;
    // const { getCarPassLoading } = this.props;
    const { selectedRowKeys } = this.state;

    if (isEmpty(carPassList) || !carPassList) {
      return null;
    }

    const columns: ColumnProps<any>[] = [
      // {
      //   title: '通行证编号',
      //   width: '10%',
      //   align: 'center',
      //   dataIndex: 'code',
      //   key: 'code',
      //   render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      // },
      // {
      //   title: '关联人员',
      //   width: SINGLE_COLUMN_WIDTH,
      //   align: 'center',
      //   dataIndex: 'name',
      //   key: 'name',
      //   render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      // },
      // {
      //   title: '联系电话',
      //   width: DOUBLE_COLUMN_WIDTH,
      //   align: 'center',
      //   key: 'phone',
      //   dataIndex: 'phone',
      //   render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      // },
      {
        title: '车牌号',
        dataIndex: 'licensePlate',
        key: 'licensePlate',
        width: DOUBLE_COLUMN_WIDTH,
        align: 'center',
        render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '创建时间',
        width: DOUBLE_COLUMN_WIDTH,
        align: 'center',
        key: 'createTime',
        dataIndex: 'createTime',
        render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '授权状态',
        width: DOUBLE_COLUMN_WIDTH,
        align: 'center',
        key: 'authStateStr',
        dataIndex: 'authStateStr',
        render: (text: any, record: any) => {
          const { authState } = record;
          let badge = 'error';
          if (authState === '0') {
            badge = 'default';
          } else if (authState === '1') {
            badge = 'success';
          }
          return (
            <div style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}>
              <Badge status={badge as 'success' | 'error' | 'default'} />
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
          carPassList ? (
            <Fragment>
              <Button
                customtype={'icon'}
                onClick={() => this.carPassDetail(record.id)}
                icon={'pm-details'}
                title={'查看'}
              />
            </Fragment>
          ) : null,
      },
    ];

    const pagination: PaginationConfig = {
      position: 'bottom',
      total: carPassList.totalElements,
      pageSize: carPassList.pageable.pageSize,
      current: carPassList.pageable.pageNumber + 1,
      defaultCurrent: 1,
    };

    return (
      <div className={classNames('flexAuto')}>
        <Table
          columns={columns}
          // loading={getCarPassLoading}
          dataSource={carPassList.content}
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
  renderDetailModal() {
    const { carPassData, loading } = this.props;
    const columns: ISimplyColumn[] = [
      {
        span: 4,
        name: '通行证编号',
        key: 'code',
      },
      {
        span: 4,
        name: '车牌号',
        key: 'licensePlate',
      },
      {
        span: 3,
        name: '姓名',
        key: 'name',
      },
      {
        span: 4,
        name: '联系电话',
        key: 'phone',
      },
      {
        span: 4,
        key: 'typeStr',
        name: '车辆类型',
      },
      {
        span: 5,
        name: '创建时间',
        key: 'createTime',
      },
    ];

    const parkingColumns: ISimplyColumn[] = [
      {
        span: 8,
        name: '车位号',
        key: 'code',
      },
      {
        span: 16,
        name: '有效期',
        render: data => {
          return <div>{data.authStartDate + '~' + data.authEndDate}</div>;
        },
      },
    ];
    const parkingTypeColumns: ISimplyColumn[] = [
      {
        span: 8,
        name: '停车场名称',
        key: 'parkingLotName',
      },
      {
        span: 8,
        name: '停车场类型',
        key: 'parkingLotTypeStr',
      },
      {
        span: 8,
        name: '有效期',
        render: data => {
          return <div>永久</div>;
        },
      },
    ];
    return (
      <Modal {...this.getDetailModalProps()}>
        <div className={classNames('flexAround', styles.modalContent)}>
          <div className={classNames(styles.modalLeft, 'flexColStart')}>
            <Spin spinning={!!loading.getCarPassByIdLoading}>
              <SimplyTable columns={columns} dataSource={[carPassData]} />
            </Spin>
            {isEmpty(carPassData.parkingLotCarList) && (
              <Img image={passCarEmpty} className={styles.emptyPassCarImg} />
            )}
            {carPassData.parkingLotCarList && (
              <Tabs type={'line'} defaultActiveKey={'1'}>
                {carPassData.parkingLotCarList &&
                  carPassData.parkingLotCarList.map(item => {
                    return (
                      <TabPane tab={item.parkingLotName} key={item.parkingLotName}>
                        <div>停车场信息</div>
                        <SimplyTable columns={parkingTypeColumns} dataSource={[item]} />
                        {item.parkingSpaceCarList && item.parkingLotType !== '2' && (
                          <div>
                            <div>车位信息</div>
                            <SimplyTable
                              columns={parkingColumns}
                              dataSource={item.parkingSpaceCarList}
                            />
                          </div>
                        )}
                      </TabPane>
                    );
                  })}
              </Tabs>
            )}
          </div>
          <div className={classNames('flexColBetween', styles.right)}>
            <div className={classNames('flexColStart', styles.deviceList)}>
              {carPassData.deviceList &&
                carPassData.deviceList.map((item, index) => (
                  <div key={index} className={styles.deviceItem}>
                    <div className={classNames('flexBetween', 'itemCenter')}>
                      <div className={styles.deviceName}>{item.deviceName}</div>
                      <div className={classNames('flexEnd')}>
                        {item.stateStr}
                        <Badge status={this.getStateBadge(item.state)} />
                      </div>
                    </div>
                    <div className={styles.authTime}>
                      {item.authStartDate + '~' + item.authEndDate}
                    </div>
                  </div>
                ))}
            </div>
            <div className={classNames('flexCenter', styles.button)}>
              <Button
                customtype={'select'}
                onClick={this.updateCarPassAuth}
                // disabled={carPassData.deviceList && carPassData.deviceList.length <= 0}
              >
                授权设备下发
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    );
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

  renderReAuthCarModal() {
    const { loading } = this.props;
    const props = {
      onCancel: this.cancelAuthModel,
      visible: this.state.reAuthCarModalVisible,
      title: '通行证下发',
      destroyOnClose: true,
      centered: true,
      footer: null,
      maskClosable: false,
      bodyStyle: {},
      width: '50%',
      wrapClassName: styles.model,
    };
    return (
      <Modal {...props}>
        <Spin spinning={!!loading.updateCarPassAuthLoading}>
          <FormSimple {...this.getCarAuthFormProps()} />
        </Spin>
      </Modal>
    );
  }

  renderAuthInfo() {
    const { authInfo, detailModalVisible, licenceId } = this.state;
    const props = {
      type: 'car' as any,
      updateAuthInfo: async () => {
        await this.updateCarPass(licenceId);
        this.getCarPassList({});
      },
      updateAllAuth: this.updateCarAllPassAuth,
      authInfo,
      licenceId,
      visible: detailModalVisible,
      onCancel: this.cancelModel,
    };
    return <AuthInfo {...props} />;
  }

  renderButtonGroup() {
    const ButtonGroupProps = {
      actions: [{ customtype: 'master', title: '更新授权', onClick: this.updateCarAllPassAuth }],
    };
    return <ButtonGroup {...ButtonGroupProps} />;
  }

  render() {
    return (
      <div className={classNames('height100', 'flexColStart')}>
        <OperatingResults ref={this.operateResultRef} />
        <div className={'listTitle'}>信息筛选</div>
        {this.renderSearchForm()}
        <div className={'listTitle'}>信息展示</div>
        {this.renderButtonGroup()}
        {this.renderTable()}
        {this.renderDetailModal()}
        {this.renderReAuthCarModal()}
        {this.renderOperatingResults()}
        {this.renderAuthInfo()}
      </div>
    );
  }

  getCarAuthFormProps = () => {
    return {
      items: [
        {
          type: 'rangePicker',
          fill: true,
          field: 'time',
          label: '授权时间',
          placeholder: ['开始时间', '结束时间'] as [string, string],
          rules: [{ required: true, message: '请输入授权时间!' }],
        },
      ],
      actions: [
        { customtype: 'second', title: '取消', onClick: this.cancelAuthModel },
        {
          customtype: 'select',
          title: '完成',
          // loading: formButtonLoading,
          htmlType: 'submit' as 'submit',
        },
      ],
      onSubmit: this.onCarPassAuthFormSubmit,
      onGetFormRef: (modelForm: WrappedFormUtils) => {
        this.carPassAuthForm = modelForm;
      },
    };
  };

  getDetailModalProps = () => {
    return {
      onCancel: this.cancelModel,
      // visible: this.state.detailModalVisible,
      title: '通行证详情',
      destroyOnClose: true,
      centered: true,
      footer: null,
      maskClosable: true,
      bodyStyle: {},
      width: '65%',
      wrapClassName: classNames('modal', styles.modal),
    };
  };

  getStateBadge = state => {
    switch (state) {
      case '0':
        return 'default';
      case '1':
        return 'success';
      case '2':
        return 'error';
      default:
        return 'default';
    }
  };

  cancelModel = () => {
    this.setState({
      detailModalVisible: false,
    });
  };

  cancelAuthModel = () => {
    this.setState({
      reAuthCarModalVisible: false,
    });
  };

  updateCarPassAuth = () => {
    const { carPassData } = this.props;
    if (carPassData.deviceList && carPassData.deviceList.length <= 0) {
      Message.error(ERROR_IMPOWER);
    } else {
      this.setState({ reAuthCarModalVisible: true });
    }
  };

  updateCarAllPassAuth = async () => {
    const data = await this.props.dispatch({ type: 'permit/updateAllCarPermit' });
    if (data && !data.error) {
      this.getCarPassList({ page: 0 });
    } else if (this.operateResultRef.current) {
      this.operateResultRef.current.open(data);
    }
  };

  async updateCarPass(id) {
    const authInfo = await this.props.dispatch({ type: 'permit/getCarAuthBaseInfo', data: { id } });
    this.setState({
      carPassId: id,
      licenceId: id,
      authInfo,
    });
  }

  carPassDetail = async id => {
    const authInfo = await this.props.dispatch({ type: 'permit/getCarAuthBaseInfo', data: { id } });
    this.setState({
      carPassId: id,
      licenceId: id,
      authInfo,
      detailModalVisible: true,
    });
    // this.getCarPassInfo(id);
  };

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
      this.getCarPassList(fieldsValue);
    });
  };

  getCarPassList = Fileds => {
    const { dispatch } = this.props;
    this.setState({ selectedRowKeys: [] });
    dispatch({ type: 'carPass/getCarPass', payload: { ...Fileds } });
  };

  getCarPassInfo = (id: string) => {
    const { dispatch } = this.props;
    dispatch({ type: 'carPass/getCarPassById', payload: { id: id } });
  };

  onTableChange = (pagination, filters, sorter, extra) => {
    const searchFields = { ...this.state.searchFields };
    searchFields.page = --pagination.current;
    searchFields.size = pagination.pageSize;
    this.getCarPassList(searchFields);
  };

  searchFormReset = () => {
    this.searchForm.resetFields();
    this.setState({
      searchFields: {},
    });
    this.getCarPassList({ page: 0 });
  };

  onTableSelectRow = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys });
  };

  onGetFormRef = (form: WrappedFormUtils) => {
    this.searchForm = form;
  };

  onCarPassAuthFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { dispatch } = this.props;
    this.carPassAuthForm.validateFields(async (err, fieldValues) => {
      if (!err) {
        fieldValues.carPassId = this.state.carPassId;
        if (fieldValues.time) {
          fieldValues.authStartDate = moment(fieldValues.time[0]).format('YYYY-MM-DD HH:mm:ss');
          fieldValues.authEndDate = moment(fieldValues.time[1]).format('YYYY-MM-DD HH:mm:ss');
          delete fieldValues.time;
        }
        const data = await dispatch({
          type: 'carPass/updateCarPassAuth',
          payload: fieldValues,
        });
        if (data.error) {
          this.setState({ operatingResultsVisible: true, batchHandleResultsData: data });
        } else if (data && data.error === 0) {
          this.cancelAuthModel();
          this.getCarPassInfo(this.state.carPassId);
          const searchFields = { ...this.state.searchFields };
          searchFields.page = 0;
          this.getCarPassList(searchFields);
        }
      }
    });
  };
}

export default CarPass;
