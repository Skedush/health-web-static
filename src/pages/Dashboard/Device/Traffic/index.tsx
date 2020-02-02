/**
 * 陈剑鸣
 * 通行位置，绑定解绑
 */

import React, { PureComponent, RefObject, createRef } from 'react';
import styles from './index.less';
import { connect } from '@/utils/decorators';
import classNames from 'classnames';
import { WrappedFormUtils } from '@/components/Library/type';
import { GlobalState, UmiComponentProps } from '@/common/type';
import TrafficModal from './components/index';
import brake from '@/assets/images/brake.png';
import brake2 from '@/assets/images/brake2.png';
import equipment from '@/assets/images/equipment-traffic.png';
import equipmentType from '@/assets/images/type.png';
import equipment2 from '@/assets/images/equipment-traffic2.png';
import { Button, Img, Icon, Tree, Message, Confirm, OperatingResults } from '@/components/Library';
import { isEmpty } from 'lodash';
import { SUCCESS_UNBINDING } from '@/utils/message';

const DirectoryTree = Tree.DirectoryTree;
const { TreeNode } = Tree;

const mapStateToProps = ({ traffic }: GlobalState) => {
  return {
    trafficTreeList: traffic.trafficTreeList,
    tradfficData: traffic.tradfficData,
    carData: traffic.carData,
    doorData: traffic.doorData,
    deviceCount: traffic.deviceCount,
  };
};

type TrafficStateProps = ReturnType<typeof mapStateToProps>;
type TrafficProps = TrafficStateProps & UmiComponentProps;

interface TrafficState {
  add: boolean;
  modify: boolean;
  modifyData: any;
  multiple4: boolean;
  unitId: number | string | undefined;
  type: any;
  tableData: any;
  unitName: string;
  operatingResultsVisible: boolean;
  batchHandleResultsData: { [propName: string]: any };
}

@connect(
  mapStateToProps,
  null,
)
class Traffic extends PureComponent<any, TrafficState> {
  form: WrappedFormUtils;
  confirmRef: RefObject<Confirm>;
  constructor(props: Readonly<TrafficProps>) {
    super(props);
    this.confirmRef = createRef();
    this.state = {
      multiple4: false,
      add: false,
      modify: false,
      modifyData: {},
      unitId: undefined,
      type: '',
      tableData: {},
      unitName: '',
      operatingResultsVisible: false,
      batchHandleResultsData: {},
    };
  }

  componentDidMount() {
    this.featch();
  }

  renderConfirm() {
    return <Confirm type={'warning'} ref={this.confirmRef} />;
  }

  renderOperatingResults() {
    const { operatingResultsVisible, batchHandleResultsData } = this.state;
    const props = {
      visible: operatingResultsVisible,
      onCancel: this.onCancelOperatingResults,
      data: batchHandleResultsData,
    };
    return <OperatingResults {...props} />;
  }

  // 设备列表
  renderDeviceList(data: Array<any>) {
    return data && data.length
      ? data.map(item => {
          return (
            <div
              key={item.id}
              className={classNames(styles.itemNormal, styles.item, 'flexColBetween')}
            >
              <div className={classNames('flexStart', 'itemCenter')}>
                <Img
                  className={styles.icon}
                  image={
                    item.type !== '1'
                      ? item.status === '1'
                        ? brake
                        : brake2
                      : item.status === '1'
                      ? equipment
                      : equipment2
                  }
                />
                <div className={styles.title}>{item.name}</div>
              </div>
              <div className={classNames('flexStart', 'itemCenter')}>
                <Img className={styles.typeIcon} image={equipmentType} />
                <div className={styles.type}>{item.deviceTypeStr}</div>
              </div>
              <div className={classNames('flexEnd')}>
                <Button
                  customtype={'icon'}
                  icon={'link'}
                  title={'解绑'}
                  onClick={() => this.unBinding(item.id)}
                />
              </div>
            </div>
          );
        })
      : '';
  }

