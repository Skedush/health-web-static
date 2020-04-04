import React, { PureComponent } from 'react';
import { DatePicker as AntdDatePicker } from 'antd';
import {
  RangePickerProps as AntdRangePickerProps,
  RangePickerValue as AntdRangePickerValue,
} from 'antd/lib/date-picker/interface';
import classNames from 'classnames';
import styles from './RangePicker.less';
import moment, { Moment } from 'moment';

export interface RangePickerProps extends AntdRangePickerProps {
  monthsRange?: any[];
  timeBegin?: Moment;
}
export declare type RangePickerValue = AntdRangePickerValue;

const AntdRangePicker = AntdDatePicker.RangePicker;

interface RangePickerState {
  earlyTime?: Moment;
}

class RangePicker extends PureComponent<RangePickerProps, RangePickerState> {
  constructor(props: Readonly<RangePickerProps>) {
    super(props);
    this.state = {};
  }
  render() {
    const { dropdownClassName, className, placeholder, showTime, ...options } = this.props;
    const { earlyTime } = this.state;
    let { monthsRange = [1, 3, 6, 12, 24, 36, '永久'], timeBegin = moment() } = this.props;
    timeBegin
      .set('hour', 0)
      .set('minute', 0)
      .set('second', 0);
    const rangesGroup: any = {};
    if (earlyTime) {
      timeBegin = earlyTime;
    }
    const timeEnd = moment(timeBegin)
      .add(1, 'day')
      .subtract(1, 'seconds');
    if (monthsRange) {
      monthsRange.forEach(item => {
        if (item === '永久') {
          rangesGroup[item] = [timeBegin, moment(timeEnd).add(100, 'year')];
        } else if (item < 12) {
          rangesGroup[item + '个月'] = [timeBegin, moment(timeEnd).add(item, 'months')];
        } else if (item >= 12) {
          rangesGroup[item / 12 + '年'] = [timeBegin, moment(timeEnd).add(item, 'months')];
        }
      });
    }
    return (
      <AntdRangePicker
        // {...this.props}
        ranges={rangesGroup}
        placeholder={placeholder as [string, string]}
        showTime={
          typeof showTime === 'boolean' && 'object'
            ? showTime
            : {
                hideDisabledOptions: true,
                defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
              }
        }
        getCalendarContainer={this.props.getCalendarContainer}
        onCalendarChange={this.onCalendarChange}
        className={classNames(styles.rangePicker, className)}
        onChange={this.props.onChange}
        dropdownClassName={classNames(styles.rangePickerDropddwn, dropdownClassName)}
        {...options}
      />
    );
  }
  onCalendarChange = (dates, dateStrings) => {
    console.log('dates: ', dates);
    this.setState({
      earlyTime: dates[0],
    });
  };
}

export default RangePicker;
