import React, { PureComponent, Fragment, RefObject, createRef } from 'react';
import {
  Card,
  Pagination,
  ButtonGroup,
  SearchForm,
  Badge,
  Dropdown,
  Icon,
  Menu,
  CommonComponent,
  Confirm,
  OperatingResults,
  Message,
  Img,
} from '@/components/Library';
import { connect } from '@/utils/decorators';
import { GlobalState, UmiComponentProps, DictionaryEnum } from '@/common/type';
import { PaginationConfig, WrappedFormUtils } from '@/components/Library/type';
import classNames from 'classnames';
import styles from './index.less';
import ParkingSellModal from '../ParkingSellModal';
import { SUCCESS_UNBINDING, SUCCESS_UPDATE, SUCCESS_DELETE } from '@/utils/message';
import AddParkingItemModal from '../AddParkingItemModal';
import ParkingItemDetailModal from '../ParkingItemDetailModal';
import ParkingRenewalModal from '../ParkingRenewalModal';
import TransferParkingSpace from '../TransferParkingSpace';
import noParking from '@/assets/images/noParking.png';
import { isEmpty } from 'lodash';

const mapStateToProps = ({ parkingGlobal, app, parking, loading: { effects } }: GlobalState) => {
  return {
    parkingItemList: parkingGlobal.parkingItemList,
    parkingSellState: app.dictionry[DictionaryEnum.PARKING_SELL_STATE],
    parkingCarList: parking.parkingCarList,
    getParkingItemLoading: effects['parkingGlobal/getParkingItem'],
    addParkingItemLoading: effects['parking/addParkingItem'],
  };
};

type ParkingCardItemListStateProps = ReturnType<typeof mapStateToProps>;

type ParkingCardItemListProps = UmiComponentProps &
  ParkingCardItemListStateProps & {
    parkingLotId: number;
  };
interface ParkingCardItemListState {
  parkingSellModalVisible: boolean;
  parkingItemDetailModalVisible: boolean;
  searchFields: any;
  addParkingItemModal: boolean;
  isGroundAddParkingItem: boolean;
  parkingSpaceId: string;
  searchEnum: string;
  parkingCode: string;
  parkingRenewalModalVisible: boolean;
  transferParkingVisible: boolean;
  parkingItemInfo: any;
  operatingResultsVisible: boolean;
  batchHandleResultsData: {};
}
@connect(
  mapStateToProps,
  null,
)
class ParkingCardItemList extends PureComponent<any, ParkingCardItemListState> {
  confirmRef: RefObject<Confirm> = createRef();
  searchForm: WrappedFormUtils;
  PARKING_ITEM_DETAIL = '1';
  PARKING_SELL = '2';
  BIND_CAR = '3';
  RENT_TO_SELL = '4';
  CHANGE_OWNER = '5';
  UNBIND_OWNER = '6';
  RENEWAL_PARKING = '7';
  PARKING_DELETE = '8';

  saleStateArray = [
    { saleState: '1', color: '#999' },
    { saleState: '2', color: 'blue' },
    { saleState: '3', color: 'orange' },
  ];

