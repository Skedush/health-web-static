import { RadioGroupProps as ANtdRadioGroupProps } from 'antd/lib/radio/interface';
import { PureComponent } from 'react';
import AntdRadioGroup from 'antd/lib/radio/group';
import classNames from 'classnames';
import styles from './index.less';

export interface RadioGroupProps extends ANtdRadioGroupProps {}

class RadioGroup extends PureComponent<RadioGroupProps> {
  render() {
    const { children, className } = this.props;
    return (
      <AntdRadioGroup {...this.props} className={classNames(className, styles.radioGroup)}>
        {children}
      </AntdRadioGroup>
    );
  }
}

export default RadioGroup;
