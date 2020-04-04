import React from 'react';
import withRouter from 'umi/withRouter';
import { RouteComponentProps } from 'react-router';
import BaseLayout from './BaseLayout';

interface LayoutProps extends RouteComponentProps<any> {}

class Layout extends React.Component<LayoutProps> {
  render() {
    const { children } = this.props;
    return <BaseLayout>{children}</BaseLayout>;
  }
}

export default withRouter(Layout);
