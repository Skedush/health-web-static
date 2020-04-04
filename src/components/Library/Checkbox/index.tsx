import React, { PureComponent } from 'react';
import { Checkbox as AntdCheckbox } from 'antd';
import styles from './index.less';
import {
  CheckboxProps as AntdCheckboxProps,
  CheckboxGroupProps as AntdCheckboxGroupProps,
} from 'antd/lib/checkbox';

export interface CheckboxProps extends AntdCheckboxProps {}
export interface CheckboxGroupProps extends AntdCheckboxGroupProps {}
class Checkbox extends PureComponent<CheckboxProps> {
  static Group = AntdCheckbox.Group;

  render() {
    return (
      <div className={styles.checkbox}>
        <AntdCheckbox {...this.props} />
      </div>
    );
  }
}
export default Checkbox;
