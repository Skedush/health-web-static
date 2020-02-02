import React, { PureComponent, Fragment, RefObject, createRef } from 'react';
import { connect } from '@/utils/decorators';
import classNames from 'classnames';
import { isEmpty } from 'lodash';
import {
  Table,
  SearchForm,
  ButtonGroup,
  Button,
  CommonComponent,
  ModalForm,
  OperatingResults,
  Message,
  Confirm,
} from '@/components/Library';
import {
  FormComponentProps,
  PaginationConfig,
  WrappedFormUtils,
  ColumnProps,
  UploadFile,
} from '@/components/Library/type';
import { GlobalState, UmiComponentProps, DictionaryEnum } from '@/common/type';
import { SINGLE_COLUMN_WIDTH, DOUBLE_COLUMN_WIDTH } from '@/utils/constant';

const mapStateToProps = ({ app, menu, loading: { effects } }: GlobalState) => {
  return {
    menuData: menu.menuData,
    menuType: app.dictionry[DictionaryEnum.MENU_TYPE],
    menuTreeData: app.routeList,
    getMenuLoading: effects['menu/getMenu'],
    addMenuLoading: effects['menu/addMenu'],
    updateMenuLoading: effects['menu/updateMenu'],
    deleteMenuLoading: effects['menu/deleteMenu'],
  };
};

type MenuStateProps = ReturnType<typeof mapStateToProps>;
type MenuProps = MenuStateProps & UmiComponentProps & FormComponentProps;

interface MenuState {
  add: boolean;
  modify: boolean;
  fileList: UploadFile[];
  showDeleteConfirm: boolean;
  selectedRowKeys: number[];
  searchFields: { [propName: string]: any };
  menu: any;
  operatingResultsVisible: boolean;
  batchHandleResultsData: { [propName: string]: any };
}

@connect(
  mapStateToProps,
  null,
)
class Menu extends PureComponent<MenuProps, MenuState> {
  searchForm: WrappedFormUtils;
  modelForm: WrappedFormUtils;
  confirmRef: RefObject<Confirm>;

