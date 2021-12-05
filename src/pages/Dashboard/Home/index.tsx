/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */
/* eslint-disable no-dupe-class-members */
// import dark from '@/themes/templates/dark';
// import light from '@/themes/templates/light';
import { GlobalState, UmiComponentProps } from '@/common/type';
import { Button, Confirm, List, Message, ModalForm, SearchForm, Tabs } from '@/components/Library';
import { FormComponentProps, WrappedFormUtils } from '@/components/Library/type';
import { router } from '@/utils';
import { connect } from '@/utils/decorators';
import classNames from 'classnames';
import { cloneDeep, isEmpty } from 'lodash';
import React, { createRef, PureComponent, RefObject } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Scrollbar from 'react-perfect-scrollbar';
import store from 'store';
import styles from './index.less';
import Link from 'umi/link';
import Config from '@/utils/config';
const { domain, preDomain } = Config;

const { TabPane } = Tabs;

// import { add, minus } from '@/actions/app';

const mapStateToProps = ({ home, loading: { effects } }: GlobalState) => {
  return {
    userEntryList: home.userEntryList,
    entryInfoList: home.entryInfoList,
    getUserEntryListLoading: effects['home/getUserEntryList'],
    // updatePassWordLoading: effects['home/updatePasswordAndUsername'],
    titleDetail: home.titleDetail,
    updateTitleLoading: effects['home/updateTitle'],
    getTitleDetailLoading: effects['home/getTitleDetail'],
  };
};

type HomeStateProps = ReturnType<typeof mapStateToProps>;
type HomeProps = HomeStateProps & UmiComponentProps & FormComponentProps;

interface HomeState {
  entryInfo: string;
  searchFileds: any;
  passWordModifyModalVisible: boolean;
  titleEditModalVisible: boolean;
}

@connect(
  mapStateToProps,
  null,
)
class Home extends PureComponent<HomeProps, HomeState> {
  titleModelForm: WrappedFormUtils;
  // passWordModelForm: WrappedFormUtils;
  searchForm: WrappedFormUtils;
  confirmRef: RefObject<Confirm> = createRef();

  constructor(props: Readonly<HomeProps>) {
    super(props);
    this.state = {
      titleEditModalVisible: false,
      passWordModifyModalVisible: false,
      entryInfo: '',
      searchFileds: { page: 1 },
    };
  }

  async componentDidMount() {
    const { dispatch } = this.props;
    const { searchFileds } = this.state;
    const data = await dispatch({ type: 'home/getEntryInfoList', payload: {} });
    if (!isEmpty(data)) {
      this.setState(
        {
          entryInfo: data[0].id.toString(),
        },
        () => {
          this.getUserEntryList(searchFileds);
        },
      );
    }
  }

  onDeleteUser = async id => {
    const { dispatch } = this.props;
    const res = await dispatch({ type: 'home/deleteUserEntry', payload: { id } });
    if (res && res.success) {
      Message.success('删除成功');
      const { searchFileds } = this.state;
      searchFileds.page = 1;
      this.getUserEntryList(searchFileds);
    } else {
      Message.error('删除失败');
    }
  };

  deleteUserEntry = id => {
    if (this.confirmRef.current) {
      this.confirmRef.current.open(() => this.onDeleteUser(id), '删除', '是否确认删除？');
    }
  };

