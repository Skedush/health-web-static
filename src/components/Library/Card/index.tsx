import React, { PureComponent } from 'react';
import { Card as AntdCard } from 'antd';
import { CardProps as AntdCardProps } from 'antd/lib/card';
export interface CardProps extends AntdCardProps {}

class Card extends PureComponent<CardProps> {
  static Grid = AntdCard.Grid;
  static Meta = AntdCard.Meta;
  render() {
    const { children, ...options } = this.props;
    return <AntdCard {...options}>{children}</AntdCard>;
  }
}
export default Card;
