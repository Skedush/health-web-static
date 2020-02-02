import React, { PureComponent, RefObject, createRef } from 'react';

import styles from './index.less';
import { connect } from '@/utils/decorators';
import classNames from 'classnames';
import moment from 'moment';
import {
  SearchForm,
  ButtonGroup,
  Card,
  ModalForm,
  Pagination,
  Message,
  Confirm,
  ModalDetail,
  OperatingResults,
  Spin,
} from '@/components/Library';
import {
  FormComponentProps,
  UploadFile,
  WrappedFormUtils,
  PaginationConfig,
} from '@/components/Library/type';

import { GlobalState, UmiComponentProps, DictionaryEnum } from '@/common/type';
import nodata from '@/assets/images/nodata.png';
import { isPhone } from '@/utils/validater';
import { SEARCH_INPUT_MAX_LENGTH } from '@/utils/constant';
import { isEmpty } from 'lodash';

// import { CompanyBaseInfo } from './model';
const mapStateToProps = ({
  loading,
  communtyInfo: { baseInfo, personInfo, cascaderOption, companyInfo },
  app: { dictionry },
}: GlobalState) => ({
  loading: loading.effects['communtyInfo/getCompany'],
  addCompanyLoading: loading.effects['communtyInfo/addCompany'],
  updateCompanyLoading: loading.effects['communtyInfo/updateCompany'],
  baseInfo,
  personInfo,
  companyInfo,
  cascaderOption,
  companyStatus: dictionry[DictionaryEnum.COMPANY_TYPR],
});
type UnitStateProps = ReturnType<typeof mapStateToProps>;
type UnitProps = UnitStateProps & UmiComponentProps & FormComponentProps;
// type onUploadChange = (info: UploadChangeParam) => void;

interface UnitState {
  fileList: UploadFile[];
  fieldFileList: UploadFile[];
  idCardFileList: UploadFile[];
  add: boolean;
  modify: boolean;
  companyDetailsModalVisible: boolean;
  result?: any;
  searchFields: { [propName: string]: any };
  personSearchFields: { [propName: string]: any };
  checked: number[];
  companyId: number;
  selectedRowKeys: number[];
  personDetail: { [propName: string]: any };
  companyName: string;
  personId: number;
  operatingResultsVisible: boolean;
  batchHandleResultsData: { [propName: string]: any };
}

@connect(
  mapStateToProps,
  null,
)
class Unit extends PureComponent<UnitProps, UnitState> {
  searchForm: WrappedFormUtils;
  modelForm: WrappedFormUtils;
  personAddModelForm: WrappedFormUtils;
  personModelForm: WrappedFormUtils;
  confirmRef: RefObject<Confirm>;

  constructor(props: Readonly<UnitProps>) {
    super(props);
    // this.props.dispatch({ type: 'communtyInfo/getCommuntyInfo' });
    this.confirmRef = createRef();
    this.state = {
      fileList: [],
      add: false,
      modify: false,
      companyDetailsModalVisible: false,
      result: null,
      searchFields: {},
      personSearchFields: {},
      checked: [],
      companyId: 0,
      selectedRowKeys: [],
      fieldFileList: [],
      personDetail: {},
      idCardFileList: [],
      companyName: '',
      personId: 0,
      operatingResultsVisible: false,
      batchHandleResultsData: {},
    };
  }

  componentDidMount() {
    this.getCompanyData({ page: 0 });
    this.getDic();
  }

  renderSearchForm() {
    const { companyStatus } = this.props;
    const SearchFormProps = {
      items: [
        {
          type: 'input',
          field: 'name',
          placeholder: '商户名称',
          maxLength: SEARCH_INPUT_MAX_LENGTH,
        },
        {
          type: 'select',
          field: 'tradeType',
          placeholder: '商户类型',
          children: companyStatus,
        },
        {
          type: 'input',
          field: 'phone',
          placeholder: '联系电话',
          maxLength: SEARCH_INPUT_MAX_LENGTH,
        },
        {
          type: 'input',
          field: 'liaisonName',
          placeholder: '负责人',
          maxLength: SEARCH_INPUT_MAX_LENGTH,
        },
      ],
      actions: [
        {
          customtype: 'select',
          title: '查询',
          loading: this.props.loading,
          htmlType: 'submit' as 'submit',
        },
        { customtype: 'reset', title: '重置', onClick: this.searchFormReset },
      ],
      columnNumOfRow: 4,
      onSubmit: this.onSearch,
      onGetFormRef: this.onGetFormRef,
    };
    return <SearchForm {...SearchFormProps} />;
  }

