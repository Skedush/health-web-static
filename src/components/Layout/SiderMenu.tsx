import React, { PureComponent } from 'react';
import { Menu, Icon } from '@/components/Library';
import styles from './SiderMenu.less';
import withRouter from 'umi/withRouter';
import classNames from 'classnames';
import { queryAncestors } from '@/utils';
import { RouteList } from '@/utils/config';
import store from 'store';
import Navlink from 'umi/navlink';
import { RouteComponentProps } from 'react-router';

const { SubMenu } = Menu;

interface SiderMenuProps extends RouteComponentProps {
  routeList: RouteList[];
  collapsed: boolean;
  onCollapseChange: Function;
}

interface SiderMenuState {
  openKeys: string[];
}
class SiderMenu extends PureComponent<SiderMenuProps, SiderMenuState> {
  constructor(props: Readonly<SiderMenuProps>) {
    super(props);

    this.state = { openKeys: store.get('openKeys') || [] };
  }

  renderMenus = data => {
    return data.map(item => {
      if (item.children && item.children.length > 0) {
        return (
          <SubMenu
            key={item.id}
            title={
              <span>
                {item.icon && <Icon type={item.icon} />}
                <span>{item.name}</span>
              </span>
            }
          >
            {this.renderMenus(item.children)}
          </SubMenu>
        );
      }
      return (
        <Menu.Item key={item.id}>
          <Navlink to={item.route || '#'}>
            {item.icon && <Icon type={item.icon} />}
            <span>{item.name}</span>
          </Navlink>
        </Menu.Item>
      );
    });
  };

  render() {
    const { routeList, location, collapsed, onCollapseChange } = this.props;
    const selectedKeys = queryAncestors(routeList, location.pathname).map(_ => _.id + '');
    const menuProps = collapsed
      ? {}
      : {
          openKeys: this.state.openKeys,
        };

    return (
      <Menu
        mode={'inline'}
        onOpenChange={this.onOpenChange}
        selectedKeys={selectedKeys}
        style={{ height: '100%', borderRight: 0 }}
        className={styles.menu}
        {...menuProps}
      >
        <div className={styles.menuTitle}>
          {!collapsed ? <div className={styles.titleSpan}>{'工作台'}</div> : ''}
          <Icon
            className={classNames(styles.trigger, {
              [styles.icontarget]: collapsed,
            })}
            type={collapsed ? 'menu-unfold' : 'menu-fold'}
            onClick={onCollapseChange.bind(this, !collapsed)}
          />
        </div>
        {this.renderMenus(routeList)}
      </Menu>
    );
  }

  onOpenChange = openKeys => {
    const { routeList } = this.props;
    const rootSubmenuKeys = routeList.filter(_ => !_.parentId).map(_ => _.id);

    const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);

    let newOpenKeys = openKeys;
    if (rootSubmenuKeys.indexOf(latestOpenKey) !== -1) {
      newOpenKeys = latestOpenKey ? [latestOpenKey] : [];
    }

    this.setState({
      openKeys: newOpenKeys,
    });
    store.set('openKeys', newOpenKeys);
  };
}

export default withRouter(SiderMenu);
