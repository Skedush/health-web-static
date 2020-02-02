import React, { PureComponent } from 'react';
import { connect } from '@/utils/decorators';
import { GlobalState, UmiComponentProps } from '@/common/type';
import styles from './index.less';
import classNames from 'classnames';
import PermitForm from './components/PermitForm';

const mapStateToProps = (state: GlobalState) => {
  return {
    state,
    loading: state.loading.effects['visitRecord/getVisitRecordList'],
  };
};

interface Props extends ReturnType<typeof mapStateToProps>, UmiComponentProps {}

interface State {
  dataSource: any[];
  formTreeData: any[];
  currentPermit: number;
}

@connect(
  mapStateToProps,
  null,
)
export default class Permit extends PureComponent<Props, State> {
  queryCondition: any;

  selectedList: any[];

  constructor(props) {
    super(props);
    this.state = {
      currentPermit: 0,
      dataSource: [],
      formTreeData: [],
    };
  }

  componentDidMount() {
    this.getList();
  }

  renderTable(type: 'person' | 'car') {
    const { dataSource, formTreeData } = this.state;
    return (
      <div className={classNames(styles.table)}>
        <PermitForm
          getList={() => this.getList()}
          treeData={formTreeData}
          dataSource={dataSource}
          type={type}
        />
      </div>
    );
  }

  renderLeft() {
    const { currentPermit } = this.state;
    return (
      <div className={styles.left}>
        <div
          onClick={() => this.changePermit(0)}
          className={classNames(styles.leftMenu, currentPermit === 0 ? styles.menuSelected : '')}
        >
          人员通行证
        </div>
        <div
          onClick={() => this.changePermit(1)}
          className={classNames(styles.leftMenu, currentPermit === 1 ? styles.menuSelected : '')}
        >
          车辆通行证
        </div>
      </div>
    );
  }

  render() {
    const { currentPermit } = this.state;
    return (
      <div className={classNames('height100', styles.permit)}>
        <div className={styles.header}>通行证</div>
        <div className={styles.container}>
          {this.renderLeft()}
          {currentPermit === 0 ? this.renderTable('person') : this.renderTable('car')}
        </div>
      </div>
    );
  }

  async getList() {
    const { currentPermit } = this.state;
    const data = await this.props.dispatch({
      type: 'permit/getPermitList',
      data: { type: currentPermit === 0 ? 1 : 2 },
    });
    const treeData = await this.props.dispatch({
      type: 'permit/getPositionList',
      data: { type: (currentPermit + 1).toString() },
    });
    this.setState({
      formTreeData: [treeData],
    });
    this.setState({
      dataSource: data,
    });
  }

  changePermit(index) {
    this.setState(
      {
        currentPermit: index,
        dataSource: [],
      },
      () => {
        this.getList();
      },
    );
  }
}
