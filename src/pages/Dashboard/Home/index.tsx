/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */
/* eslint-disable no-dupe-class-members */
// import dark from '@/themes/templates/dark';
// import light from '@/themes/templates/light';
import { GlobalState, UmiComponentProps } from '@/common/type';
import { Button, Confirm, List, Message, SearchForm, Tabs } from '@/components/Library';
import { FormComponentProps, WrappedFormUtils } from '@/components/Library/type';
import { router } from '@/utils';
import { connect } from '@/utils/decorators';
import classNames from 'classnames';
import { isEmpty } from 'lodash';
import React, { createRef, PureComponent, RefObject } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Scrollbar from 'react-perfect-scrollbar';
import store from 'store';
import styles from './index.less';

const { TabPane } = Tabs;

// import { add, minus } from '@/actions/app';

const mapStateToProps = ({ home, loading: { effects } }: GlobalState) => {
  return {
    userEntryList: home.userEntryList,
    entryInfoList: home.entryInfoList,
    getUserEntryListLoading: effects['home/getUserEntryList'],
  };
};

type HomeStateProps = ReturnType<typeof mapStateToProps>;
type HomeProps = HomeStateProps & UmiComponentProps & FormComponentProps;

interface HomeState {
  entryInfo: number;
  searchFileds: any;
}

@connect(
  mapStateToProps,
  null,
)
class Home extends PureComponent<HomeProps, HomeState> {
  searchForm: WrappedFormUtils;
  confirmRef: RefObject<Confirm> = createRef();

  constructor(props: Readonly<HomeProps>) {
    super(props);
    this.state = {
      entryInfo: 0,
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
          entryInfo: data[0].id,
        },
        () => {
          this.getUserEntryList(searchFileds);
        },
      );
    }
  }

  renderSearchForm() {
    const SearchFormProps = {
      items: [{ type: 'input', field: 'search', placeholder: '姓名或电话或ID' }],
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
    if (isEmpty(userEntryList)) return null;
    const userInfo = store.get('userInfo');
    let isStaff = false;
    if (userInfo) {
      isStaff = userInfo.isStaff;
    }
    return (
      <Scrollbar onYReachEnd={this.loadList}>
        <Tabs onChange={this.onTabsChange} type={'card'}>
          {entryInfoList &&
            entryInfoList.length > 0 &&
            entryInfoList.map(item => (
              <TabPane tab={item.category.name} key={item.id}>
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
                        ]}
                      >
                        {isStaff && (
                          <div className={classNames('flexColStart', 'flexAuto')}>
                            <div className={classNames('flexBetween')}>
                              <div style={{ width: '50%' }}>{item.name}</div>
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
            <div key={item.id} className={classNames('flexStart', 'itemCenter')}>
              <div>
                {item.category.name}：
                <a target={'_blank'} href={'https://cjsq.net/?id=' + item.id}>
                  {'https://cjsq.net/?id=' + item.id}
                </a>
              </div>
              <CopyToClipboard
                text={'https://cjsq.net/?id=' + item.id}
                // text={'http://' + window.location.host + '/#/dashboard/f/' + item.id}
                onCopy={this.copySuccess}
              >
                <Button customtype={'master'}>复制链接</Button>
              </CopyToClipboard>
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

  render() {
    const userInfo = store.get('userInfo');
    let isStaff = false;
    if (userInfo) {
      isStaff = userInfo.isStaff;
    }
    return (
      <div className={classNames('height100', 'flexColCenter', 'itemCenter', styles.container)}>
        {isStaff && this.renderShareLink()}
        {!isStaff && this.renderLinkButton()}
        {this.renderSearchForm()}
        {this.renderList()}
      </div>
    );
  }

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
