import React, { PureComponent, ReactNode } from 'react';
import styles from './index.less';
import classNames from 'classnames';

export interface ISimplyColumn {
  span: number; // 每列占的宽度 最大24
  name: string;
  key?: string;
  type?: 'key';
  className?: string;
  render?: (record: any) => void;
}

interface Props {
  columns: ISimplyColumn[];
  dataSource: any[];
  scrollH?: string | number;
  tableStyle?: 'noBorder' | 'small';
  headerSlot?: string | ReactNode;
}

export default class SimplyTable extends PureComponent<Props> {
  handleHeight() {
    const { scrollH } = this.props;
    if (typeof scrollH === 'string') {
      return scrollH;
    } else if (typeof scrollH === 'number') {
      return scrollH + 'px';
    } else {
      return 'auto';
    }
  }

  handleWidth(column) {
    return {
      flexBasis: column.span ? `${(column.span / 24) * 100}%` : '1',
      maxWidth: column.span ? `${(column.span / 24) * 100}%` : 'auto',
      minWidth: column.span ? `${(column.span / 24) * 100}%` : 'auto',
    };
  }

  renderTitle() {
    const { columns, scrollH, headerSlot, tableStyle } = this.props;
    const className = tableStyle === 'small' ? styles.small : '';
    return (
      <div className={classNames(styles.header, scrollH ? styles.scrollHeader : '', className)}>
        <div className={classNames(styles.infoRow, styles.colTitle)}>
          {columns.map((item, i) => {
            return (
              <div key={i} className={styles.fieldCol} style={this.handleWidth(item)}>
                {item.name}
              </div>
            );
          })}
        </div>
        <div className={styles.headerSlot}>{headerSlot}</div>
      </div>
    );
  }

  renderBody() {
    const { columns, dataSource, tableStyle } = this.props;
    const className = tableStyle === 'small' ? styles.smallBody : '';
    return dataSource.map((datum, index) => {
      return (
        <div className={classNames(styles.infoRow, className)} key={index}>
          {columns.map((item, i) => {
            return (
              <div
                key={i}
                className={classNames(styles.fieldCol, item.className)}
                style={this.handleWidth(item)}
              >
                {item.type === 'key'
                  ? index + 1
                  : item.key
                  ? datum[item.key]
                  : item.render && item.render(datum)}
              </div>
            );
          })}
        </div>
      );
    });
  }

  render() {
    const { tableStyle } = this.props;
    return (
      <div
        className={classNames(
          styles.infoList,
          tableStyle === 'noBorder' ? styles.noBorder : '',
          tableStyle === 'small' && styles.small,
        )}
        style={{ maxHeight: this.handleHeight() }}
      >
        {this.renderTitle()}
        {this.renderBody()}
      </div>
    );
  }
}
