import React, { PureComponent, Fragment, RefObject, createRef } from 'react';
import { connect } from '@/utils/decorators';
import classNames from 'classnames';
import { isEmpty } from 'lodash';
import styles from './index.less';
import {
  Table,
  SearchForm,
  ButtonGroup,
  Button,
  CommonComponent,
  // ModalForm,
  Modal,
  Confirm,
  Form,
  Row,
  Input,
  Col,
  Tree,
  Spin,
  Message,
  OperatingResults,
} from '@/components/Library';
import {
  FormComponentProps,
  PaginationConfig,
  WrappedFormUtils,
  ColumnProps,
  UploadFile,
} from '@/components/Library/type';
import { GlobalState, UmiComponentProps } from '@/common/type';
import { SINGLE_COLUMN_WIDTH, FIVE_COLUMN_WIDTH } from '@/utils/constant';

const { Item } = Form;
const { TextArea } = Input;
const { TreeNode } = Tree;

const mapStateToProps = ({ role, app, loading: { effects } }: GlobalState) => {
  return {
    roleData: role.roleData,
    menuTreeData: app.routeList,
    getRoleLoading: effects['role/getRole'],
    getRoleInfoLoading: effects['role/getRoleInfo'],
    addRoleLoading: effects['role/addRole'],
    updateRoleLoading: effects['role/updateRole'],
    deleteRoleLoading: effects['role/deleteRole'],
  };
};

type RoleStateProps = ReturnType<typeof mapStateToProps>;
type RoleProps = RoleStateProps & UmiComponentProps & FormComponentProps;

interface RoleState {
  add: boolean;
  modify: boolean;
  fileList: UploadFile[];
  showDeleteConfirm: boolean;
  selectedRowKeys: number[];
  searchFields: { [propName: string]: any };
  role: any;
  treeChecked: string[];
  treeHalfChecked: string[];
  operatingResultsVisible: boolean;
  batchHandleResultsData: { [propName: string]: any };
}

@connect(
  mapStateToProps,
  null,
)
class Role extends PureComponent<RoleProps, RoleState> {
  searchForm: WrappedFormUtils;
  modelForm: WrappedFormUtils;
  confirmRef: RefObject<Confirm>;

  constructor(props: Readonly<RoleProps>) {
    super(props);
    this.confirmRef = createRef();
    this.state = {
      showDeleteConfirm: true,
      fileList: [],
      add: false,
      modify: false,
      selectedRowKeys: [],
      searchFields: {},
      role: {},
      treeChecked: [],
      treeHalfChecked: [],
      operatingResultsVisible: false,
      batchHandleResultsData: {},
    };
  }

