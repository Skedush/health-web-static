/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */
/* eslint-disable no-dupe-class-members */
import React, { PureComponent, createRef, RefObject } from 'react';
import { connect } from '@/utils/decorators';
import classNames from 'classnames';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { router } from '@/utils';
import {
  FormComponentProps,
  WrappedFormUtils,

  // PaginationConfig,
} from '@/components/Library/type';
import { SearchForm, Button, Confirm, Message, List } from '@/components/Library';
// import dark from '@/themes/templates/dark';
// import light from '@/themes/templates/light';
import { GlobalState, UmiComponentProps } from '@/common/type';
import styles from './index.less';

// import { add, minus } from '@/actions/app';

const mapStateToProps = ({ home }: GlobalState) => {
  return {
    userEntryList: home.userEntryList,
    entryInfoList: home.entryInfoList,
  };
};

type HomeStateProps = ReturnType<typeof mapStateToProps>;
type HomeProps = HomeStateProps & UmiComponentProps & FormComponentProps;

interface HomeState {
  entryInfo: number;
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
    };
  }

  async componentDidMount() {
    const { dispatch } = this.props;
    const data = await dispatch({ type: 'home/getEntryInfoList', payload: {} });
    if (data) {
      this.setState(
        {
          entryInfo: data[0].id,
        },
        () => {
          this.getUserEntryList({});
        },
      );
    }
  }

  renderSearchForm() {
    const SearchFormProps = {
      items: [{ type: 'input', field: 'search', placeholder: '姓名或电话' }],
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
    const { userEntryList } = this.props;
    return (
      <List
        header={<div>填表人员列表</div>}
        footer={null}
        bordered
        className={classNames(styles.list)}
        dataSource={userEntryList}
        renderItem={item => (
          <List.Item
            className={classNames('flexBetween')}
            actions={[
              <Button
                customtype={'icon'}
                key="list-detail"
                onClick={() => this.navDetail(item.id)}
                icon={'container'}
                title={'查看'}
              />,
            ]}
          >
            <div>{item.name}</div>
            <div>{item.phone}</div>
          </List.Item>
        )}
      />
    );
  }

  render() {
    const { entryInfoList } = this.props;
    return (
      <div className={classNames('height100', 'flexColCenter', 'itemCenter')}>
        <div className={styles.link}>
          {entryInfoList.length > 0 &&
            entryInfoList.map(item => (
              <div key={item.id} className={classNames('flexCenter', 'itemCenter')}>
                <div>{'http://' + window.location.host + '/#/dashboard/fillform/' + item.id}</div>
                <CopyToClipboard
                  text={'http://' + window.location.host + '/#/dashboard/fillform/' + item.id}
                  onCopy={this.copySuccess}
                >
                  <Button customtype={'master'}>复制链接</Button>
                </CopyToClipboard>
              </div>
            ))}
        </div>
        {this.renderSearchForm()}
        {this.renderList()}
      </div>
    );
  }

  copySuccess = () => {
    // if (this.confirmRef.current) {
    //   this.confirmRef.current.open(() => {}, '成功', '复制成功', 'success');
    // }
    Message.success('复制成功');
  };

  onGetFormRef = (form: WrappedFormUtils) => {
    this.searchForm = form;
  };

  navDetail = id => {
    console.log('id: ', id);
    router.push(`/dashboard/result/${id}`);
  };

  onSearch = (e: React.FormEvent<HTMLFormElement>) => {
    if (e) {
      e.preventDefault();
    }
    this.searchForm.validateFields((err, fieldsValue) => {
      if (err) return;
      this.getUserEntryList(fieldsValue);
    });
  };

  searchFormReset = () => {
    this.searchForm.resetFields();
    this.getUserEntryList({});
  };

  getUserEntryList = Fileds => {
    const { dispatch } = this.props;
    Fileds.entry_info = this.state.entryInfo;
    dispatch({ type: 'home/getUserEntryList', payload: { ...Fileds } });
  };
}

export default Home;
