import { Modal as AntdModal } from 'antd';
import { ModalProps as AntdModalProps } from 'antd/lib/modal';
import { Component } from 'react';
import styles from './index.less';

export interface ModalProps extends AntdModalProps {}

class Modal extends Component<ModalProps> {
  render() {
    const { children, centered = true, maskClosable = false, ...options } = this.props;
    // console.log('model', this.props);
    return (
      <AntdModal
        centered={centered}
        className={styles.modal}
        maskClosable={maskClosable}
        {...options}
      >
        {children}
      </AntdModal>
    );
  }
}

export default Modal;