  componentDidMount() {
    this.getRoleData({ page: 0 });
  }
  renderSearchForm() {
    const SearchFormProps = {
      items: [
        { type: 'input', field: 'name', placeholder: '角色名称' },
        { type: 'input', field: 'description', placeholder: '角色描述' },
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
    const { addRoleLoading, deleteRoleLoading } = this.props;
    const ButtonGroupProps = {
      actions: [
        { customtype: 'master', title: '新增', onClick: this.addRole, loading: addRoleLoading },
        {
          customtype: 'warning',
          disabled: !this.state.selectedRowKeys.length,
          title: '删除',
          onClick: this.batchdeleteRole,
          loading: deleteRoleLoading,
        },
      ],
    };
    return <ButtonGroup {...ButtonGroupProps} />;
  }

  // eslint-disable-next-line max-lines-per-function
  renderTable() {
    const { roleData, getRoleLoading } = this.props;
    const { selectedRowKeys } = this.state;

    if (isEmpty(roleData) || !roleData) {
      return null;
    }

    const columns: ColumnProps<any>[] = [
      {
        title: '角色名称',
        dataIndex: 'name',
        key: 'name',
        width: FIVE_COLUMN_WIDTH,
        render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '角色描述',
        width: FIVE_COLUMN_WIDTH,
        dataIndex: 'description',
        key: 'description',
        render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '操作',
        width: SINGLE_COLUMN_WIDTH,
        key: 'action',
        render: (_text: any, record: any) =>
          roleData ? (
            <Fragment>
              <Button
                customtype={'icon'}
                onClick={() => this.updateRole(record)}
                icon={'pm-edit'}
                title={'修改'}
              />
              <Button
                customtype={'icon'}
                onClick={() => this.deleteRole(record.id)}
                title={'删除'}
                icon={'pm-trash-can'}
              />
            </Fragment>
          ) : null,
      },
    ];

    const pagination: PaginationConfig = {
      position: 'bottom',
      total: roleData.totalElements,
      current: roleData.pageable.pageNumber + 1,
      pageSize: roleData.pageable.pageSize,
      defaultCurrent: 1,
      // onChange: this.onChangePage,
    };

    return (
      <div className={classNames('flexAuto')}>
        <Table
          columns={columns}
          dataSource={roleData.content}
          scroll={{ y: '100%' }}
          loading={getRoleLoading}
          pagination={pagination}
          onSelectRow={this.onTableSelectRow}
          onChange={this.onTableChange}
          selectedRow={selectedRowKeys}
        />
      </div>
    );
  }
  // renderModalForm() {
  //   const { role, modify, add } = this.state;
  //   const props = {
  //     items: [
  //       {
  //         type: 'input',
  //         field: 'id',
  //         initialValue: role.id,
  //         hidden: true,
  //       },
  //       {
  //         type: 'input',
  //         field: 'name',
  //         initialValue: role.name,
  //         placeholder: '角色名称',
  //         // rules: [{ required: true, message: '请输入用户名!' }],
  //       },
  //       {
  //         type: 'input',
  //         field: 'description',
  //         initialValue: role.description,
  //         placeholder: '角色修复',
  //         // rules: [{ required: true, message: '请输入姓名!' }],
  //       },
  //     ],
  //     actions: [
  //       { customtype: 'select', icon: 'search', title: '确定', htmlType: 'submit' as 'submit' },
  //       { customtype: 'second', title: '取消', onClick: this.onCancelModel },
  //     ],
  //     onSubmit: this.onModelSubmit,
  //     title: '修改角色信息',
  //     onCancel: this.onCancelModel,
  //     destroyOnClose: true,
  //     width: '50%',
  //     bodyStyle: {},
  //     add: add,
  //     modify: modify,
  //     onGetFormRef: (modelForm: WrappedFormUtils) => {
  //       this.modelForm = modelForm;
  //     },
  //   };
  //   return <ModalForm {...props} />;
  // }

  renderModalForm() {
    const { role } = this.state;
    const { form, addRoleLoading, updateRoleLoading, getRoleInfoLoading } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        centered
        width={'50%'}
        // bodyStyle={bodyStyle}
        destroyOnClose={true}
        onCancel={this.onCancelModel}
        visible={this.state.add || this.state.modify}
        footer={null}
        maskClosable={false}
        title={this.state.add ? '角色新增' : '角色修改'}
        wrapClassName={styles.model}
      >
        <Form
          className={styles.AddOrEditForm}
          labelAlign={'right'}
          onSubmit={this.onModelSubmit}
          // {...formItemLayout}
          autoComplete={'off'}
        >
          <div className={classNames('flexColStart', styles.content)}>
            <Spin spinning={!!getRoleInfoLoading}>
              <div className={classNames('flexStart', styles.content)}>
                <div>
                  <Row gutter={16} justify={'center'}>
                    <Col span={24}>
                      <Item label={'角色名称'}>
                        {getFieldDecorator('name', {
                          initialValue: role.name,
                          rules: [{ required: true, message: '请输入角色名!' }],
                        })(<Input placeholder={'角色名称'} />)}
                      </Item>
                    </Col>
                    <Col span={24}>
                      <Item label={'角色描述'}>
                        {getFieldDecorator('description', {
                          initialValue: role.description,
                          rules: [{}],
                        })(<TextArea placeholder={'角色描述'} />)}
                      </Item>
                    </Col>
                  </Row>
                </div>
                <div className={styles.treeDiv}>
                  权限选择<div className={styles.tree}>{this.renderTree()}</div>
                </div>
              </div>
            </Spin>
            <div className={styles.bottomButton}>
              <Button
                customtype={'select'}
                htmlType={'submit'}
                loading={addRoleLoading || updateRoleLoading}
              >
                {this.state.add ? '添加' : '保存'}
              </Button>
              <Button
                customtype={'second'}
                style={{ marginLeft: '8px' }}
                onClick={this.onCancelModel}
              >
                {'取消'}
              </Button>
            </div>
          </div>
        </Form>
      </Modal>
    );
  }

  renderTree() {
    const { menuTreeData } = this.props;
    const { treeChecked, treeHalfChecked } = this.state;
    console.log('treeChecked: ', treeChecked);
    return (
      <Tree
        checkable
        onCheck={this.onTreeCheck}
        checkedKeys={{ checked: treeChecked, halfChecked: treeHalfChecked }}
        selectable={false}
        defaultExpandAll
      >
        {this.getTreeNode(menuTreeData)}
      </Tree>
    );
  }

  getTreeNode = treeData => {
    // console.log('treeData: ', treeData);
    return treeData.map(item => (
      <TreeNode value={item.id} title={item.name} key={item.id}>
        {item.children && this.getTreeNode(item.children)}
      </TreeNode>
    ));
  };

  renderConfirm() {
    return <Confirm type={'warning'} ref={this.confirmRef} />;
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

  onTreeCheck = (checkedKeys, info) => {
    this.setState({ treeChecked: checkedKeys, treeHalfChecked: info.halfCheckedKeys });
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
      this.getRoleData(fieldsValue);
      // for (const item in fieldsValue) {
      //   if (fieldsValue.hasOwnProperty(item)) {
      //     fieldsValue[item] = fieldsValue[item] === -1 ? undefined : fieldsValue[item];
      //   }
      // }
    });
  };

