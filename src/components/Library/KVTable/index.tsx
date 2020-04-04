import React, { PureComponent, ReactElement, CSSProperties } from 'react';
import styles from './index.less';

interface Props {
  list?: { name: any; value: any }[];
  children: ReactElement<KVTableChild>[] | ReactElement<KVTableChild> | any[];
  style?: CSSProperties;
}

interface ChildProps {
  name: string;
  /*
   * 24等分每行
   */
  span?: number;
}

class KVTableChild extends PureComponent<ChildProps> {
  render() {
    const { name, children, span } = this.props;
    const width = span ? `${(span / 24) * 100}%` : '33.33%';
    return (
      <div className={styles.infoField} style={{ flexBasis: width, maxWidth: width }}>
        <div className={styles.fieldName}>{name}</div>
        <div className={styles.fieldValue}>{children}</div>
      </div>
    );
  }
}

export class KVTable extends PureComponent<Props> {
  static Item = KVTableChild;

  render() {
    const { children, list, style } = this.props;
    if (list) {
      return (
        <div className={styles.infoList} style={style}>
          {list.map((item, index) => (
            <KVTableChild name={item.name} key={index}>
              {item.value}
            </KVTableChild>
          ))}
        </div>
      );
    }

    return <div className={styles.infoList}>{children}</div>;
  }
}

export default KVTable;