  renderButtonGroup() {
    const ButtonGroupProps = {
      actions: [
        { customtype: 'master', title: '新增', onClick: this.addCompanyInfo },
        // { customtype: 'warning', title: '删除', onClick: this.deleteCompany },
      ],
    };
    return <ButtonGroup {...ButtonGroupProps} />;
  }

  renderCompanyList() {
    const { baseInfo } = this.props;
    if (!baseInfo || isEmpty(baseInfo)) {
      return;
    }
    const { content } = baseInfo;

    return (
      <div className={styles.cardTable}>
        <Spin spinning={!!this.props.loading}>
          {content &&
            (content.length > 0 ? (
              content.map(item => {
                // const isChecked = checked.findIndex(item2 => item2 === item.id) !== -1;
                return (
                  <Card
                    className={classNames(styles.cardBase)}
                    hoverable
                    key={item.id}
                    onClick={() => this.onCampanyInfo(item.id)}
                    cover={
                      <div className={styles.companyCover}>
                        <img src={item.masterImage} />
                      </div>
                    }
                  >
                    <div className={styles.companyMsg}>
                      <div className={styles.name}>{item.name}</div>
                      <div className={styles.time}>{item.registerTime}</div>
                    </div>
                    <div className={styles.compantAddress}>
                      <div className={styles.address}>{item.address}</div>
                      <div className={styles.tradeTypeStr}>{item.tradeTypeStr}</div>
                    </div>
                  </Card>
                );
              })
            ) : (
              <div className={styles.noData}>
                <img src={nodata} />
                <div>暂无数据</div>
              </div>
            ))}
        </Spin>
      </div>
    );
  }

  renderPagination() {
    const { baseInfo } = this.props;
    if (!baseInfo || isEmpty(baseInfo)) {
      return;
    }
    const pagination: PaginationConfig = {
      showSizeChanger: false,
      total: baseInfo.totalElements,
      showTotal: (total, range) => {
        return `${range[1] - range[0] + 1}条/页， 共 ${total} 条`;
      },
      defaultCurrent: 1,
      onShowSizeChange: this.onShowSizeChange,
      onChange: this.onChangePage,
    };
    return (
      <div className={styles.paginationBox}>
        <div
          style={{
            color: '#999',
          }}
        >
          已选中{this.state.checked.length}条
        </div>
        <Pagination {...pagination} />
      </div>
    );
  }

  // eslint-disable-next-line max-lines-per-function
  renderItems() {
    const { companyStatus } = this.props;
    let { companyInfo = {} } = this.props;
    if (this.state.add) {
      companyInfo = {};
    }
    return [
      {
        type: 'upload',
        field: 'image',
        initialValue: companyInfo.masterImage,
        placeholder: '门店照片',
        onChange: this.onFileChange,
        fileList: this.state.fileList,
        fill: true,
        maxFiles: 1,
      },
      {
        type: 'input',
        field: 'name',
        initialValue: companyInfo.name,
        placeholder: '商户名称',
        rules: [{ required: true, message: '请输入商户名称!' }],
        maxLength: 50,
      },
      {
        type: 'select',
        field: 'tradeType',
        initialValue: companyInfo.tradeType,
        placeholder: '商户类型',
        children: companyStatus,
        rules: [{ required: true, message: '请选择商户类型!' }],
      },
      {
        type: 'input',
        field: 'juridicalPersonName',
        initialValue: companyInfo.juridicalPersonName,
        placeholder: '法人姓名',
        maxLength: 20,
      },
      {
        type: 'input',
        field: 'liaisonName',
        initialValue: companyInfo.liaisonName,
        placeholder: '商户负责人',
        rules: [{ required: true, message: '请输入商户负责人!' }],
        maxLength: 20,
      },
      {
        type: 'input',
        field: 'liaisonPhone',
        initialValue: companyInfo.liaisonPhone,
        placeholder: '负责人联系电话',
        rules: [
          { required: true, message: '请输入联系电话!' },
          {
            validator: isPhone,
          },
        ],
        maxLength: 18,
      },
      {
        type: 'input',
        field: 'companyCode',
        initialValue: companyInfo.companyCode,
        placeholder: '统一社会信用代码',
        maxLength: 18,
      },
      {
        type: 'input',
        field: 'address',
        initialValue: companyInfo.address,
        placeholder: '商户地址',
        // cascaderOption: cascaderOption,
        rules: [{ required: true, message: '请输入商户地址!' }],
      },
      {
        type: 'textArea',
        field: 'remark',
        placeholder: '备注',
        fill: true,
        initialValue: companyInfo.remark,
        maxLength: 150,
      },
    ];
  }

