import React, { PureComponent } from 'react';
import { Layout } from 'antd';
import ScrollBar from '../ScrollBar';
import { RouteList } from '@/utils/config';
import SiderMenu from './SiderMenu';
import styles from './Sider.less';

interface SiderProps {
  routeList: RouteList[];
  collapsed: boolean;
  onCollapseChange: Function;
}

class Sider extends PureComponent<SiderProps> {
  render() {
    const { routeList, collapsed, onCollapseChange } = this.props;
    return (
      <Layout.Sider
        breakpoint={'lg'}
        trigger={null}
        collapsible
        collapsed={collapsed}
        theme={'light'}
        className={styles.sider}
      >
        <div className={styles.menuContainer}>
          <ScrollBar
            options={{
              // Disabled horizontal scrolling, https://github.com/utatti/perfect-scrollbar#options
              suppressScrollX: true,
            }}
          >
            <SiderMenu
              routeList={routeList}
              collapsed={collapsed}
              onCollapseChange={onCollapseChange}
            />
          </ScrollBar>
        </div>
      </Layout.Sider>
    );
  }
}

export default Sider;
