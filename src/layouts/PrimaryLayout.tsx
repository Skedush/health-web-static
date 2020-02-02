import React, { PureComponent, Fragment } from 'react';
import withRouter from 'umi/withRouter';
// import classNames from 'classnames';
import { connect } from '@/utils/decorators';
import { MyLayout } from '@/components';
import { UmiComponentProps, GlobalState } from '@/common/type';
import { Layout } from '@/components/Library';
import styles from './PrimaryLayout.less';

const { Content } = Layout;
const { Header, Footer } = MyLayout;
const { Bread, Sider } = MyLayout;

const mapStateToProps = (state: GlobalState) => {
  return { routeList: state.app.routeList, loading: state.loading, collapsed: state.app.collapsed };
};

type PageStateProps = ReturnType<typeof mapStateToProps>;
type PrimaryLayoutProps = UmiComponentProps & PageStateProps;

@connect(
  mapStateToProps,
  null,
)
class PrimaryLayout extends PureComponent<PrimaryLayoutProps> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { children, routeList, collapsed } = this.props;

    return (
      <Fragment>
        <Layout className={'height100'}>
          <Header />
          <Layout className={styles.around}>
            <Sider
              routeList={routeList}
              collapsed={collapsed}
              onCollapseChange={this.onCollapseChange}
            />
            <Layout className={styles.page}>
              <Bread routeList={routeList} />
              <Content>{children}</Content>
              <Footer />
            </Layout>
          </Layout>
        </Layout>
      </Fragment>
    );
  }
  onCollapseChange = collapsed => {
    this.props.dispatch({
      type: 'app/handleCollapseChange',
      payload: collapsed,
    });
  };
}

export default withRouter(PrimaryLayout);
