import React, { Component, RefObject, createRef } from 'react';
import styles from './index.less';
import HouseTree from '../HouseTree';
import { HouseBaseInfo } from '../../../House/model';
import { EPersonType } from '../PerosonForm';
import {
  Table,
  CommonComponent,
  Img,
  Message,
  Button,
  ModalDetail,
  Input,
  Spin,
} from '@/components/Library';
import { ColumnProps, PaginationConfig } from '@/components/Library/type';
import { ERROR_SELECT_GUARDIAN } from '@/utils/message';
import { PersonBaseInfo } from '@/models/person';
import classNames from 'classnames';

interface HouseData {
  code: string;
  id: number;
  isLeaf: string;
  key: string;
  name: string;
  title: string;
}

interface Props {
  dispatch: Function;
  getHouseLoading?: boolean;
  personType?: EPersonType;
}

interface State {
  houseData: HouseBaseInfo | null;
  error: false;
  tableData: any[];
  detailVisible: boolean;
  inputValue: string;
  selectedRowKeys: string[];
  pageOption: {
    page: number;
    total: number;
    size: number;
  };
  treeDataLoading: boolean;
}

export default class HouseSelectorForm extends Component<Props, State> {
  treeRef: RefObject<HouseTree>;

  searchForm: any;

  queryCondition: {
    name?: '';
  };

  selectedPerson: PersonBaseInfo;

  constructor(props) {
    super(props);
    this.treeRef = createRef();
    this.state = {
      selectedRowKeys: [],
      houseData: null,
      error: false,
      detailVisible: false,
      tableData: [],
      inputValue: '',
      pageOption: {
        page: 0,
        total: 0,
        size: 10,
      },
      treeDataLoading: true,
    };
  }

  componentDidMount() {
    this.onChangePage(1);
    this.reset();
    this.onChangePage(1);
  }

  reset() {
    if (this.treeRef.current) {
      this.treeRef.current.getTreeData();
    }
    this.setState({
      error: false,
    });
    this.onReset();
  }

  setSelectValue = async (value: HouseData[]) => {
    this.setState({ treeDataLoading: false });
    if (!value) {
      return;
    }
    const house = value[2];
    if (!house) {
      return;
    }
    const data: any = await this.props.dispatch({ type: 'person/getHouse', id: house.id });
    data.unitId = value[1].id;
    data.buildingId = value[0].id;
    this.setState({
      houseData: data,
    });
  };

  submit = async () => {
    const { personType } = this.props;
    const { houseData } = this.state;
    if (personType === EPersonType.owner) {
      if (!houseData) {
        return Promise.resolve();
      } else {
        return Promise.resolve(houseData);
      }
    } else if (personType === EPersonType.child) {
      if (this.selectedPerson) {
        return Promise.resolve(this.selectedPerson);
      } else {
        Message.info(ERROR_SELECT_GUARDIAN);
        return Promise.resolve(false);
      }
    }
  };

  onChangePage = async (page: number, pageSize: number = 10) => {
    const { pageOption, inputValue } = this.state;
    const { dispatch } = this.props;
    const data = await dispatch({
      type: 'person/getList',
      pageOption: { page: page - 1, size: pageSize, name: inputValue, isAdult: true },
    });
    if (!data) {
      return;
    }
    this.setState({
      tableData: data.content,
      pageOption: {
        ...pageOption,
        page,
        size: pageSize,
        total: data.totalElements,
      },
    });
  };

  tableOnChange = (pagination: PaginationConfig) => {
    this.onChangePage(pagination.current || 1, pagination.pageSize || 10);
  };

  selectGuardian = ([id]) => {
    const { tableData } = this.state;
    this.setState({
      selectedRowKeys: [id],
    });
    this.selectedPerson = tableData.find(v => v.subId === id);
  };

  onRowClick = (record, index, e) => {
    this.selectGuardian([record.subId ? record.subId : index]);
  };

