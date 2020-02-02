import React from 'react';
import { Spin, Tooltip, Dropdown, Menu, Icon } from '@/components/Library';
import styles from './index.less';
import { ButtonProps } from '../type';
import Button from '../Button';

const defaultOptions: CommonComponentProps = {
  delay: 500,
  size: 'default',
};
type CommonComponentProps = {
  delay: number;
  size: 'default' | 'small' | 'large' | undefined;
};

class CommonComponent {
  static renderLoading(options = defaultOptions) {
    return (
      <div className={styles.loading}>
        <Spin {...defaultOptions} {...options} />
      </div>
    );
  }

  static renderTableCol(text: any, record: object) {
    return (
      <div
        style={{
          wordWrap: 'break-word',
          wordBreak: 'break-all',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {text}
      </div>
    );
  }

  static renderTableOverFlowHidden(text: any, record?: object) {
    return (
      <Tooltip placement={'top'} title={text}>
        {text}
      </Tooltip>
    );
  }

  static renderTableImgCol(text: any, record: object) {
    return (
      <div style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}>
        <img className={styles.img} src={text} alt="" srcSet="" />
      </div>
    );
  }

  static renderMoreOperate(btnList: ButtonProps[], showNum: number = 2) {
    const first =
      showNum + 1 === btnList.length ? btnList : btnList.filter((v, i) => i <= showNum - 1);
    const back = showNum + 1 === btnList.length ? [] : btnList.filter((v, i) => i > showNum - 1);
    const menu = (
      <Menu>
        {back.map((prop, i) => (
          <Menu.Item key={i} onClick={prop.onClick as any}>
            <Icon type={prop.icon} />
            {prop.title}
          </Menu.Item>
        ))}
      </Menu>
    );
    return (
      <div className={styles.operate}>
        {first.map((props, i) => (
          <Button key={i} {...props} />
        ))}
        {back.length ? (
          <Dropdown overlay={menu} overlayClassName={styles.dropdownOverlay}>
            <Icon type={'pm-more'} className={styles.moreIcon} />
          </Dropdown>
        ) : (
          ''
        )}
      </div>
    );
  }
}

export default CommonComponent;