  constructor(props: Readonly<MenuProps>) {
    super(props);
    this.confirmRef = createRef();
    this.state = {
      showDeleteConfirm: true,
      fileList: [],
      add: false,
      modify: false,
      selectedRowKeys: [],
      searchFields: {},
      menu: {},
      operatingResultsVisible: false,
      batchHandleResultsData: {},
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    this.getMenuData({ page: 0 });
    dispatch({
      type: 'app/getDic',
      payload: { type: [DictionaryEnum.MENU_TYPE].toString() },
    });
  }
  renderSearchForm() {
    const SearchFormProps = {
      items: [
        { type: 'input', field: 'name', placeholder: '菜单名称' },
        { type: 'input', field: 'description', placeholder: '菜单描述' },
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
    const { addMenuLoading, deleteMenuLoading } = this.props;
    const ButtonGroupProps = {
      actions: [
        { customtype: 'master', title: '新增', onClick: this.addMenu, loading: addMenuLoading },
        {
          customtype: 'warning',
          disabled: !this.state.selectedRowKeys.length,
          title: '删除',
          onClick: this.batchdeleteMenu,
          loading: deleteMenuLoading,
        },
      ],
    };
    return <ButtonGroup {...ButtonGroupProps} />;
  }

  // eslint-disable-next-line max-lines-per-function
  renderTable() {
    const { menuData, getMenuLoading } = this.props;
    const { selectedRowKeys } = this.state;

    if (isEmpty(menuData) || !menuData) {
      return null;
    }

    const columns: ColumnProps<any>[] = [
      {
        title: '菜单名称',
        dataIndex: 'name',
        key: 'name',
        width: SINGLE_COLUMN_WIDTH,
        render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '功能类型',
        width: DOUBLE_COLUMN_WIDTH,
        dataIndex: 'typeStr',
        key: 'typeStr',
        render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '功能URL',
        width: DOUBLE_COLUMN_WIDTH,
        dataIndex: 'url',
        key: 'url',
        render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '菜单等级',
        width: SINGLE_COLUMN_WIDTH,
        dataIndex: 'level',
        key: 'level',
        render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '功能描述',
        width: DOUBLE_COLUMN_WIDTH,
        dataIndex: 'description',
        key: 'description',
        render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '父级功能',
        width: SINGLE_COLUMN_WIDTH,
        dataIndex: 'parentName',
        key: 'parentName',
        render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '操作',
        width: DOUBLE_COLUMN_WIDTH,
        key: 'action',
        render: (_text: any, record: any) =>
          menuData ? (
            <Fragment>
              <Button
                customtype={'icon'}
                onClick={() => this.updateMenu(record)}
                icon={'pm-edit'}
                title={'修改'}
              />
              <Button
                customtype={'icon'}
                onClick={() => this.deleteMenu(record.id)}
                title={'删除'}
                icon={'pm-trash-can'}
              />
            </Fragment>
          ) : null,
      },
    ];

    const pagination: PaginationConfig = {
      position: 'bottom',
      total: menuData.totalElements,
      current: menuData.pageable.pageNumber + 1,
      pageSize: menuData.pageable.pageSize,
      defaultCurrent: 1,
      // onChange: this.onChangePage,
    };

    return (
      <div className={classNames('flexAuto')}>
        <Table
          columns={columns}
          dataSource={menuData.content}
          scroll={{ y: '100%' }}
          loading={getMenuLoading}
          pagination={pagination}
          onSelectRow={this.onTableSelectRow}
          onChange={this.onTableChange}
          selectedRow={selectedRowKeys}
        />
      </div>
    );
  }
  renderModalForm() {
    const { menu, modify, add } = this.state;
    const { menuType, menuTreeData, addMenuLoading, updateMenuLoading } = this.props;
    const props = {
      items: [
        {
          type: 'hiddenInput',
          field: 'id',
          initialValue: menu.id,
          hidden: true,
        },
        {
          type: 'input',
          field: 'name',
          initialValue: menu.name,
          placeholder: '菜单名称',
          rules: [{ required: true, message: '请输入菜单名称!' }],
        },
        {
          type: 'select',
          field: 'type',
          children: menuType,
          initialValue: menu.type,
          placeholder: '功能类型',
          rules: [{ required: true, message: '请选择功能类型!' }],
        },
        {
          type: 'input',
          field: 'url',
          initialValue: menu.url,
          placeholder: '功能Url',
          // rules: [{ required: true, message: '请输入功能url!' }],
        },
        {
          type: 'input',
          field: 'sort',
          initialValue: menu.sort,
          placeholder: '菜单排序',
          rules: [{ required: true, message: '请输入菜单排序!' }],
        },
        {
          type: 'input',
          field: 'icon',
          initialValue: menu.icon,
          placeholder: '图标',
          // rules: [{ required: true, message: '请输入姓名!' }],
        },
        {
          type: 'treeSelect',
          field: 'parentId',
          initialValue: menu.parentId,
          placeholder: '父级菜单',
          showSearch: true,
          allowClear: true,
          treeDefaultExpandAll: false,
          searchPlaceholder: '搜索菜单',
          treeData: menuTreeData,
          // rules: [{ required: true, message: '请输入姓名!' }],
        },
        {
          type: 'input',
          field: 'description',
          initialValue: menu.description,
          placeholder: '功能描述',
          // rules: [{ required: true, message: '请输入姓名!' }],
        },
      ],
      actions: [
        {
          customtype: 'select',
          icon: 'search',
          title: '确定',
          htmlType: 'submit' as 'submit',
          loading: addMenuLoading || updateMenuLoading,
        },
        { customtype: 'second', title: '取消', onClick: this.onCancelModel },
      ],
      onSubmit: this.onModelSubmit,
      title: '修改菜单信息',
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
      console.log('fieldsValue: ', fieldsValue);
      this.setState({
        searchFields: { ...fieldsValue },
      });
      fieldsValue.page = 0;
      this.getMenuData(fieldsValue);
      // for (const item in fieldsValue) {
      //   if (fieldsValue.hasOwnProperty(item)) {
      //     fieldsValue[item] = fieldsValue[item] === -1 ? undefined : fieldsValue[item];
      //   }
      // }
    });
  };

  getMenuData = Fileds => {
    const { dispatch } = this.props;
    this.setState({ selectedRowKeys: [] });
    dispatch({ type: 'menu/getMenu', payload: { ...Fileds } });
  };

  onTableChange = pagination => {
    console.log('pagination: ', pagination);
    const searchFields = { ...this.state.searchFields };
    searchFields.page = --pagination.current;
    searchFields.size = pagination.pageSize;
    this.getMenuData(searchFields);
  };

  addMenu = () => {
    this.setState({
      add: true,
    });
  };

  searchFormReset = () => {
    this.searchForm.resetFields();
    this.setState({
      searchFields: {},
    });
    this.getMenuData({ page: 0 });
  };

  onTableSelectRow = selectedRowKeys => {
    console.log('selectedRowKeys: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  };

  updateMenu = (record: any) => {
    this.setState({
      modify: true,
      menu: record,
    });
  };

  onCancelModel = () => {
    this.setState({
      add: false,
      modify: false,
      menu: {},
    });
  };

  batchdeleteMenu = () => {
    if (this.confirmRef.current) {
      this.confirmRef.current.open(
        () => this.ondeleteMenu(this.state.selectedRowKeys),
        '删除',
        '是否确认删除选中的条目？',
      );
    }
  };

  deleteMenu = (id: number) => {
    if (this.confirmRef.current) {
      this.confirmRef.current.open(() => this.ondeleteMenu([id]), '删除', '是否确认删除？');
    }
  };

  ondeleteMenu = async payload => {
    const { dispatch } = this.props;
    const data = await dispatch({ type: 'menu/deleteMenu', payload: payload });
    if (data) {
      if (data.success) {
        this.onCancelModel();
        this.getMenuData({ page: 0 });
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

  onaddMenu = fieldsValue => {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/addMenu',
      payload: fieldsValue,
    }).then(() => {
      this.onCancelModel();
      this.getMenuData({ page: 0 });
    });
  };

  onUpdateMenu = fieldsValue => {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/updateMenu',
      payload: fieldsValue,
    }).then(() => {
      this.onCancelModel();
      this.getMenuData({ page: 0 });
    });
  };

  onModelSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { add, modify } = this.state;
    this.modelForm.validateFields((err, fieldsValue) => {
      if (!err) {
        if (add) {
          this.onaddMenu(fieldsValue);
        } else if (modify) {
          this.onUpdateMenu(fieldsValue);
        }
      }
    });
  };
}

export default Menu;
