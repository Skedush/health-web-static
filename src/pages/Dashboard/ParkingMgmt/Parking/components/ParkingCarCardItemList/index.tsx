import React, { PureComponent, Fragment, RefObject, createRef } from 'react';
import {
  Card,
  Pagination,
  ButtonGroup,
  SearchForm,
  ModalDetail,
  Confirm,
  Message,
  OperatingResults,
} from '@/components/Library';
import { connect } from '@/utils/decorators';
import { GlobalState, UmiComponentProps } from '@/common/type';
import { PaginationConfig, WrappedFormUtils } from '@/components/Library/type';
import classNames from 'classnames';
import { SUCCESS_UNBINDING } from '@/utils/message';
import styles from './index.less';
import BindingCarModal from '../BindingCarModal';

const mapStateToProps = ({ parking, loading: { effects } }: GlobalState) => {
  return {
    parkingCarList: parking.parkingCarList,
    carDetail: parking.carDetail,
    loading: {
      getParkingCarListLoading: effects['parking/getParkingCarList'],
    },
  };
};

type ParkingCarCardItemListStateProps = ReturnType<typeof mapStateToProps>;

type ParkingCarCardItemListProps = UmiComponentProps &
  ParkingCarCardItemListStateProps & {
    parkingLotId: number;
    parkingName: string;
  };
interface ParkingCarCardItemListState {
  searchFields: any;
  carDetailModal: boolean;
  operatingResultsVisible: boolean;
  bindingCarModalVisible: boolean;
  batchHandleResultsData: any;
}
@connect(
  mapStateToProps,
  null,
)
class ParkingCarCardItemList extends PureComponent<any, ParkingCarCardItemListState> {
  searchForm: WrappedFormUtils;
  confirmRef: RefObject<Confirm> = createRef();

  constructor(props: Readonly<ParkingCarCardItemListProps>) {
    super(props);
    this.state = {
      searchFields: {},
      carDetailModal: false,
      operatingResultsVisible: false,
      bindingCarModalVisible: false,
      batchHandleResultsData: {},
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.parkingLotId !== this.props.parkingLotId) {
      this.onReset();
      // this.getList({ page: 0 });
    }
  }

  componentDidMount() {
    this.getList({ page: 0 });
  }

  renderButtonGroup() {
    const ButtonGroupProps = {
      actions: [
        {
          customtype: 'master',
          title: '车辆绑定',
          onClick: this.bindingCar,
        },
      ],
    };
    return <ButtonGroup {...ButtonGroupProps} />;
  }

  renderPagination() {
    const { parkingCarList } = this.props;
    const pagination: PaginationConfig = {
      showSizeChanger: parkingCarList.totalElements > 8,
      total: parkingCarList.totalElements,
      defaultPageSize: 8,
      pageSizeOptions: ['8', '10', '20', '30', '40', '50', '100'],
      showTotal: (total, range) => {
        return `${range[1] - range[0] + 1}条/页， 共 ${total} 条`;
      },
      defaultCurrent: 1,
      current: parkingCarList.number + 1,
      onShowSizeChange: this.onShowSizeChange,
      onChange: this.onChangePage,
    };
    return (
      <div className={styles.paginationBox}>
        <Pagination {...pagination} />
      </div>
    );
  }

  renderSearchForm() {
    const SearchFormProps = {
      items: [
        {
          type: 'input',
          field: 'licensePlate',
          placeholder: '车牌号、手机号码',
          maxLength: 20,
        },
      ],
      actions: [
        {
          customtype: 'select',
          title: '查询',
          maxLength: 20,
          htmlType: 'submit' as 'submit',
          loading: this.props.loading.getParkingCarListLoading,
        },
        {
          customtype: 'reset',
          title: '重置',
          onClick: this.onReset,
          loading: this.props.loading.getParkingCarListLoading,
        },
      ],
      columnNumOfRow: 4,
      onSubmit: this.onSearchSubmit,
      onGetFormRef: this.onGetFormRef,
    };
    return <SearchForm className={styles.searchForm} {...SearchFormProps} />;
  }

