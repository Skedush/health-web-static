import React, { PureComponent } from 'react';
import { PageHeader as AntdPageHeader } from 'antd';
import { PageHeaderProps as AntdPageHeaderProps } from 'antd/lib/page-header';
// import styles from './index.less';
// import classNames from 'classnames';

export interface PageHeaderProps extends AntdPageHeaderProps {}

class PageHeader extends PureComponent<PageHeaderProps> {
  render() {
    return <AntdPageHeader {...this.props} />;
  }
}
export default PageHeader;
