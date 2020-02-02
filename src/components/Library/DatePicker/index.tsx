import React, { PureComponent } from 'react';
import { DatePicker as AntdDatePicker } from 'antd';
import RangePicker, { RangePickerValue } from './RangePicker';
import {
  DatePickerProps as AntdDatePickerProps,
  RangePickerProps as AntdRangePickerProps,
} from 'antd/lib/date-picker/interface';
import classNames from 'classnames';
import styles from './index.less';
import moment from 'moment';

export interface DatePickerProps extends AntdDatePickerProps {}
export interface RangePickerProps extends AntdRangePickerProps {}
export type RangePickerValue = RangePickerValue;

class DatePicker extends PureComponent<DatePickerProps> {
  static RangePicker = RangePicker;
  // static MonthPicker = AntdDatePicker.MonthPicker;
  // static WeekPicker = AntdDatePicker.WeekPicker;

  render() {
    const { dropdownClassName, className, placeholder, ...option } = this.props;
    return (
      <AntdDatePicker
        // {...this.props}
        placeholder={placeholder as string}
        showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
        getCalendarContainer={this.props.getCalendarContainer}
        className={classNames(styles.datePicker, className)}
        onChange={this.props.onChange}
        dropdownClassName={classNames(styles.datePickerDropddwn, dropdownClassName)}
        {...option}
      />
    );
  }
}

export default DatePicker;
