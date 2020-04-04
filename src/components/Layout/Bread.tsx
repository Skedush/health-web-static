import React, { PureComponent, Fragment } from 'react';
import { Breadcrumb } from 'antd';
import Link from 'umi/navlink';
import withRouter from 'umi/withRouter';
import { queryAncestors } from '@/utils';
import { RouteList } from '@/utils/config';
import { RouteComponentProps } from 'react-router';
import styles from './Bread.less';

interface BreadProps extends RouteComponentProps {
  routeList: RouteList[];
}

class Bread extends PureComponent<BreadProps> {
  renderBreadcrumbs = paths => {
    return paths.map((item, key) => {
      const content = (
        <Fragment>
          {/* {item.icon ? <Icon type={item.icon} style={{ marginRight: 4 }} /> : null} */}
          {item.name}
        </Fragment>
      );
      return (
        <Breadcrumb.Item key={key}>
          {paths.length - 1 !== key ? <Link to={item.route || '#'}>{content}</Link> : content}
        </Breadcrumb.Item>
      );
    });
  };

  render() {
    const { routeList, location } = this.props;
    const paths = queryAncestors(routeList, location.pathname);
    return <Breadcrumb className={styles.bread}>{this.renderBreadcrumbs(paths)}</Breadcrumb>;
  }
}

export default withRouter(Bread);