  renderSearchForm() {
    const SearchFormProps = {
      items: [{ type: 'input', field: 'search', placeholder: '姓名或电话或ID或备注' }],
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
  renderConfirm() {
    return <Confirm type={'warning'} ref={this.confirmRef} />;
  }

  renderList() {
    const { userEntryList, entryInfoList, getUserEntryListLoading } = this.props;
    const { entryInfo } = this.state;
    if (isEmpty(userEntryList)) return null;
    const userInfo = store.get('userInfo');
    let isStaff = false;
    let isSuperUser = false;
    if (userInfo) {
      isStaff = userInfo.isStaff;
      isSuperUser = userInfo.isSuperuser;
    }
    let newEntryInfoList = cloneDeep(entryInfoList);
    if (isSuperUser) {
      newEntryInfoList.push({ id: '', title: { title_name: '全部' } });
    }

    return (
      <Scrollbar onYReachEnd={this.loadList}>
        <Tabs activeKey={entryInfo} onChange={this.onTabsChange} type={'card'}>
          {newEntryInfoList &&
            newEntryInfoList.length > 0 &&
            newEntryInfoList.map(item => (
              <TabPane tab={item.title.title_name} key={item.id}>
                <List
                  header={<div>填表人员列表</div>}
                  footer={null}
                  bordered
                  className={classNames(styles.list)}
                  dataSource={userEntryList.content}
                  loading={getUserEntryListLoading}
                  renderItem={(item: any, index) => (
                    <>
                      <List.Item
                        className={classNames('flexBetween')}
                        actions={[
                          <Button
                            customtype={'icon'}
                            key={'list-detail'}
                            onClick={() => this.navDetail(item.id)}
                            icon={'container'}
                            title={'查看'}
                          />,
                        ].concat(
                          isSuperUser || !isStaff ? (
                            <Button
                              customtype={'icon'}
                              key={'list-detail'}
                              onClick={() => this.deleteUserEntry(item.id)}
                              icon={'delete'}
                              title={'删除'}
                            />
                          ) : (
                            []
                          ),
                        )}
                      >
                        {isStaff && (
                          <div className={classNames('flexColStart', 'flexAuto')}>
                            <div className={classNames('flexBetween')}>
                              <Link
                                to={`/dashboard/result/${item.id}`}
                                target="_blank"
                                style={{ width: '50%' }}
                              >
                                <div>{item.name}</div>
                              </Link>
                              <div style={{ width: '50%' }}>{item.phone}</div>
                            </div>
                            <div className={styles.created}>{item.created}</div>
                          </div>
                        )}
                        {!isStaff && <div>{item.created}</div>}
                      </List.Item>
                      {!userEntryList.next && index === userEntryList.content.length - 1 && (
                        <div className={styles.loadingTips}>无更多内容</div>
                      )}
                    </>
                  )}
                />
              </TabPane>
            ))}
        </Tabs>
      </Scrollbar>
    );
  }

  renderShareLink() {
    const { entryInfoList } = this.props;
    const userInfo = store.get('userInfo');
    const { isTitle } = userInfo;
    return (
      <div className={classNames(styles.link, 'flexColCenter')}>
        {/* <div>ID版</div>
        {entryInfoList.length > 0 &&
          entryInfoList.map(item => (
            <div key={item.id} className={classNames('flexStart', 'itemCenter')}>
              <div>{'https://cjsq.net/f.html?id=' + item.id}</div>
              <CopyToClipboard
                text={'https://cjsq.net/f.html?id=' + item.id}
                // text={'http://' + window.location.host + '/#/dashboard/f/' + item.id}
                onCopy={this.copySuccess}
              >
                <Button customtype={'master'}>复制链接</Button>
              </CopyToClipboard>
            </div>
          ))}
        <div>原版</div> */}
        {entryInfoList.length > 0 &&
          entryInfoList.map(item => (
            <div key={item.id} className={classNames('flexBetween', 'itemCenter')}>
              <div className={classNames('flexStart', 'itemCenter')}>
                <div className={styles.title}>{item.title.title_name}</div>：
                <a target={'_blank'} href={`https://${preDomain}.${domain}/?id=` + item.id}>
                  {`https://${preDomain}.${domain}/?id=` + item.id}
                </a>
              </div>
              <div className={classNames('flexEnd', 'itemCenter')}>
                <CopyToClipboard
                  text={`https://${preDomain}.${domain}/?id=` + item.id}
                  // text={'http://' + window.location.host + '/#/dashboard/f/' + item.id}
                  onCopy={this.copySuccess}
                >
                  <Button customtype={'icon'} title="复制链接" icon="copy" />
                </CopyToClipboard>
                {isTitle && (
                  <Button
                    customtype={'icon'}
                    title="复制链接"
                    icon="edit"
                    onClick={() => this.openEditTitleModal(item.title.id)}
                  />
                )}
              </div>
            </div>
          ))}
      </div>
    );
  }

  renderLinkButton() {
    return (
      <div className={classNames(styles.link, 'flexColCenter')}>
        <Button customtype={'master'} onClick={this.navForm}>
          健康自检
        </Button>
      </div>
    );
  }

  // renderPassWordModalForm() {
  //   const { passWordModifyModalVisible } = this.state;
  //   const { updatePassWordLoading } = this.props;
  //   const userInfo = store.get('userInfo');
  //   const props = {
  //     items: [
  //       {
  //         type: 'input',
  //         field: 'username',
  //         disabled: true,
  //         autoComplete: 'new-password',
  //         placeholder: '用户名',
  //         initialValue: userInfo ? userInfo.username : '',
  //         rules: [{ required: true, message: '请输入用户名!' }],
  //         fill: true,
  //       },
  //       {
  //         type: 'password',
  //         field: 'password',
  //         autoComplete: 'new-password',
  //         placeholder: '新密码',
  //         rules: [{ required: true, message: '请输入新密码!' }],
  //         fill: true,
  //       },
  //       {
  //         type: 'password',
  //         field: 'reNewPassword',
  //         autoComplete: 'new-password',
  //         placeholder: '再次输入新密码',
  //         fill: true,
  //         rules: [
  //           { required: true, message: '请再次输入新密码!' },
  //           { validator: this.secondPwdValidator },
  //         ],
  //       },
  //     ],
  //     actions: [
  //       {
  //         customtype: 'select',
  //         title: '确定',
  //         htmlType: 'submit' as 'submit',
  //         loading: updatePassWordLoading,
  //       },
  //       { customtype: 'second', title: '暂不修改', onClick: this.onCancelModel },
  //     ],
  //     onSubmit: this.onPassWordModelSubmit,
  //     title: '修改账号及密码',
  //     onCancel: this.onCancelModel,
  //     destroyOnClose: true,
  //     width: '80%',
  //     maskClosable: true,
  //     bodyStyle: {},
  //     modify: passWordModifyModalVisible,
  //     onGetFormRef: (modelForm: WrappedFormUtils) => {
  //       this.passWordModelForm = modelForm;
  //     },
  //   };
  //   return <ModalForm {...props} />;
  // }

  renderTitleForm() {
    const { titleEditModalVisible } = this.state;
    const { titleDetail, updateTitleLoading } = this.props;
    const props = {
      items: [
        {
          type: 'input',
          field: 'title_name',
          placeholder: '副标题名称',
          initialValue: titleDetail ? titleDetail.title_name : '',
          rules: [{ required: true, message: '请输入副标题名称！' }],
          fill: true,
        },
      ],
      actions: [
        {
          customtype: 'select',
          title: '确定',
          htmlType: 'submit' as 'submit',
          loading: updateTitleLoading,
        },
        { customtype: 'second', title: '暂不修改', onClick: this.onCancelModel },
      ],
      onSubmit: this.onTitleModelSubmit,
      title: '修改副标题',
      onCancel: this.onCancelModel,
      destroyOnClose: true,
      width: '80%',
      maskClosable: true,
      bodyStyle: {},
      modify: titleEditModalVisible,
      onGetFormRef: (modelForm: WrappedFormUtils) => {
        this.titleModelForm = modelForm;
      },
    };
    return <ModalForm {...props} />;
  }

  render() {
    const userInfo = store.get('userInfo');
    let isStaff = false;
    if (userInfo) {
      isStaff = userInfo.isStaff;
    }
    return (
      <div className={classNames('height100', 'flexColCenter', 'itemCenter', styles.container)}>
        {/* <div className={classNames('flexEnd', styles.passwordBtn)}>
          <div />
          <Button customtype={'master'} onClick={this.openEditPassWordModal}>
            修改账户密码
          </Button>
        </div> */}
        {isStaff && this.renderShareLink()}
        {!isStaff && this.renderLinkButton()}
        {isStaff && this.renderSearchForm()}
        {this.renderList()}
        {/* {this.renderPassWordModalForm()} */}
        {this.renderTitleForm()}
        {this.renderConfirm()}
      </div>
    );
  }

  onTitleModelSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { dispatch } = this.props;
    this.titleModelForm.validateFields(async (err, fieldsValue) => {
      if (!err) {
        const { titleDetail } = this.props;
        fieldsValue.id = titleDetail.id;
        const { success } = await dispatch({
          type: 'home/updateTitle',
          payload: fieldsValue,
        });
        if (success) {
          Message.success('修改成功');
          this.onCancelModel();
        }
      }
    });
  };

  // onPassWordModelSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   const { dispatch } = this.props;
  //   this.passWordModelForm.validateFields(async (err, fieldsValue) => {
  //     if (!err) {
  //       delete fieldsValue.reNewPassword;
  //       const userInfo = store.get('userInfo');
  //       fieldsValue.id = userInfo.id;
  //       const { success } = await dispatch({
  //         type: 'home/updatePasswordAndUsername',
  //         payload: fieldsValue,
  //       });
  //       if (success) {
  //         Message.success('修改成功');
  //         this.onCancelModel();
  //       }
  //     }
  //   });
  // };

  // secondPwdValidator = (rule, value, callback) => {
  //   const newPwd = this.passWordModelForm.getFieldValue('password');
  //   if (newPwd && newPwd !== value) {
  //     callback(new Error('新密码不一致！'));
  //   } else {
  //     callback();
  //   }
  // };

  onCancelModel = () => {
    this.setState({
      passWordModifyModalVisible: false,
      titleEditModalVisible: false,
    });
  };

  // openEditPassWordModal = () => {
  //   this.setState({
  //     passWordModifyModalVisible: true,
  //   });
  // };

  openEditTitleModal = async id => {
    const data = await this.props.dispatch({
      type: 'home/getTitleDetail',
      payload: { id },
    });
    if (data)
      this.setState({
        titleEditModalVisible: true,
      });
  };

  onTabsChange = key => {
    const { searchFileds } = this.state;
    searchFileds.page = 1;
    this.setState({ entryInfo: key }, () => this.getUserEntryList(searchFileds));
  };

  navForm = () => {
    const { entryInfoList } = this.props;
    if (entryInfoList.length > 0) {
      router.push(`/dashboard/f/${entryInfoList[0].id}`);
    }
  };

  loadList = _container => {
    const { searchFileds } = this.state;
    const { getUserEntryListLoading, userEntryList } = this.props;
    if (getUserEntryListLoading || !userEntryList.next) return;
    searchFileds.page++;
    this.getUserEntryList(searchFileds);
  };

  copySuccess = () => {
    Message.success('复制成功');
  };

  onGetFormRef = (form: WrappedFormUtils) => {
    this.searchForm = form;
  };

  navDetail = id => {
    router.push(`/dashboard/result/${id}`);
  };

  onSearch = (e: React.FormEvent<HTMLFormElement>) => {
    if (e) {
      e.preventDefault();
    }
    this.searchForm.validateFields((err, fieldsValue) => {
      if (err) return;
      fieldsValue.page = 1;
      this.getUserEntryList(fieldsValue);
    });
  };

  searchFormReset = () => {
    this.searchForm.resetFields();
    this.getUserEntryList({ page: 1 });
  };

  getUserEntryList = Fileds => {
    const { dispatch } = this.props;
    Fileds.entry_info = this.state.entryInfo;
    this.setState({
      searchFileds: Fileds,
    });
    dispatch({ type: 'home/getUserEntryList', payload: { ...Fileds } });
  };
}

export default Home;
