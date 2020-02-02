import React, { PureComponent } from 'react';
import { TreeSelect as AntdTreeSelect } from 'antd';
import { TreeSelectProps as AntdTreeSelectProps } from 'antd/lib/tree-select';
import styles from './index.less';
import classNames from 'classnames';

export interface TreeSelectProps extends AntdTreeSelectProps<any> {}

class TreeSelect extends PureComponent<TreeSelectProps> {
  static TreeNode = AntdTreeSelect.TreeNode;

  static SHOW_ALL = AntdTreeSelect.SHOW_ALL;
  static SHOW_PARENT = AntdTreeSelect.SHOW_PARENT;
  static SHOW_CHILD = AntdTreeSelect.SHOW_CHILD;

  render() {
    const dropdownClassName = this.props.dropdownClassName;
    return (
      <div className={styles.treeSelect}>
        <AntdTreeSelect
          {...this.props}
          dropdownClassName={classNames(styles.dropDown, dropdownClassName)}
        />
      </div>
    );
  }
}
export default TreeSelect;