  renderModalDetail() {
    const { carDetail = {} } = this.props;
    const { carDetailModal } = this.state;
    const props = {
      items: [
        {
          name: '关联人员',
          value: carDetail.ownerName,
        },
        {
          name: '联系电话',
          value: carDetail.ownerPhone,
        },
        // {
        //   name: '身份证号',
        //   value: carDetail.idCard,
        // },
        {
          name: '车牌号',
          value: carDetail.licensePlate,
        },
        {
          name: '品牌',
          value: carDetail.brand,
        },
        {
          name: '颜色',
          value: carDetail.color,
        },
        {
          name: '车辆类型',
          value: carDetail.typeStr,
        },
        {
          name: '备注',
          value: carDetail.remark,
        },
      ],
      actions: [
        { customtype: 'select', title: '车辆解绑', maxLength: 20, onClick: this.unBindingCar },
      ],
      info: carDetail || {},
      visible: carDetailModal,
      onCancel: this.onCancelModel,
      title: '车辆详情',
    };

    return <ModalDetail {...props} />;
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
    const { parkingCarList } = this.props;
    console.log('parkingCarList: ', parkingCarList);
    return (
      <Fragment>
        <div className={'listTitle'}>信息筛选</div>
        {this.renderSearchForm()}
        <div className={classNames(styles.table, 'flexColStart')}>
          <div className={'listTitle'}>信息展示</div>
          <div className={classNames(styles.parkingSpace, 'flexColStart')}>
            {this.renderButtonGroup()}
            <div className={classNames(styles.parking, 'flexColStart', 'flexWrap')}>
              <div className={classNames('flexStart', 'flexWrap')}>
                {parkingCarList &&
                  parkingCarList.content &&
                  parkingCarList.content.map(item => (
                    <Card
                      hoverable
                      className={classNames(styles.parkingItem, 'flexColBetween')}
                      key={item.id}
                      onClick={() => this.carDetail(item.carId)}
                    >
                      <div className={classNames(styles.cardHeard, 'flexEnd', 'itemCenter')}>
                        <div
                          className={classNames(
                            styles.parkingMark,
                            item.saleState === '1' ? 'garyBgColor' : 'blueBgColor',
                          )}
                        >
                          {item.brand}
                        </div>
                      </div>
                      <div
                        className={classNames(styles.cardContent, 'flexColCenter', 'itemCenter')}
                      >
                        <div className={classNames(styles.parkingNumber)}>{item.licensePlate}</div>
                        <div className={classNames(styles.deadline)}>
                          <span
                            className={classNames(
                              styles.deadMark,
                              item.authEnd ? 'redColor' : 'garyColor',
                            )}
                          >
                            车主信息:
                          </span>
                          {`${item.personName}-${item.personPhone}`}
                        </div>
                      </div>
                      <div
                        className={classNames(
                          styles.cardFooter,
                          'flexCenter',
                          'itemCenter',
                          this.getCardFooterBgColor(item.type),
                        )}
                      >
                        {item.typeStr}
                      </div>
                    </Card>
                  ))}
              </div>
            </div>
            {this.renderPagination()}
          </div>
        </div>
        {this.renderModalDetail()}
        <Confirm type={'warning'} ref={this.confirmRef} />
        {this.renderOperatingResults()}

        <BindingCarModal
          parkingLotId={this.props.parkingLotId}
          parkingName={this.props.parkingName}
          modalVisible={this.state.bindingCarModalVisible}
          reGetList={this.reGetList}
          cancelModel={this.cancelCarBindingModal}
        />
      </Fragment>
    );
  }

  getCardFooterBgColor = type => {
    switch (type) {
      case '1':
        return 'blueBgColor';
      case '2':
        return 'greenBgColor';
      case '3':
        return 'yellowBgColor';
      default:
        return 'garyBgColor';
    }
  };

  bindingCar = () => {
    this.setState({
      bindingCarModalVisible: true,
    });
  };

  onCancelOperatingResults = () => {
    this.setState({ operatingResultsVisible: false });
  };

  cancelCarBindingModal = () => {
    this.setState({
      bindingCarModalVisible: false,
    });
  };

  getNotInParkingCarData = fields => {
    this.props.dispatch({ type: 'parking/getNotInParkingCar', payload: { ...fields } });
  };

  unBindingCar = () => {
    const { carDetail, dispatch } = this.props;
    if (this.confirmRef.current) {
      this.confirmRef.current.open(
        async () => {
          const res = await dispatch({
            type: 'parking/unbindingParkingForCar',
            payload: { parkingLotId: this.props.parkingLotId, carId: carDetail.carId },
          });
          if (res && res.success) {
            this.getNotInParkingCarData({ page: 0, parkingLotId: this.props.parkingLotId });
            Message.success(SUCCESS_UNBINDING);
            this.onCancelModel();
            this.reGetList();
          } else {
          }
        },
        '车辆解绑',
        '确定要解绑该车辆吗？',
      );
    }
  };

  onReset = () => {
    this.searchForm.resetFields();
    this.setState({
      searchFields: {},
    });
    this.getList({ page: 0 });
  };

  onSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (e) {
      e.preventDefault();
    }
    this.searchForm.validateFields((err, fieldsValue) => {
      if (err) return;
      this.setState({
        searchFields: { ...fieldsValue },
      });
      fieldsValue.page = 0;
      this.getList(fieldsValue);
    });
  };

  onGetFormRef = form => {
    this.searchForm = form;
  };

  onChangePage = (page: number, size: number) => {
    const searchFields = { ...this.state.searchFields };
    searchFields.page = page - 1;
    searchFields.size = size;
    this.getList(searchFields);
  };

  onShowSizeChange = (current, pageSize) => {
    const searchFields = { ...this.state.searchFields };
    searchFields.page = current - 1;
    searchFields.size = pageSize;
    this.getList(searchFields);
  };

  getList = fields => {
    const { dispatch } = this.props;
    fields.parkingLotId = this.props.parkingLotId;
    if (!fields.size) fields.size = 8;
    dispatch({ type: 'parking/getParkingCarList', payload: fields });
  };

  reGetList = () => {
    const { parkingCarList } = this.props;
    const searchFields = { ...this.state.searchFields };
    searchFields.page = parkingCarList.number;
    searchFields.size = parkingCarList.size;
    this.getList(searchFields);
  };

  carDetail = id => {
    this.props.dispatch({ type: 'parking/getCarForId', payload: { id: id } });
    this.setState({
      carDetailModal: true,
    });
  };

  onCancelModel = () => {
    this.setState({
      carDetailModal: false,
    });
  };
}
export default ParkingCarCardItemList;
