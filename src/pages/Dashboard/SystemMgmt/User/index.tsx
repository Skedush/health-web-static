import React, { PureComponent, Fragment, RefObject, createRef } from 'react';
import { connect } from '@/utils/decorators';
import classNames from 'classnames';
import { isPhone } from '@/utils/validater';
import { isEmpty } from 'lodash';
import {
  Table,
  SearchForm,
  ButtonGroup,
  Button,
  CommonComponent,
  ModalForm,
  Confirm,
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
import { SINGLE_COLUMN_WIDTH, DOUBLE_COLUMN_WIDTH } from '@/utils/constant';

const mapStateToProps = ({ user, loading: { effects } }: GlobalState) => {
  return {
    userData: user.userData,
    roleList: user.roleList,
    getUserLoading: effects['user/getUser'],
    addUserLoading: effects['user/addUser'],
    updateUserLoading: effects['user/updateUser'],
    deleteUserLoading: effects['user/deleteUser'],
    updatePassWordLoading: effects['user/updatePassWord'],
  };
};

type UserStateProps = ReturnType<typeof mapStateToProps>;
type UserProps = UserStateProps & UmiComponentProps & FormComponentProps;

interface UserState {
  add: boolean;
  modify: boolean;
  fileList: UploadFile[];
  showDeleteConfirm: boolean;
  selectedRowKeys: number[];
  searchFields: { [propName: string]: any };
  user: any;
  passWordModify: boolean;
  operatingResultsVisible: boolean;
  batchHandleResultsData: { [propName: string]: any };
}

@connect(
  mapStateToProps,
  null,
)
class User extends PureComponent<UserProps, UserState> {
  searchForm: WrappedFormUtils;
  modelForm: WrappedFormUtils;
  passWordModelForm: WrappedFormUtils;
  confirmRef: RefObject<Confirm>;

  constructor(props: Readonly<UserProps>) {
    super(props);
    this.confirmRef = createRef();
    this.state = {
      showDeleteConfirm: true,
      fileList: [],
      add: false,
      modify: false,
      selectedRowKeys: [],
      searchFields: {},
      user: {},
      passWordModify: false,
      operatingResultsVisible: false,
      batchHandleResultsData: {},
    };
  }

  componentDidMount() {
    this.getUserData({ page: 0 });
    this.getRoleList();
  }
  renderSearchForm() {
    const SearchFormProps = {
      items: [
        { type: 'input', field: 'name', placeholder: '姓名' },
        { type: 'input', field: 'phone', placeholder: '电话' },
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
    const { addUserLoading, deleteUserLoading } = this.props;
    const ButtonGroupProps = {
      actions: [
        { customtype: 'master', title: '新增', onClick: this.addUser, loading: addUserLoading },
        {
          customtype: 'warning',
          disabled: !this.state.selectedRowKeys.length,
          title: '删除',
          onClick: this.batchdeleteUser,
          loading: deleteUserLoading,
        },
      ],
    };
    return <ButtonGroup {...ButtonGroupProps} />;
  }

  // eslint-disable-next-line max-lines-per-function
  renderTable() {
    const { userData, getUserLoading } = this.props;
    const { selectedRowKeys } = this.state;

    if (isEmpty(userData) || !userData) {
      return null;
    }

    const columns: ColumnProps<any>[] = [
      {
        title: '用户名',
        dataIndex: 'userName',
        key: 'userName',
        width: SINGLE_COLUMN_WIDTH,
        render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '姓名',
        width: DOUBLE_COLUMN_WIDTH,
        dataIndex: 'name',
        key: 'name',
        render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '邮箱',
        width: DOUBLE_COLUMN_WIDTH,
        dataIndex: 'email',
        key: 'email',
        render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '手机号',
        width: DOUBLE_COLUMN_WIDTH,
        key: 'phone',
        dataIndex: 'phone',
        render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '所属角色',
        width: DOUBLE_COLUMN_WIDTH,
        key: 'roleName',
        dataIndex: 'roleName',
        render: (text: any, record: object) => CommonComponent.renderTableCol(text, record),
      },
      {
        title: '操作',
        width: DOUBLE_COLUMN_WIDTH,
        key: 'action',
        render: (_text: any, record: any) =>
          userData ? (
            <Fragment>
              <Button
                customtype={'icon'}
                onClick={() => this.updatePassWord(record)}
                icon={'pm-permissions'}
                title={'修改密码'}
              />
              <Button
                customtype={'icon'}
                onClick={() => this.updateUser(record)}
                icon={'pm-edit'}
                title={'修改用户'}
              />
              <Button
                customtype={'icon'}
                onClick={() => this.deleteUser(record.id)}
                title={'删除'}
                icon={'pm-trash-can'}
              />
            </Fragment>
          ) : null,
      },
    ];

    const pagination: PaginationConfig = {
      position: 'bottom',
      total: userData.totalElements,
      current: userData.pageable.pageNumber + 1,
      pageSize: userData.pageable.pageSize,
      defaultCurrent: 1,
      // onChange: this.onChangePage,
    };

    return (
      <div className={classNames('flexAuto')}>
        <Table
          columns={columns}
          dataSource={userData.content}
          scroll={{ y: '100%' }}
          loading={getUserLoading}
          pagination={pagination}
          onSelectRow={this.onTableSelectRow}
          onChange={this.onTableChange}
          selectedRow={selectedRowKeys}
        />
      </div>
    );
  }

  renderPassWordModalForm() {
    const { passWordModify, user } = this.state;
    const { updatePassWordLoading } = this.props;
    const props = {
      items: [
        {
          type: 'hiddenInput',
          field: 'id',
          initialValue: user.id,
          hidden: true,
        },
        {
          type: 'password',
          field: 'oldPassword',
          autoComplete: 'new-password',
          placeholder: '旧密码',
          rules: [{ required: true, message: '请输入旧密码!' }],
        },
        {
          type: 'password',
          field: 'newPassword',
          autoComplete: 'new-password',
          placeholder: '新密码',
          rules: [{ required: true, message: '请输入新密码!' }],
        },
        {
          type: 'password',
          field: 'reNewPassword',
          autoComplete: 'new-password',
          placeholder: '再次输入新密码',
          rules: [{ required: true, message: '请再次输入新密码!' }],
        },
      ],
      actions: [
        {
          customtype: 'select',
          icon: 'search',
          title: '确定',
          htmlType: 'submit' as 'submit',
          loading: updatePassWordLoading,
        },
        { customtype: 'second', title: '取消', onClick: this.onCancelModel },
      ],
      onSubmit: this.onPassWordModelSubmit,
      title: '修改用户密码',
      onCancel: this.onCancelModel,
      destroyOnClose: true,
      width: '50%',
      bodyStyle: {},
      add: false,
      modify: passWordModify,
      onGetFormRef: (modelForm: WrappedFormUtils) => {
        this.passWordModelForm = modelForm;
      },
    };
    return <ModalForm {...props} />;
  }
  renderModalForm() {
    const { user, modify, add } = this.state;
    const { roleList = [], addUserLoading, updateUserLoading } = this.props;
    const roleData = roleList.map(item => ({ key: item.id, value: item.name }));
    const props = {
      items: [
        {
          type: 'hiddenInput',
          field: 'id',
          initialValue: user.id,
          hidden: true,
        },
        {
          type: 'input',
          field: 'username',
          initialValue: user.userName,
          placeholder: '用户名',
          rules: [{ required: true, message: '请输入用户名!' }],
        },
        {
          type: 'input',
          field: 'name',
          initialValue: user.name,
          placeholder: '姓名',
          rules: [{ required: true, message: '请输入姓名!' }],
        },
        {
          type: 'password',
          field: 'password',
          hidden: modify,
          autoComplete: 'new-password',
          initialValue: user.password,
          placeholder: '密码',
          rules: [{ required: true, message: '请输入密码!' }],
        },
        {
          type: 'input',
          field: 'email',
          initialValue: user.email,
          placeholder: '邮箱',
          // rules: [{ required: true, message: '请输入邮箱!' }],
        },
        {
          type: 'input',
          initialValue: user.phone,
          field: 'phone',
          placeholder: '手机号',
          rules: [
            { required: true, message: '请输入手机号!' },
            {
              validator: isPhone,
            },
          ],
        },
        {
          type: 'select',
          initialValue: user.roleId,
          field: 'roleId',
          children: roleData,
          placeholder: '所属角色',
          rules: [{ required: true, message: '请选择角色!' }],
        },
      ],
      actions: [
        {
          customtype: 'select',
          icon: 'search',
          title: '确定',
          htmlType: 'submit' as 'submit',
          loading: addUserLoading || updateUserLoading,
        },
        { customtype: 'second', title: '取消', onClick: this.onCancelModel },
      ],
      onSubmit: this.onModelSubmit,
      title: modify ? '修改用户信息' : '新增用户信息',
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
        {this.renderPassWordModalForm()}
        {this.renderOperatingResults()}
      </div>
    );
  }

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
      this.getUserData(fieldsValue);
      // for (const item in fieldsValue) {
      //   if (fieldsValue.hasOwnProperty(item)) {
      //     fieldsValue[item] = fieldsValue[item] === -1 ? undefined : fieldsValue[item];
      //   }
      // }
    });
  };

  getUserData = Fileds => {
    const { dispatch } = this.props;
    this.setState({ selectedRowKeys: [] });
    dispatch({ type: 'user/getUser', payload: { ...Fileds } });
  };

  getRoleList = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'user/getRoleList' });
  };

  onTableChange = pagination => {
    const searchFields = { ...this.state.searchFields };
    searchFields.page = --pagination.current;
    searchFields.size = pagination.pageSize;
    this.getUserData(searchFields);
  };

  addUser = () => {
    this.setState({
      add: true,
    });
  };

  searchFormReset = () => {
    this.searchForm.resetFields();
    this.setState({
      searchFields: {},
    });
    this.getUserData({ page: 0 });
  };

  onTableSelectRow = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

  updatePassWord = (record: any) => {
    this.setState({
      passWordModify: true,
      user: record,
    });
  };

  updateUser = (record: any) => {
    this.setState({
      modify: true,
      user: record,
    });
  };

  onCancelModel = () => {
    this.setState({
      add: false,
      modify: false,
      user: {},
      passWordModify: false,
    });
  };

  batchdeleteUser = () => {
    if (this.confirmRef.current) {
      this.confirmRef.current.open(
        () => this.ondeleteUser(this.state.selectedRowKeys),
        '删除',
        '是否确认删除选中的条目？',
      );
    }
  };

  deleteUser = (id: number) => {
    if (this.confirmRef.current) {
      this.confirmRef.current.open(() => this.ondeleteUser([id]), '删除', '是否确认删除？');
    }
  };

  ondeleteUser = data => {
    const { dispatch } = this.props;
    dispatch({ type: 'user/deleteUser', payload: data }).then(res => {
      if (res.data) {
        const { error } = res.data;
        if (error === 1) {
          Message.error(res.data.message);
        } else if (error > 1) {
          this.setState({ operatingResultsVisible: true, batchHandleResultsData: res.data });
        }
      }
      this.getUserData({ page: 0 });
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

  onaddUser = fieldsValue => {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/addUser',
      payload: fieldsValue,
    }).then(() => {
      this.onCancelModel();
      this.getUserData({ page: 0 });
    });
  };

  onUpdateUser = fieldsValue => {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/updateUser',
      payload: fieldsValue,
    }).then(() => {
      this.onCancelModel();
      this.getUserData({ page: 0 });
    });
  };

  onPassWordModelSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { dispatch } = this.props;
    this.passWordModelForm.validateFields((err, fieldsValue) => {
      console.log('fieldsValue: ', fieldsValue);
      if (!err) {
        delete fieldsValue.reNewPassword;
        dispatch({
          type: 'user/updatePassWord',
          payload: fieldsValue,
        }).then(() => this.onCancelModel());
      }
    });
  };

  onModelSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { add, modify } = this.state;
    this.modelForm.validateFields((err, fieldsValue) => {
      if (!err) {
        if (add) {
          this.onaddUser(fieldsValue);
        } else if (modify) {
          this.onUpdateUser(fieldsValue);
        }
      }
    });
  };
}

export default User;
