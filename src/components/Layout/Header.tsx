import React, { PureComponent } from 'react';
import { Layout } from 'antd';
import styles from './Header.less';
import { connect } from '@/utils/decorators';
import Img from 'react-image';
import AntdIcon from '@/components/Library/Icon';
import { Menu, Dropdown } from '@/components/Library';
import { GlobalState } from '@/common/type';
import { router } from '@/utils';

import UsageGuide from '../Library/UsageGuide';
import HelpModal from '../globalComponents/HelpModal';

const mapStateToProps = ({ app, helpGlobal }: GlobalState) => ({
  userInfo: app.userInfo,
  administrator: app.administrator,
  helpData: helpGlobal.helpData,
  usageGuideVisible: app.usageGuideVisible,
});

// type HearderStateProps = ReturnType<typeof mapStateToProps>;
// type HeaderProps = HearderStateProps & UmiComponentProps;

interface State {
  helpVisible: boolean;
}

@connect(
  mapStateToProps,
  null,
)
class Header extends PureComponent<any, State> {
  constructor(props) {
    super(props);
    this.state = {
      helpVisible: false,
    };
  }
  componentDidMount() {}

  renderUsageGuide() {
    return <UsageGuide onCancel={this.cancelGuide} />;
  }
  renderUsageHelp() {
    const { helpVisible } = this.state;
    return (
      <HelpModal
        helpData={this.props.helpData}
        helpVisible={helpVisible}
        cancelHelp={this.cancelHelp}
      />
    );
  }

  renderMenuList() {
    return (
      <Menu className={styles.overlayClassName}>
        <div className={styles.dropTitle}>个人档案</div>
        <Menu.Divider />
        <Menu.Item onClick={this.navInit}>
          <AntdIcon type={'profile'} />
          初始化
        </Menu.Item>
        <Menu.Item onClick={this.openGuide}>
          <AntdIcon type={'profile'} />
          使用指南
        </Menu.Item>
        <Menu.Item onClick={this.openHelp}>
          <AntdIcon type={'question-circle'} />
          帮助文档
        </Menu.Item>
        <Menu.Item onClick={this.loginout}>
          <AntdIcon type={'pm-power-off'} />
          退出
        </Menu.Item>
      </Menu>
    );
  }

  render() {
    const { userInfo, administrator } = this.props;
    return (
      <Layout.Header className={styles.header}>
        {this.renderUsageGuide()}
        {this.renderUsageHelp()}
        <div className={styles.logo}>
          <Img src={require('../../assets/images/logo.png')} />
          <p>{administrator && administrator.name}物业助手</p>
        </div>
        <div className={styles.right}>
          <Img src={require('@/assets/images/residents.png')} />
          <div className={styles.admin}>
            <div className={styles.name}>{userInfo && userInfo.name}</div>
            {/* <div className={styles.position}>{userInfo && userInfo.roleName}</div> */}
          </div>
          <div className={styles.loginOut}>
            <Dropdown
              overlay={this.renderMenuList()}
              className={styles.dropdown}
              overlayClassName={styles.dropdownBody}
            >
              <div>
                {/* {userInfo && userInfo.roleName} */}
                <AntdIcon type={'caret-down'} />
              </div>
            </Dropdown>
            {/* <AntdIcon type={'pm-power-off'} className={styles.quitIcon} onClick={this.loginout} /> */}
          </div>
        </div>
      </Layout.Header>
    );
  }

  navInit = () => {
    router.push('/initialization');
  };

  openGuide = () => {
    this.props.dispatch({ type: 'app/operateUsageGuide', visible: true });
  };

  openHelp = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'helpGlobal/getHelpData',
    });
    this.setState({
      helpVisible: true,
    });
  };
  cancelHelp = () => {
    this.setState({
      helpVisible: false,
    });
  };
  cancelGuide = () => {
    this.props.dispatch({ type: 'app/operateUsageGuide', visible: false });
  };

  loginout = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'app/logout',
    }).then(res => {
      if (res) {
        localStorage.clear();
        router.push({ pathname: '/login' });
      }
    });
  };
}

export default Header;