  renderModel() {
    const { modify } = this.state;
    const { addCompanyLoading, updateCompanyLoading } = this.props;
    const props = {
      items: this.renderItems(),
      actions: [
        {
          customtype: 'select',
          title: '保存',
          htmlType: 'submit' as 'submit',
          loading: addCompanyLoading || updateCompanyLoading,
        },
        { customtype: 'second', title: '取消', onClick: this.onCancelModel },
      ],
      onSubmit: this.onModelSubmit,
      title: modify ? '商户修改' : '商户新增',
      onCancel: this.onCancelModel,
      destroyOnClose: true,
      width: '70%',
      bodyStyle: {},
      add: this.state.add,
      modify: this.state.modify,
      wrapClassName: styles.modelStyle,
      onGetFormRef: (modelForm: WrappedFormUtils) => {
        this.modelForm = modelForm;
      },
    };
    return <ModalForm {...props} />;
  }

  renderConfirm() {
    return <Confirm type={'warning'} ref={this.confirmRef} />;
  }

  renderDetailModal() {
    const { companyDetailsModalVisible } = this.state;
    const { companyInfo = {} } = this.props;
    const props = {
      items: [
        {
          name: '商户名称',
          value: companyInfo.name,
        },
        {
          name: '法人姓名',
          value: companyInfo.juridicalPersonName,
        },
        {
          name: '负责人姓名',
          value: companyInfo.liaisonName,
        },
        {
          name: '负责人电话',
          value: companyInfo.liaisonPhone,
        },
        {
          name: '商户类型',
          value: companyInfo.tradeTypeStr,
        },
        {
          name: '社会信用代码',
          value: companyInfo.companyCode,
        },
        {
          name: '商户地址',
          value: companyInfo.address,
        },
        {
          name: '备注',
          value: companyInfo.remark,
          fill: true,
        },
      ],
      actions: [
        {
          customtype: 'select',
          // loading: loading.deleteCarLoading,
          title: '商户注销',
          onClick: () => this.deleteCompany(),
        },
        {
          customtype: 'select',
          // loading: loading.deleteCarLoading,
          title: '修改',
          onClick: () => this.companyEdit(),
        },
        {
          customtype: 'second',
          title: '关闭',
          // loading: loading.deleteCarLoading,
          onClick: this.onCancelModel,
        },
      ],
      images: [
        {
          name: '门店照片',
          url: companyInfo.masterImage,
        },
      ],
      info: companyInfo || {},
      visible: companyDetailsModalVisible,
      onCancel: this.onCancelDetailModel,
      title: '商户详情',
      footer: null,
      width: '70%',
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
    return (
      <div className={classNames('height100', 'flexColStart')} style={{ position: 'relative' }}>
        <div className={'listTitle'}>信息筛选</div>
        {this.renderSearchForm()}
        <div className={'listTitle'}>信息展示</div>
        {this.renderButtonGroup()}
        {this.renderCompanyList()}
        {this.renderPagination()}
        {this.renderModel()}
        {this.renderDetailModal()}
        {this.renderConfirm()}
        {this.renderOperatingResults()}
      </div>
    );
  }

  getDic = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'app/getDic', payload: { type: DictionaryEnum.COMPANY_TYPR } });
  };

  getCompanyData = Fileds => {
    const { dispatch } = this.props;
    dispatch({ type: 'communtyInfo/getCompany', payload: { ...Fileds } }).then(res => {
      if (res) {
        this.setState({
          searchFields: { ...Fileds },
        });
      }
    });
  };

  onSearch = (e: React.FormEvent<HTMLFormElement>) => {
    if (e) {
      e.preventDefault();
    }
    this.searchForm.validateFields((err, fieldsValue) => {
      if (err) return;
      const { page, size } = this.state.searchFields;
      const newFieldsValue = {
        page,
        size,
        ...fieldsValue,
      };
      this.getCompanyData(newFieldsValue);
    });
  };

  searchFormReset = () => {
    this.searchForm.resetFields();
    const { page, size } = this.state.searchFields;
    this.getCompanyData({ page, size });
  };

  onGetFormRef = (form: WrappedFormUtils) => {
    this.searchForm = form;
  };

  onCancelModel = () => {
    this.setState({
      add: false,
      modify: false,
      companyDetailsModalVisible: false,
      result: null,
      fileList: [],
    });
  };

  // 商户新增
  addCompanyInfo = item => {
    this.setState({
      add: true,
    });
  };

  // 商户修改
  companyEdit = () => {
    const { companyInfo = {} } = this.props;
    const fileList = [
      {
        uid: '1',
        name: 'image.jpg',
        size: 1435417,
        type: 'image/png',
        url: companyInfo.masterImage,
      },
    ];
    this.setState({
      modify: true,
      companyDetailsModalVisible: false,
      fileList,
    });
    // 获取商户地址
  };

  // 商户详情
  onCampanyInfo = id => {
    this.props.dispatch({ type: 'communtyInfo/getCompanyById', payload: { id } });
    this.setState({
      companyDetailsModalVisible: true,
    });
  };

  onChangePage = (page: number, size: number) => {
    this.setState({ checked: [] });
    const searchFields = { ...this.state.searchFields };
    searchFields.page = page - 1;
    searchFields.size = size;
    this.getCompanyData(searchFields);
  };
  onShowSizeChange = (current, pageSize) => {
    const searchFields = { ...this.state.searchFields };
    searchFields.page = current - 1;
    searchFields.size = pageSize;
    this.getCompanyData(searchFields);
  };
  onFileChange = info => {
    this.setState({
      fileList: info.fileList,
    });
  };

  reGetList = () => {
    const { baseInfo } = this.props;
    const searchFields = { ...this.state.searchFields };
    searchFields.page = baseInfo.number;
    searchFields.size = baseInfo.size;
    this.getCompanyData(searchFields);
  };

  onCompanyModelconfirm = (fieldsValue, type = '') => {
    const { dispatch } = this.props;
    let curType = '';
    if (type === 'add') {
      curType = 'communtyInfo/addCompany';
    } else {
      curType = 'communtyInfo/updateCompany';
    }
    dispatch({
      type: curType,
      payload: fieldsValue,
    }).then(res => {
      if (res && res.statusCode === 0) {
        this.onCancelModel();
        if (type === 'add') {
          this.getCompanyData({ page: 0 });
        } else {
          this.reGetList();
        }
      }
    });
  };

  onModelSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { add, modify } = this.state;
    const { companyInfo = {} } = this.props;
    this.modelForm.validateFields((err, fieldsValue) => {
      if (!err) {
        if (modify) {
          fieldsValue.id = companyInfo.id;
        }
        if (fieldsValue.expireTime) {
          fieldsValue.expireTime = moment(fieldsValue.expireTime).format('YYYY-MM-DD');
        }
        const formData = new FormData();
        for (const key in fieldsValue) {
          if (!fieldsValue[key]) {
            continue;
          }
          if (key !== 'image' && fieldsValue.hasOwnProperty(key)) {
            formData.set(key, fieldsValue[key]);
          } else if (key === 'image' && fieldsValue[key].file) {
            formData.set(key, fieldsValue[key].file);
          }
        }
        if (add) {
          this.onCompanyModelconfirm(formData, 'add');
        } else if (modify) {
          this.onCompanyModelconfirm(formData, 'modify');
        }
      }
    });
  };

  // 商户删除
  deleteCompany = () => {
    const { companyInfo = {} } = this.props;
    if (this.confirmRef.current) {
      this.confirmRef.current.open(
        () => this.onDeleteCompany([companyInfo.id]),
        '删除',
        '是否确认注销该商户？',
      );
    }
  };

  // 访问删除接口
  onDeleteCompany = (checked: number[]) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'communtyInfo/companyDelete',
      payload: checked,
    }).then(res => {
      if (res.data) {
        const { error } = res.data;
        console.log('error: ', error);
        if (error === 1) {
          Message.error(res.data.message);
        } else if (error > 1) {
          this.setState({ operatingResultsVisible: true, batchHandleResultsData: res.data });
        } else {
          this.onCancelModel();
          this.getCompanyData({ page: 0 });
        }
      }
    });
  };

  // 取消详情弹窗
  onCancelDetailModel = () => {
    this.setState({ companyDetailsModalVisible: false });
  };
}

export default Unit;
