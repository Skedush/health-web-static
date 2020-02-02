import React, { PureComponent } from 'react';
import { Select as AntdSelect } from 'antd';
import { SelectProps as AntdSelectProps, OptionProps as AntdOptionProps } from 'antd/lib/select';
import styles from './index.less';
import classNames from 'classnames';
import PinyinMatch from '@/utils/PinYin';

export interface OptionProps extends AntdOptionProps {}
export interface SelectProps extends AntdSelectProps {}

class Select extends PureComponent<SelectProps> {
  static Option = AntdSelect.Option;

  filterOption = (inputValue, { props }) => {
    if (this.props.onSearch) {
      return true;
    } else {
      return PinyinMatch.match(props.children, inputValue);
    }
  };

  render() {
    const {
      dropdownClassName,
      showSearch = true,
      optionFilterProp = 'children',
      filterOption,
      allowClear,
      ...options
    } = this.props;
    return (
      <div className={styles.select}>
        <AntdSelect
          allowClear={allowClear || true}
          showSearch={showSearch}
          filterOption={filterOption || this.filterOption}
          optionFilterProp={optionFilterProp}
          dropdownClassName={classNames(styles.option, dropdownClassName)}
          {...options}
        />
      </div>
    );
  }
}
export default Select;
