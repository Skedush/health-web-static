import React, { PureComponent } from 'react';
import Icon from '../Icon';
import styles from './index.less';

interface ExpandBtnProps {
  isExpand?: boolean;
  onClick?: Function;
}

class ExpandBtn extends PureComponent<ExpandBtnProps> {
  static defaultProps = {
    isExpand: false,
  };

  render() {
    const { isExpand } = this.props;
    const type = isExpand ? 'up' : 'down';
    const text = isExpand ? '收起' : '展开';

    return (
      <div className={styles.container} onClick={this.onClick}>
        <Icon type={type} />
        <span className={styles.text}>{text}</span>
      </div>
    );
  }

  onClick = () => {
    const { onClick } = this.props;
    if (onClick) {
      onClick();
    }
  };
}

export default ExpandBtn;