  renderTable() {
    const { tableData, pageOption, selectedRowKeys } = this.state;
    const columns: ColumnProps<any>[] = [
      {
        title: '证件照',
        width: '18%',
        dataIndex: 'bpIdCardImageUrl',
        key: 'bpIdCardImageUrl',
        render: (text: any, record: object) => <Img image={text} previewImg={true} />,
      },
      {
        title: '姓名',
        width: '18%',
        dataIndex: 'name',
        key: 'name',
        render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '联系电话',
        width: '18%',
        key: 'phone',
        dataIndex: 'phone',
        render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '地址',
        width: '18%',
        key: 'unitCode',
        dataIndex: 'unitCode',
        render: (text: any, record: any) =>
          CommonComponent.renderTableCol(
            `${record.buildingCode}栋${record.unitCode}单元${record.houseCode}`,
            record,
          ),
      },
      {
        title: '登记时间',
        width: '18%',
        key: 'tCreateTime',
        dataIndex: 'tCreateTime',
        render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      },
    ];
    const pagination: PaginationConfig = {
      position: 'bottom',
      total: pageOption.total,
      pageSize: pageOption.size,
      current: pageOption.page,
      defaultCurrent: pageOption.page,
      // onChange: this.onChangePage,
    };
    return (
      <Table
        rowKey={'subId'}
        columns={columns}
        dataSource={tableData}
        scroll={{ y: '100%' }}
        pagination={pagination}
        type={'radio'}
        onChange={this.tableOnChange}
        onSelectRow={this.selectGuardian}
        selectedRow={selectedRowKeys}
        onRowClick={this.onRowClick}
      />
    );
  }

  renderSearchForm() {
    const { inputValue } = this.state;
    return (
      <div className={styles.searchInput}>
        姓名：
        <Input
          value={inputValue}
          onInput={(v: any) => this.setState({ inputValue: v.target.value })}
        />
        <Button customtype={'master'} onClick={() => this.onChangePage(1)}>
          查询
        </Button>
        <Button customtype={'second'} style={{ marginLeft: '8px' }} onClick={this.onReset}>
          重置
        </Button>
      </div>
    );
  }

  renderDetailModal() {
    const { detailVisible, houseData } = this.state;
    const baseInfo: any = houseData || {};
    const props = {
      items: [
        {
          name: '户主姓名',
          value: baseInfo.personName,
        },
        {
          name: '户主联系电话',
          value: baseInfo.personPhone,
        },
        {
          name: '楼栋编号',
          value: baseInfo.buildingCode + '栋',
        },
        {
          name: '单元编号',
          value: baseInfo.unitCode + '单元',
        },
        {
          name: '房屋楼层',
          value: baseInfo.floor,
        },
        {
          name: '门牌号',
          value: baseInfo.buildingCode + '栋-' + baseInfo.code + '室',
        },
        {
          name: '房屋状态',
          value: baseInfo.useTypeStr,
        },
      ],
      info: baseInfo || {},
      visible: detailVisible,
      onCancel: this.onCancelDetailModel,
      title: '房屋详情',
    };

    return <ModalDetail {...props} />;
  }

  renderSelectHouse() {
    const { dispatch, personType, getHouseLoading } = this.props;
    const { houseData, treeDataLoading } = this.state;
    return (
      <div className={styles.houseSelectorForm}>
        {this.renderDetailModal()}
        <Spin spinning={treeDataLoading} wrapperClassName={styles.treeLoading}>
          <HouseTree dispatch={dispatch} setSelectValue={this.setSelectValue} />
        </Spin>
        {personType === EPersonType.owner && (
          <div className={styles.selectHouseInfo}>
            <div className={styles.houseinfo}>
              <div className={styles.item}>
                房屋地址：
                {houseData
                  ? `${houseData.buildingCode}栋${houseData.unitCode}单元${houseData.code}室`
                  : ''}
              </div>
              <div className={styles.item}>户主姓名：{houseData ? houseData.personName : ''}</div>
              <div className={styles.item}>户主电话：{houseData ? houseData.personPhone : ''}</div>
              <div className={styles.item}>
                <Button
                  customtype={'master'}
                  onClick={this.openHouseDetail}
                  loading={getHouseLoading}
                >
                  查看房屋详情
                </Button>{' '}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  renderSelectGuardian() {
    const { personType } = this.props;
    return (
      <div className={classNames(styles.houseSelectorForm, styles.table)}>
        {this.renderSearchForm()}
        {personType === EPersonType.child && this.renderTable()}
      </div>
    );
  }

  render() {
    const { personType } = this.props;
    if (personType === EPersonType.child) {
      return this.renderSelectGuardian();
    } else {
      return this.renderSelectHouse();
    }
  }

  openHouseDetail = () => {
    this.setState({
      detailVisible: true,
    });
  };

  onCancelDetailModel = () => {
    this.setState({
      detailVisible: false,
    });
  };

  onReset = () => {
    if (this.props.personType === EPersonType.child) {
      this.setState(
        {
          inputValue: '',
        },
        () => {
          this.onChangePage(1);
        },
      );
    }
  };
}
