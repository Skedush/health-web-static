import { Tabs as AntdTabs } from 'antd';
import { TabsProps as AntdTabsProps } from 'antd/lib/tabs';
import styles from './index.less';
import { Component } from 'react';
import classNames from 'classnames';

export interface TabsProps extends AntdTabsProps {
  hiddenTabButton?: boolean;
}
class Tabs extends Component<TabsProps> {
  static TabPane = AntdTabs.TabPane;

  render() {
    const { children, hiddenTabButton, className, ...option } = this.props;
    const hiddenClass = hiddenTabButton ? styles.hiddenTabsBtn : '';
    return (
      <AntdTabs className={classNames(hiddenClass, styles.tabs, className)} {...option}>
        {children}
      </AntdTabs>
    );
  }
}

export default Tabs;
