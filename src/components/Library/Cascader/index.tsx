// import { Cascader } from 'antd';
// export default Cascader;
import React, { PureComponent } from 'react';
import { Cascader as AntdCascader } from 'antd';
import {
  CascaderProps as AntdCascaderProps,
  CascaderOptionType as AntdCascaderOptionType,
} from 'antd/lib/cascader';
import styles from './index.less';
import classNames from 'classnames';
export interface CascaderOptionType extends AntdCascaderOptionType {}

export interface CascaderProps extends AntdCascaderProps {}

class Cascader extends PureComponent<CascaderProps> {
  render() {
    const { popupClassName, onChange, ...option } = this.props;
    return (
      <div className={styles.cascader}>
        <AntdCascader
          popupClassName={classNames(popupClassName, styles.popupDown)}
          onChange={onChange}
          {...option}
        />
      </div>
    );
  }
}
export default Cascader;
