import { InputNumber as AntdInputNumber } from 'antd';
import { PureComponent } from 'react';
import { InputNumberProps as ANtdInputNumberProps } from 'antd/lib/input-number';
import styles from './index.less';

export interface InputNumberProps extends ANtdInputNumberProps {}

class InputNumber extends PureComponent<InputNumberProps> {
  render() {
    return (
      <div className={styles.input}>
        <AntdInputNumber maxLength={50} {...this.props} />
      </div>
    );
  }
}
export default InputNumber;