  constructor(props: Readonly<ParkingCardItemListProps>) {
    super(props);
    this.state = {
      parkingSellModalVisible: false,
      parkingItemDetailModalVisible: false,
      addParkingItemModal: false,
      isGroundAddParkingItem: false,
      searchFields: {},
      parkingSpaceId: '',
      searchEnum: '',
      parkingCode: '',
      parkingRenewalModalVisible: false,
      transferParkingVisible: false,
      parkingItemInfo: {},
      operatingResultsVisible: false,
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
    this.props.dispatch({
      type: 'app/getDic',
      payload: { type: [DictionaryEnum.PARKING_SELL_STATE].toString() },
    });
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   if (isEqual(nextProps, this.props) && isEqual(nextState, this.state)) {
  //     console.log('nextProps: ', nextProps);
  //     return false;
  //   }
  //   return true;
  // }

  renderButtonGroup() {
    const ButtonGroupProps = {
      actions: [
        {
          customtype: 'master',
          title: '新增',
          onClick: () => this.addPackingItem(false),
          loading: this.props.addParkingItemLoading,
        },
        {
          customtype: 'second',
          title: '批量新增',
          loading: this.props.addParkingItemLoading,
          onClick: () => this.addPackingItem(true),
        },
      ],
    };
    return <ButtonGroup {...ButtonGroupProps} />;
  }

  renderPagination() {
    const { parkingItemList } = this.props;
    if (isEmpty(parkingItemList)) {
      return null;
    }
    const pagination: PaginationConfig = {
      showSizeChanger: parkingItemList.totalElements > 8,
      defaultPageSize: 8,
      pageSizeOptions: ['8', '10', '20', '30', '40', '50', '100'],
      total: parkingItemList.totalElements,
      showTotal: (total, range) => {
        return `${range[1] - range[0] + 1}条/页， 共 ${total} 条`;
      },
      defaultCurrent: 1,
      current: parkingItemList.number + 1,
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
    const { parkingSellState, getParkingItemLoading } = this.props;
    const SearchFormProps = {
      items: [
        {
          type: 'select',
          field: 'searchEnum',
          span: 8,
          children: [{ key: 'PERSON', value: '人员信息' }, { key: 'CODE', value: '车位号' }],
          placeholder: '搜索条件',
          rules: [{ required: true, message: '搜索条件不能为空' }],
          onChange: this.onSearchConditionChange,
        },
        {
          type: 'input',
          field: 'search',
          maxLength: 20,
          disabled: this.state.searchEnum === '',
          placeholder: '关键字',
        },
        { type: 'select', field: 'type', placeholder: '租售状态', children: parkingSellState },
        {
          type: 'select',
          field: 'authEnd',
          placeholder: '是否到期',
          children: [{ key: false, value: '未到期' }, { key: true, value: '已到期' }],
        },
      ],
      actions: [
        {
          customtype: 'select',
          title: '查询',
          maxLength: 20,
          htmlType: 'submit' as 'submit',
          loading: getParkingItemLoading,
        },
        {
          customtype: 'reset',
          title: '重置',
          onClick: this.onReset,
          loading: getParkingItemLoading,
        },
      ],
      columnNumOfRow: 4,
      onSubmit: this.onSearchSubmit,
      onGetFormRef: this.onGetFormRef,
    };
    return <SearchForm className={styles.searchForm} {...SearchFormProps} />;
  }

  renderMenuNoSell(item) {
    return (
      <Menu onClick={e => this.handleMenuClick(item, e)}>
        <Menu.Item key={this.PARKING_ITEM_DETAIL}>
          <Icon type={'pm-details'} />
          查看
        </Menu.Item>
        <Menu.Item key={this.PARKING_SELL}>
          <Icon type={'pay-circle'} />
          租售
        </Menu.Item>
        <Menu.Item key={this.BIND_CAR}>
          <Icon type={'car'} />
          车辆绑定
        </Menu.Item>
        <Menu.Item key={this.PARKING_DELETE}>
          <Icon type={'pm-trash-can'} />
          删除
        </Menu.Item>
      </Menu>
    );
  }

  renderMenuSell(item) {
    return (
      <Menu onClick={e => this.handleMenuClick(item, e)}>
        <Menu.Item key={this.PARKING_ITEM_DETAIL}>
          <Icon type={'pm-details'} />
          查看
        </Menu.Item>
        <Menu.Item key={this.CHANGE_OWNER}>
          <Icon type={'swap'} />
          车位转让
        </Menu.Item>
        <Menu.Item key={this.UNBIND_OWNER}>
          <Icon type={'user'} />
          人员解绑
        </Menu.Item>
        <Menu.Item key={this.BIND_CAR}>
          <Icon type={'car'} />
          车辆绑定
        </Menu.Item>
        <Menu.Item key={this.PARKING_DELETE}>
          <Icon type={'pm-trash-can'} />
          删除
        </Menu.Item>
      </Menu>
    );
  }

  renderMenuRent(item) {
    return (
      <Menu onClick={e => this.handleMenuClick(item, e)}>
        <Menu.Item key={this.PARKING_ITEM_DETAIL}>
          <Icon type={'pm-details'} />
          查看
        </Menu.Item>
        <Menu.Item key={this.RENT_TO_SELL}>
          <Icon type={'transaction'} />
          租转售
        </Menu.Item>
        <Menu.Item key={this.CHANGE_OWNER}>
          <Icon type={'swap'} />
          车位转让
        </Menu.Item>
        <Menu.Item key={this.UNBIND_OWNER}>
          <Icon type={'user'} />
          人员解绑
        </Menu.Item>
        <Menu.Item key={this.BIND_CAR}>
          <Icon type={'car'} />
          车辆绑定
        </Menu.Item>
        <Menu.Item key={this.PARKING_DELETE}>
          <Icon type={'pm-trash-can'} />
          删除
        </Menu.Item>
      </Menu>
    );
  }

  renderMenuRentEnd(item) {
    return (
      <Menu onClick={e => this.handleMenuClick(item, e)}>
        <Menu.Item key={this.PARKING_ITEM_DETAIL}>
          <Icon type={'pm-details'} />
          查看
        </Menu.Item>
        <Menu.Item key={this.BIND_CAR}>
          <Icon type={'car'} />
          车辆绑定
        </Menu.Item>
        <Menu.Item key={this.RENEWAL_PARKING}>
          <Icon type={'account-book'} />
          续期
        </Menu.Item>
        <Menu.Item key={this.UNBIND_OWNER}>
          <Icon type={'user'} />
          人员解绑
        </Menu.Item>
        <Menu.Item key={this.PARKING_DELETE}>
          <Icon type={'pm-trash-can'} />
          删除
        </Menu.Item>
      </Menu>
    );
  }

  renderList() {
    const { parkingItemList } = this.props;
    if (isEmpty(parkingItemList)) {
      return null;
    }
    return (
      <div className={classNames(styles.parking, 'flexColStart', 'flexWrap')}>
        <div className={classNames('flexStart', 'flexWrap')}>
          {parkingItemList.content &&
            parkingItemList.content.map(item => {
              const saleState = this.saleStateArray.find(
                saleState => saleState.saleState === item.saleState,
              ) || { color: '#000' };
              return (
                <Card
                  hoverable
                  className={classNames(styles.parkingItem, 'flexColBetween')}
                  key={item.parkingSpaceId}
                >
                  <div className={classNames(styles.cardHeard, 'flexBetween', 'itemCenter')}>
                    <div className={classNames('flexStart', 'itemCenter')}>
                      <Badge color={saleState.color} text={item.saleStateStr} />
                      <span className={styles.split}>|</span>
                      <div>{item.code}</div>
                    </div>
                    <Dropdown
                      overlay={this.chooseMenu(item)}
                      placement={'bottomRight'}
                      trigger={['click']}
                      className={styles.dropDown}
                      overlayClassName={styles.overlay}
                    >
                      <div>
                        <Icon type={'pm-more'} />
                      </div>
                    </Dropdown>
                  </div>
                  <div
                    className={classNames(
                      styles.cardContent,
                      'flexColCenter',
                      'itemCenter',
                      'flexAuto',
                    )}
                    // onClick={() => this.parkingDetail(item.parkingSpaceId)}
                  >
                    <div className={classNames(styles.parkingNumber)}>
                      {CommonComponent.renderTableOverFlowHidden(
                        item.carList ? item.carList.join('/') : '无绑定车辆',
                      )}
                    </div>
                    <div className={classNames(styles.deadline)}>
                      <span
                        className={classNames(
                          styles.imagedeadMark,
                          item.authEnd ? 'redColor' : 'garyColor',
                        )}
                      >
                        到期
                      </span>
                      {item.endTime ? item.endTime : '无'}
                    </div>
                  </div>
                  <div
                    className={classNames(
                      styles.cardFooter,
                      'flexCenter',
                      'itemCenter',
                      this.getCardFooterBgColor(item.parkingState),
                    )}
                  >
                    {item.parkingStateStr}
                  </div>
                </Card>
              );
            })}
          {(!parkingItemList.content || parkingItemList.content.length === 0) && (
            <div className={classNames('flexColCenter', 'itemCenter', 'flexAuto')}>
              <Img image={noParking} className={styles.noParkingImg} />
              <div className={styles.tip}>暂无数据，请点击上方[新增]/[批量新增]停车位</div>
            </div>
          )}
        </div>
      </div>
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
  onCancelOperatingResults = () => {
    this.setState({ operatingResultsVisible: false });
  };

  render() {
    const {
      parkingSpaceId,
      parkingRenewalModalVisible,
      transferParkingVisible,
      parkingItemInfo,
    } = this.state;
    console.log('parkingItemInfo: ', parkingItemInfo);

    return (
      <Fragment>
        <div className={'listTitle'}>信息筛选</div>
        {this.renderSearchForm()}
        <div className={classNames(styles.table, 'flexColStart')}>
          <div className={'listTitle'}>信息展示</div>
          <div className={classNames(styles.parkingSpace, 'flexColStart')}>
            {this.renderButtonGroup()}
            {this.renderList()}
            {this.renderPagination()}
          </div>
        </div>
        <AddParkingItemModal
          modalVisible={this.state.addParkingItemModal}
          isGroupAdd={this.state.isGroundAddParkingItem}
          cancelModel={this.cancelModel}
          reGetList={this.reGetList}
          parkingLotId={this.props.parkingLotId}
        />
        <ParkingSellModal
          parkingCode={this.state.parkingCode}
          cancelModel={this.cancelSellModal}
          modalVisible={this.state.parkingSellModalVisible}
          reGetList={this.reGetList}
          parkingSpaceId={this.state.parkingSpaceId}
        />
        <ParkingItemDetailModal
          cancelModel={this.cancelModel}
          modalVisible={this.state.parkingItemDetailModalVisible}
          parkingSpaceId={this.state.parkingSpaceId}
          sellParking={this.sellParking}
          reGetList={this.reGetList}
        />
        <ParkingRenewalModal
          reGetList={this.reGetList}
          cancelModal={this.cancelModel}
          modalVisible={parkingRenewalModalVisible}
          timeLine={[parkingItemInfo.startTime, parkingItemInfo.endTime]}
          parkingSpaceId={this.state.parkingSpaceId}
        />
        <Confirm type={'warning'} ref={this.confirmRef} />
        <TransferParkingSpace
          onCancel={this.cancelModel}
          parkingSpaceId={parkingSpaceId}
          visible={transferParkingVisible}
        />
        {this.renderOperatingResults()}
      </Fragment>
    );
  }

  chooseMenu = item => {
    if (item.saleState === '1') {
      return this.renderMenuNoSell(item);
    } else if (item.saleState === '2') {
      return this.renderMenuSell(item);
    } else if (item.saleState === '3' && item.authEnd) {
      return this.renderMenuRentEnd(item);
    }
    return this.renderMenuRent(item);
  };

  handleMenuClick = (item, e) => {
    const { dispatch } = this.props;
    switch (e.key) {
      case this.PARKING_ITEM_DETAIL:
        this.parkingDetail(item.parkingSpaceId);
        break;
      case this.PARKING_SELL:
        this.sellParking(item.parkingSpaceId, item.code);
        break;
      case this.BIND_CAR:
        this.parkingDetail(item.parkingSpaceId);
        break;
      case this.UNBIND_OWNER:
        if (this.confirmRef.current) {
          this.confirmRef.current.open(
            async () => {
              const res = await dispatch({
                type: 'parking/unbindParkingItemPerson',
                payload: { parkingSpaceId: item.parkingSpaceId },
              });
              if (res && res.success) {
                Message.success(SUCCESS_UNBINDING);
                this.reGetList();
              }
            },
            '请注意',
            '是否确认解绑人员？',
          );
        }
        break;
      case this.RENEWAL_PARKING:
        this.setState({ parkingRenewalModalVisible: true, parkingItemInfo: item });
        break;
      case this.RENT_TO_SELL:
        if (this.confirmRef.current) {
          this.confirmRef.current.open(
            async () => {
              const res = await dispatch({
                type: 'parking/resellParkingItem',
                payload: { parkingSpaceId: item.parkingSpaceId },
              });
              if (res && res.success) {
                Message.success(SUCCESS_UPDATE);
                this.reGetList();
              }
            },
            '请注意',
            '是否确认车位变更为已售？',
          );
        }
        break;
      case this.CHANGE_OWNER:
        this.setState({
          transferParkingVisible: true,
        });
        break;
      case this.PARKING_DELETE:
        if (this.confirmRef.current) {
          this.confirmRef.current.open(
            async () => {
              const res = await dispatch({
                type: 'parking/deleteParkingItem',
                payload: [item.parkingSpaceId],
              });
              if (res && res.data && !res.data.error) {
                Message.success(SUCCESS_DELETE);
                this.reGetList();
              } else {
                this.setState({
                  operatingResultsVisible: true,
                  batchHandleResultsData: res.data,
                });
              }
            },
            '请注意',
            '是否确认删除车位？',
          );
        }
        break;
      default:
    }
  };

  onReset = () => {
    this.searchForm.resetFields();
    this.setState({
      searchFields: {},
    });
    this.getList({ page: 0 });
  };

  onSearchConditionChange = (value, _item) => {
    this.setState({
      searchEnum: value,
    });
  };

  onSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (e) {
      e.preventDefault();
    }
    this.searchForm.validateFields((err, fieldsValue) => {
      console.log('fieldsValue: ', fieldsValue);
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

  addPackingItem = group => {
    if (group) {
      this.setState({
        addParkingItemModal: true,
        isGroundAddParkingItem: true,
      });
    } else {
      this.setState({
        addParkingItemModal: true,
        isGroundAddParkingItem: false,
      });
    }
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
    dispatch({ type: 'parkingGlobal/getParkingItem', payload: fields });
  };

  reGetList = () => {
    const { parkingItemList } = this.props;
    const searchFields = { ...this.state.searchFields };
    searchFields.page = parkingItemList.number;
    searchFields.size = parkingItemList.size;
    this.getList(searchFields);
  };

  sellParking = (id, code) => {
    this.setState({
      parkingCode: code,
      parkingSpaceId: id,
      parkingSellModalVisible: true,
    });
  };

  parkingDetail = async id => {
    await this.props.dispatch({ type: 'parking/getParkingItemById', payload: { id } });
    this.setState({
      parkingSpaceId: id,
      parkingItemDetailModalVisible: true,
    });
  };

  cancelSellModal = () => {
    this.setState({
      parkingSellModalVisible: false,
    });
  };

  cancelModel = () => {
    this.setState({
      parkingSellModalVisible: false,
      parkingItemDetailModalVisible: false,
      transferParkingVisible: false,
      parkingRenewalModalVisible: false,
      addParkingItemModal: false,
      isGroundAddParkingItem: false,
    });
  };

  getCardFooterBgColor = parkingState => {
    switch (parkingState) {
      case '1':
        return 'greenBgColor';
      case '2':
        return 'redBgColor';
      default:
        return 'garyBgColor';
    }
  };
}
export default ParkingCardItemList;
