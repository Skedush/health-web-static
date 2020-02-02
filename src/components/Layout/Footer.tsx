import React, { PureComponent } from 'react';
import styles from './Footer.less';

class Footer extends PureComponent {
  render() {
    return <div className={styles.copyRight}>@ 2019 浙江立地有限公司版权所有</div>;
  }
}

export default Footer;