  renderList() {
    const { carData, doorData, deviceCount } = this.props;
    const { add, unitId, tableData, unitName } = this.state;
    return (
      <div className={classNames(styles.list, 'flexColStart')}>
        <div className={classNames(styles.headerCard)}>
          <div>
            <span>通行点</span>
            <p>{unitName || ''}</p>
          </div>
          <div>
            <span>设备数量</span>
            <p>{deviceCount}</p>
          </div>
        </div>
        <TrafficModal
          addModal={add}
          title={'选择设备'}
          cancelModel={this.cancelModel}
          unitId={unitId}
          data={tableData}
          pagination={this.pagination}
        />
        <div className={classNames('flexColStart', styles.contentBox)}>
          <div className={classNames('flexStart', 'flexWrap')}>
            <div
              className={classNames(styles.addItem, styles.item, 'flexColCenter', 'itemCenter')}
              onClick={() => this.add('1')}
            >
              <Icon type={'pm-add'} />
              <div className={styles.addText}>{`绑定门禁设备`}</div>
            </div>
            {this.renderDeviceList(carData || null)}
          </div>

          <div className={classNames('flexStart', 'flexWrap')}>
            <div
              className={classNames(styles.addItem, styles.item, 'flexColCenter', 'itemCenter')}
              onClick={() => this.add('2')}
            >
              <Icon type={'pm-add'} />
              <div className={styles.addText}>{`绑定道闸设备`}</div>
            </div>
            {this.renderDeviceList(doorData || null)}
          </div>
        </div>
      </div>
    );
  }
  // 树形控件子元素
  renderTreeNodes = data => {
    if (isEmpty(data) || !data) {
      return;
    }
    return data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.name} key={item.id}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode title={item.name} key={item.id} />;
    });
  };
  // 树形控件
  renderTree() {
    const { trafficTreeList } = this.props;
    if (!trafficTreeList || isEmpty(trafficTreeList)) {
      return null;
    }
    return (
      <DirectoryTree
        onSelect={this.onSelect}
        defaultExpandAll
        showIcon={false}
        defaultSelectedKeys={[
          trafficTreeList && trafficTreeList.children.length
            ? trafficTreeList.children[0].id.toString()
            : '1',
        ]}
      >
        {this.renderTreeNodes(trafficTreeList ? [trafficTreeList] : [])}
      </DirectoryTree>
    );
  }

  render() {
    const { unitId } = this.state;
    console.log('unitId: ', unitId);
    return (
      <div className={classNames('height100', 'flexColStart')}>
        <div className={'listTitle'}>通行位置管理</div>
        <div className={classNames('flexAuto', styles.content)}>
          <div className={classNames(styles.left)}>{this.renderTree()}</div>
          <div className={classNames('flexColStart', styles.contentRight)}>
            {unitId ? this.renderList() : ''}
          </div>
        </div>
        {this.renderConfirm()}
        {this.renderOperatingResults()}
      </div>
    );
  }
  // 解绑
  unBinding = (id: number) => {
    if (this.confirmRef.current) {
      this.confirmRef.current.open(() => this.removeBinding(id), '解绑', '是否确认解绑？');
    }
  };
  removeBinding = item => {
    const { dispatch, trafficTreeList } = this.props;
    const { unitId } = this.state;
    let passPositionId: any = '';
    if (!unitId) {
      passPositionId = trafficTreeList[0].id;
    } else {
      passPositionId = unitId;
    }
    dispatch({
      type: 'traffic/positionUnbind',
      payload: { passPositionId, deviceId: item },
    }).then(res => {
      if (res && res.data && res.data.success) {
        const { unitId } = this.state;
        this.onClickUnit(unitId);
        Message.success(SUCCESS_UNBINDING);
      } else if (res && res.data && res.data.error) {
        this.setState({ operatingResultsVisible: true, batchHandleResultsData: res.data });
      }
    });
  };
  // 绑定弹窗
  add = type => {
    const { dispatch } = this.props;
    if (type === '1') {
      dispatch({ type: 'traffic/getDeviceDoor' }).then(data => {
        this.setState({
          tableData: data,
        });
      });
    } else {
      dispatch({
        type: 'traffic/getDeviceCar',
      }).then(data => {
        this.setState({
          tableData: data,
        });
      });
    }
    this.setState({
      add: true,
      modify: false,
    });
  };

  featch = async () => {
    const { dispatch } = this.props;
    dispatch({ type: 'traffic/getPositionList' }).then(data => {
      if (data && data.children && data.children.length) {
        this.onClickUnit(data.children[0].id);
        this.setState({
          unitName: data.children[0].name,
        });
      }
    });
  };
  // 错误提示框
  onCancelOperatingResults = () => {
    this.setState({ operatingResultsVisible: false });
  };
  // 树形控件选中
  onSelect = (selectedKeys, info) => {
    const { trafficTreeList } = this.props;
    if (selectedKeys[0].toString() !== trafficTreeList.id.toString()) {
      this.setState({
        unitName: info.node.props.title,
      });
      this.onClickUnit(selectedKeys.toString());
    } else {
      this.setState({
        unitName: '',
        unitId: undefined,
      });
    }
  };

  // 点击通行位置
  onClickUnit = id => {
    this.setState({
      unitId: id,
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'traffic/getPositionDeviceList',
      payload: { id },
    });
  };
  // 关闭弹窗
  cancelModel = () => {
    const { unitId } = this.state;
    this.onClickUnit(unitId);
    this.setState({
      add: false,
    });
  };
  // 子组件table分页
  pagination = searchFields => {
    const { type } = this.state;
    const { dispatch } = this.props;
    if (type === '1') {
      dispatch({ type: 'traffic/getDeviceDoor', payload: searchFields }).then(data => {
        this.setState({
          tableData: data,
        });
      });
    } else {
      dispatch({
        type: 'traffic/getDeviceCar',
        payload: searchFields,
      }).then(data => {
        this.setState({
          tableData: data,
        });
      });
    }
  };
}
export default Traffic;
