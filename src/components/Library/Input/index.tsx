import React, { PureComponent } from 'react';
import { Input as AntdInput } from 'antd';
import styles from './index.less';
import { InputProps as AntdInputProps } from 'antd/lib/input/Input';
import { GroupProps as AntdGroupProps } from 'antd/lib/input';

export interface InputProps extends AntdInputProps {}
export interface GroupProps extends AntdGroupProps {}
class Input extends PureComponent<InputProps> {
  static TextArea = AntdInput.TextArea;
  static Password = AntdInput.Password;
  static Group = AntdInput.Group;

  render() {
    const { hidden } = this.props;
    let style = {};
    if (hidden) {
      style = { display: 'none' };
    }
    return (
      <div className={styles.input} style={style}>
        <AntdInput maxLength={50} {...this.props} />
      </div>
    );
  }
}
export default Input;