  getRoleData = Fileds => {
    const { dispatch } = this.props;
    this.setState({ selectedRowKeys: [] });
    dispatch({ type: 'role/getRole', payload: { ...Fileds } });
  };

  onTableChange = pagination => {
    console.log('pagination: ', pagination);
    const searchFields = { ...this.state.searchFields };
    searchFields.page = --pagination.current;
    searchFields.size = pagination.pageSize;
    this.getRoleData(searchFields);
  };

  addRole = () => {
    this.setState({
      add: true,
    });
  };

  searchFormReset = () => {
    this.searchForm.resetFields();
    this.setState({ searchFields: {} });
    this.getRoleData({ page: 0 });
  };

  onTableSelectRow = selectedRowKeys => {
    console.log('selectedRowKeys: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  };

  getTreeChecked = (menuList, treeChecked, treeHalfChecked) => {
    console.log('menuList: ', menuList);
    menuList.forEach(item => {
      if (item.children.length > 0) {
        treeHalfChecked.push(item.id.toString());
        this.getTreeChecked(item.children, treeChecked, treeHalfChecked);
      } else treeChecked.push(item.id.toString());
    });
  };

  updateRole = (record: any) => {
    const { dispatch } = this.props;
    this.setState({ modify: true });
    dispatch({ type: 'role/getRoleInfo', payload: { id: record.id } }).then(res => {
      const treeChecked = [];
      const treeHalfChecked = [];
      if (res.menuList) {
        this.getTreeChecked(res.menuList, treeChecked, treeHalfChecked);
        console.log('treeChecked: ', treeChecked);
      }
      this.setState({ role: res, treeChecked, treeHalfChecked });
    });
  };

  onCancelModel = () => {
    this.setState({
      add: false,
      modify: false,
      role: {},
      treeChecked: [],
      treeHalfChecked: [],
    });
  };

  batchdeleteRole = () => {
    if (this.confirmRef.current) {
      this.confirmRef.current.open(
        () => this.ondeleteRole(this.state.selectedRowKeys),
        '删除',
        '是否确认删除选中的条目？',
      );
    }
  };

  deleteRole = (id: number) => {
    if (this.confirmRef.current) {
      this.confirmRef.current.open(() => this.ondeleteRole([id]), '删除', '是否确认删除？');
    }
  };

  ondeleteRole = data => {
    const { dispatch } = this.props;
    dispatch({ type: 'role/deleteRole', payload: data }).then(res => {
      if (res.data) {
        const { error } = res.data;
        if (error === 1) {
          Message.error(res.data.message);
        } else if (error > 1) {
          this.setState({ operatingResultsVisible: true, batchHandleResultsData: res.data });
        }
      }
      this.getRoleData({ page: 0 });
      this.setState({ selectedRowKeys: [] });
    });
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

  onaddRole = fieldsValue => {
    const { dispatch } = this.props;
    dispatch({
      type: 'role/addRole',
      payload: fieldsValue,
    }).then(() => {
      this.onCancelModel();
      this.getRoleData({ page: 0 });
    });
  };

  onUpdateRole = fieldsValue => {
    const { dispatch } = this.props;
    dispatch({
      type: 'role/updateRole',
      payload: fieldsValue,
    }).then(() => {
      this.onCancelModel();
      this.getRoleData({ page: 0 });
    });
  };

  onModelSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { add, modify, treeChecked, role, treeHalfChecked } = this.state;
    this.props.form.validateFields((err, fieldsValue) => {
      if (!err) {
        fieldsValue.menuIds = treeChecked.concat(treeHalfChecked);
        if (add) {
          this.onaddRole(fieldsValue);
        } else if (modify) {
          fieldsValue.id = role.id;
          this.onUpdateRole(fieldsValue);
        }
      }
    });
  };
}

export default Form.create<RoleProps>()(Role);
